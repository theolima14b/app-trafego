import { useEffect, useMemo, useRef, useState } from 'react'

export default function CRM() {
  const STORAGE_KEY = 'crm:contacts'
  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')
  const [filterField, setFilterField] = useState('all') // all | name | email | phone | status
  const [filterMode, setFilterMode] = useState('contains') // contains | exact
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'cliente',
    lastContact: ''
  })

  // Load from localStorage on mount, initialize with seed if empty
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const loaded = JSON.parse(raw)
        setContacts(loaded)
      } else {
        // seed with sample data like the screenshot
        const seed = [
          { id: crypto.randomUUID(), name: 'João Silva', email: 'joao@exemplo.com', phone: '(11) 98765-4321', status: 'cliente', lastContact: '2024-01-14' },
          { id: crypto.randomUUID(), name: 'Maria Santos', email: 'maria@exemplo.com', phone: '(21) 97654-3210', status: 'lead', lastContact: '2024-01-19' },
          { id: crypto.randomUUID(), name: 'Pedro Costa', email: 'pedro@exemplo.com', phone: '(31) 96543-2109', status: 'prospect', lastContact: '2024-01-17' }
        ]
        setContacts(seed)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      }
    } catch (e) {
      console.warn('CRM: failed to load storage', e)
    }
  }, [])

  // Persist contacts to localStorage whenever they change (skip if empty on initial render)
  useEffect(() => {
    if (contacts.length === 0) return // Don't save empty array on mount
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
    } catch (e) {
      console.warn('CRM: failed to save storage', e)
    }
  }, [contacts])

  const filtered = useMemo(() => {
    const normalize = (s) => String(s ?? '').toLowerCase().trim()
    const qRaw = search.trim()
    if (!qRaw) return contacts
    const q = normalize(qRaw)

    const matches = (value) => {
      const v = normalize(value)
      if (filterMode === 'exact') return v === q
      // contains: check if the query is contained in any word
      return v.split(/\s+/).some(word => word.includes(q))
    }

    const test = (c) => {
      if (filterField === 'name') return matches(c.name)
      if (filterField === 'email') return matches(c.email)
      if (filterField === 'phone') return matches(c.phone)
      if (filterField === 'status') return matches(c.status)
      // all fields
      return (
        matches(c.name) || matches(c.email) || matches(c.phone) || matches(c.status)
      )
    }

    return contacts.filter(test)
  }, [contacts, search, filterField, filterMode])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length])
  const visible = useMemo(() => {
    const clamped = Math.min(page, totalPages)
    const start = (clamped - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, totalPages])

  useEffect(() => { 
    // adjust page if filter shrinks list
    const newTotal = Math.max(1, Math.ceil(filtered.length / pageSize))
    if (page > newTotal) setPage(newTotal)
  }, [filtered.length])

  const resetForm = () => setForm({ name: '', email: '', phone: '', status: 'cliente', lastContact: '' })

  const openModal = () => { setEditingId(null); resetForm(); setIsModalOpen(true) }
  const openEdit = (c) => { 
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone, status: c.status, lastContact: c.lastContact })
    setIsModalOpen(true)
  }
  const closeModal = () => setIsModalOpen(false)

  const addContact = (e) => {
    e?.preventDefault?.()
    if (!form.name || !form.email) return
    if (editingId) {
      setContacts(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c))
    } else {
      const newC = { id: crypto.randomUUID(), ...form }
      setContacts(prev => [newC, ...prev])
      setPage(1)
    }
    closeModal()
  }

  const deleteContact = (id) => {
    if (!id) return
    const ok = window.confirm('Deseja realmente excluir este contato?')
    if (!ok) return
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  const fmtDate = (iso) => {
    if (!iso) return '-'
    try {
      const [y,m,d] = iso.split('-')
      return `${d}/${m}/${y}`
    } catch { return iso }
  }

  const StatusPill = ({ value }) => {
    const v = (value||'').toLowerCase()
    const map = {
      cliente: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/60',
      lead: 'bg-yellow-900/20 text-yellow-300 border-yellow-600/50',
      prospect: 'bg-indigo-900/20 text-indigo-300 border-indigo-700/60'
    }
    const cls = map[v] || 'bg-gray-800 text-gray-300 border-gray-700'
    return <span className={`text-xs px-3 py-1 rounded-full border ${cls}`}>{v || '-'}</span>
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">CRM</h1>
          <p className="text-sm text-gray-400">Gerencie seus contatos e leads</p>
        </div>
        <button onClick={openModal} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-gray-700">+</span>
          <span>Novo Contato</span>
        </button>
      </div>

      {/* Card */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-gray-100">Contatos</h2>
          <p className="text-xs text-gray-500 mt-1">Total de {contacts.length} contatos no sistema</p>
        </div>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Campo</label>
              <select value={filterField} onChange={(e)=>{ setFilterField(e.target.value); setPage(1) }} className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-blue-500">
                <option value="all">Todos</option>
                <option value="name">Nome</option>
                <option value="email">Email</option>
                <option value="phone">Telefone</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tipo de filtro</label>
              <select value={filterMode} onChange={(e)=>{ setFilterMode(e.target.value); setPage(1) }} className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-blue-500">
                <option value="contains">Contém</option>
                <option value="exact">Termo exato</option>
              </select>
            </div>
            <div className="relative">
              <label className="block text-xs text-gray-400 mb-1">Termo</label>
              <input
                value={search}
                onChange={(e)=>{ setSearch(e.target.value); setPage(1) }}
                placeholder="Digite o termo..."
                className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-500"
              />
              <svg className="absolute left-3 bottom-2.5 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[28%]" />
              <col className="w-[12%]" />
              <col className="w-[13%]" />
              <col className="w-[7%]" />
            </colgroup>
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase tracking-wider px-6 py-3">Nome</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase tracking-wider px-6 py-3">Contato</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase tracking-wider px-6 py-3">Último Contato</th>
                <th className="text-left text-xs font-semibold text-gray-300 uppercase tracking-wider px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {visible.map(c => (
                <tr key={c.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis">{c.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-gray-300">
                      <div className="inline-flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l-4 4m4-4l-4-4"/></svg>
                        <span className="text-sm truncate">{c.email}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.368l.518 1.553A2 2 0 0012.62 7H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/></svg>
                        <span className="text-sm truncate">{c.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusPill value={c.status} /></td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span className="text-sm">{fmtDate(c.lastContact)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button title="Editar" onClick={()=>openEdit(c)} className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M4 20h4l10.607-10.607a2.5 2.5 0 10-3.536-3.536L4 16.464V20z"/></svg>
                      </button>
                      <button title="Excluir" onClick={()=>deleteContact(c.id)} className="p-2 rounded bg-gray-800 border border-gray-700 text-red-300 hover:bg-red-900/30">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 001-1h4a1 1 0 001 1m-6 0H4m14 0h-3"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-gray-500" colSpan={5}>Nenhum contato encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">Mostrando <span className="font-medium">{filtered.length ? (Math.min((page-1)*pageSize+1, filtered.length)) : 0}</span>–<span className="font-medium">{Math.min(page*pageSize, filtered.length)}</span> de <span className="font-medium">{filtered.length}</span></p>
          <div className="flex gap-2">
            <button onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={page===1} className="px-3 py-2 text-sm text-gray-200 bg-gray-800 border border-gray-700 rounded disabled:opacity-50 hover:bg-gray-700">Anterior</button>
            <button onClick={()=>setPage(p=>Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-3 py-2 text-sm text-gray-200 bg-gray-800 border border-gray-700 rounded disabled:opacity-50 hover:bg-gray-700">Próxima</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">{editingId ? 'Editar Contato' : 'Novo Contato'}</h3>
            <form onSubmit={addContact} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Telefone</label>
                <input value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select value={form.status} onChange={e=>setForm(f=>({...f, status:e.target.value}))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500">
                    <option value="cliente">cliente</option>
                    <option value="lead">lead</option>
                    <option value="prospect">prospect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Último contato</label>
                  <input type="date" value={form.lastContact} onChange={e=>setForm(f=>({...f, lastContact:e.target.value}))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-200 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-500">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
