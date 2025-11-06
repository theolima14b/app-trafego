import { useMemo, useState } from 'react'

export default function UTMGenerator() {
  const [form, setForm] = useState({
    siteUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
  })
  
  const [copied, setCopied] = useState(false)

  const allFieldsComplete = useMemo(() => {
    const { siteUrl, utmSource, utmMedium, utmCampaign } = form
    return [siteUrl, utmSource, utmMedium, utmCampaign].every(v => String(v).trim().length > 0)
  }, [form])

  const generatedUrl = useMemo(() => {
    if (!allFieldsComplete) return ''
    
    try {
      // Ensure URL has protocol
      let urlString = form.siteUrl.trim()
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        urlString = 'https://' + urlString
      }
      
      const url = new URL(urlString)
      url.searchParams.set('utm_source', form.utmSource.trim())
      url.searchParams.set('utm_medium', form.utmMedium.trim())
      url.searchParams.set('utm_campaign', form.utmCampaign.trim())
      if (form.utmTerm.trim()) {
        url.searchParams.set('utm_term', form.utmTerm.trim())
      }
      if (form.utmContent.trim()) {
        url.searchParams.set('utm_content', form.utmContent.trim())
      }
      return url.toString()
    } catch (error) {
      console.error('Erro ao gerar URL:', error)
      // Fallback: build URL manually
      const params = new URLSearchParams({
        utm_source: form.utmSource.trim(),
        utm_medium: form.utmMedium.trim(),
        utm_campaign: form.utmCampaign.trim()
      })
      if (form.utmTerm.trim()) {
        params.set('utm_term', form.utmTerm.trim())
      }
      if (form.utmContent.trim()) {
        params.set('utm_content', form.utmContent.trim())
      }
      return `${form.siteUrl.trim()}?${params.toString()}`
    }
  }, [form, allFieldsComplete])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-[1100px] w-full sm:w-[85vw] md:w-[70vw] lg:w-[60vw] xl:w-[55vw] mx-auto mt-4 md:mt-8 bg-white p-6 md:p-8 rounded-xl shadow-md border-2 border-gray-200 text-left" role="region" aria-label="Gerador de UTM">
      <div className="mb-4">
        <h1 className="text-xl text-gray-900 mb-1">Gerador de UTM</h1>
        <p className="text-sm text-gray-600">Preencha os campos abaixo para gerar sua URL com parâmetros UTM</p>
      </div>

  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="siteUrl" className="text-sm text-gray-700">URL do Site *</label>
          <input 
            id="siteUrl" 
            name="siteUrl" 
            value={form.siteUrl} 
            onChange={handleChange} 
            placeholder="https://exemplo.com/pagina"
            className="w-full h-[38px] px-2.5 border border-gray-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="utmSource" className="text-sm text-gray-700">Fonte da Campanha *</label>
          <input 
            id="utmSource" 
            name="utmSource" 
            value={form.utmSource} 
            onChange={handleChange} 
            placeholder="ex: google, facebook"
            className="w-full h-[38px] px-2.5 border border-gray-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="utmMedium" className="text-sm text-gray-700">Mídia *</label>
          <input 
            id="utmMedium" 
            name="utmMedium" 
            value={form.utmMedium} 
            onChange={handleChange} 
            placeholder="ex: cpc, social, email"
            className="w-full h-[38px] px-2.5 border border-gray-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="utmCampaign" className="text-sm text-gray-700">Nome da Campanha *</label>
          <input 
            id="utmCampaign" 
            name="utmCampaign" 
            value={form.utmCampaign} 
            onChange={handleChange} 
            placeholder="ex: lancamento_q4"
            className="w-full h-[38px] px-2.5 border border-gray-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="utmTerm" className="text-sm text-gray-700">Termo</label>
          <input 
            id="utmTerm" 
            name="utmTerm" 
            value={form.utmTerm} 
            onChange={handleChange} 
            placeholder="ex: palavra-chave"
            className="w-full h-[38px] px-2.5 border border-gray-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="utmContent" className="text-sm text-gray-700">Conteúdo</label>
          <input 
            id="utmContent" 
            name="utmContent" 
            value={form.utmContent} 
            onChange={handleChange} 
            placeholder="ex: variação do criativo"
            className="w-full h-[38px] px-2.5 border border-gray-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {allFieldsComplete && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label htmlFor="generatedLink" className="text-sm text-gray-700">URL gerada</label>
            <div className="flex items-center gap-2 w-full">
              <input 
                id="generatedLink"
                type="text" 
                value={generatedUrl} 
                readOnly 
                className="flex-1 h-[38px] px-2.5 border border-gray-300 rounded-md text-[0.95rem] bg-white text-gray-700 font-mono"
              />
              <button 
                onClick={handleCopy} 
                className="w-[38px] h-[38px] min-h-[38px] flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-md shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Copiar link"
                disabled={!generatedUrl}
                title={copied ? "Link copiado!" : "Copiar link"}
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {copied && <p className="mt-2 text-sm text-green-500 font-medium animate-fade-in">Link copiado!</p>}
        </div>
      )}
    </div>
  )
}
