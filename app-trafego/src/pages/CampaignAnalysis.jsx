import { useState, useCallback, useMemo, useEffect } from 'react'

export default function CampaignAnalysis() {
  const STORAGE_KEY = 'campaignAnalysis:savedReport'
  const [csvData, setCsvData] = useState(null)
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState(null)
  const rowsPerPage = 15

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return { headers: [], rows: [] }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || ''
        return obj
      }, {})
    })

    return { headers, rows }
  }

  // Handle file upload
  const handleFile = useCallback((file) => {
    if (!file) return
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const { headers, rows } = parseCSV(text)
      setHeaders(headers)
      setRows(rows)
      setCsvData({ headers, rows })
      setSearchTerm('')
      setCurrentPage(1)
    }
    reader.readAsText(file)
  }, [])

  // Load saved report from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && Array.isArray(parsed.headers) && Array.isArray(parsed.rows)) {
          setHeaders(parsed.headers)
          setRows(parsed.rows)
          setCsvData({ headers: parsed.headers, rows: parsed.rows })
          setFileName(parsed.fileName || 'relatorio.csv')
          setCurrentPage(1)
          setSelectedRow(null)
        }
      }
    } catch (e) {
      // ignore malformed storage
      console.warn('Falha ao carregar relatório salvo', e)
    }
  }, [])

  // Persist report in localStorage whenever data changes
  useEffect(() => {
    if (rows && rows.length > 0 && headers && headers.length > 0) {
      try {
        const payload = {
          fileName,
          headers,
          rows,
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch (e) {
        console.warn('Falha ao salvar relatório localmente', e)
      }
    }
  }, [fileName, headers, rows])

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Reset and clear data
  const handleReset = () => {
    setCsvData(null)
    setHeaders([])
    setRows([])
    setFileName('')
    setSearchTerm('')
    setCurrentPage(1)
    setSelectedRow(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      // ignore
    }
  }

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows
    
    const term = searchTerm.toLowerCase()
    return rows.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(term)
      )
    )
  }, [rows, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage)
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredRows.slice(start, start + rowsPerPage)
  }, [filteredRows, currentPage, rowsPerPage])

  // Render Dashboard view when row is selected
  if (selectedRow) {
    return (
      <div className="max-w-[1400px] w-full mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard de Performance</h1>
            <p className="text-sm text-gray-600">Análise detalhada do registro selecionado</p>
          </div>
          <button
            onClick={() => setSelectedRow(null)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Voltar para lista
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {headers.map((header, idx) => {
            const value = selectedRow[header]
            
            // Choose icon based on field name
            const getIcon = () => {
              const lowerHeader = header.toLowerCase()
              if (lowerHeader.includes('click')) {
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              } else if (lowerHeader.includes('impress')) {
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              } else if (lowerHeader.includes('convers')) {
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              } else if (lowerHeader.includes('custo') || lowerHeader.includes('cost') || lowerHeader.includes('invest')) {
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              } else if (lowerHeader.includes('receita') || lowerHeader.includes('revenue')) {
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              } else if (lowerHeader.includes('roas')) {
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              } else if (lowerHeader.includes('ctr') || lowerHeader.includes('taxa')) {
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              }
              return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            }
            
            return (
              <div key={idx} className="bg-gray-800 text-white p-5 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide break-words">{header}</p>
                  <div className="text-gray-400 flex-shrink-0">{getIcon()}</div>
                </div>
                <p className="text-2xl font-bold break-words whitespace-normal">{value || '-'}</p>
              </div>
            )
          })}
        </div>

        {/* Insights Section */}
        <div className="bg-gray-800 text-white p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Insights e Recomendações</h2>
          <p className="text-sm text-gray-400 mb-4">Análise detalhada do desempenho desta entrada</p>
          
          <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">Análise Disponível</h3>
                <p className="text-sm text-gray-400 mb-3">Revise os dados acima para insights detalhados sobre performance.</p>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Recomendações:</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300 flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Compare os resultados com campanhas anteriores</span>
                    </li>
                    <li className="text-sm text-gray-300 flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Identifique padrões de performance por período</span>
                    </li>
                    <li className="text-sm text-gray-300 flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>Ajuste estratégias baseadas nos dados apresentados</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render table view
  return (
    <div className="max-w-[1400px] w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Análise de Campanha</h1>
        <p className="text-sm text-gray-600">Faça upload de um arquivo CSV e clique em uma linha para visualizar o dashboard de performance</p>
      </div>

      {!csvData ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-600 justify-center mb-2">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
              <span>Selecione um arquivo</span>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept=".csv"
                onChange={handleChange}
              />
            </label>
            <p className="pl-1">ou arraste aqui</p>
          </div>
          <p className="text-xs text-gray-500">CSV até 10MB</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File info */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500">{headers.length} colunas • {rows.length} linhas • Clique em uma linha para ver detalhes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-all"
                title="Remove o relatório salvo e limpa a tela"
              >
                Excluir relatório
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar em todos os campos..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="text-sm text-gray-600">
                {filteredRows.length} registros
              </div>
            </div>
          </div>

          {/* Data table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">#</th>
                    {headers.map(header => (
                      <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedRows.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedRow(row)}
                      className="hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-500 font-medium whitespace-nowrap">
                        {(currentPage - 1) * rowsPerPage + idx + 1}
                      </td>
                      {headers.map(header => (
                        <td key={header} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {row[header] || <span className="text-gray-400">-</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(currentPage * rowsPerPage, filteredRows.length)}</span> de{' '}
                    <span className="font-medium">{filteredRows.length}</span> resultados
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
