import { useMemo, useState } from 'react'
import './UTMGenerator.css'

export default function UTMGenerator() {
  const [form, setForm] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    utmId: '',
    extra: '',
  })

  const firstSixComplete = useMemo(() => {
    const { utmSource, utmMedium, utmCampaign, utmTerm, utmContent, utmId } = form
    return [utmSource, utmMedium, utmCampaign, utmTerm, utmContent, utmId].every(v => String(v).trim().length > 0)
  }, [form])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="utm-card" role="region" aria-label="Gerador de UTM">
      <div className="utm-card__header">
        <h1>Gerador de UTM</h1>
        <p className="utm-card__hint">Preencha os 6 campos obrigatórios; o campo extra libera em seguida.</p>
      </div>

      <div className="utm-grid">
        <div className="utm-field">
          <label htmlFor="utmSource">UTM Source</label>
          <input id="utmSource" name="utmSource" value={form.utmSource} onChange={handleChange} placeholder="ex: google, facebook" />
        </div>
        <div className="utm-field">
          <label htmlFor="utmMedium">UTM Medium</label>
          <input id="utmMedium" name="utmMedium" value={form.utmMedium} onChange={handleChange} placeholder="ex: cpc, social, email" />
        </div>
        <div className="utm-field">
          <label htmlFor="utmCampaign">UTM Campaign</label>
          <input id="utmCampaign" name="utmCampaign" value={form.utmCampaign} onChange={handleChange} placeholder="ex: lancamento_q4" />
        </div>
        <div className="utm-field">
          <label htmlFor="utmTerm">UTM Term</label>
          <input id="utmTerm" name="utmTerm" value={form.utmTerm} onChange={handleChange} placeholder="ex: palavra-chave" />
        </div>
        <div className="utm-field">
          <label htmlFor="utmContent">UTM Content</label>
          <input id="utmContent" name="utmContent" value={form.utmContent} onChange={handleChange} placeholder="ex: variação do criativo" />
        </div>
        <div className="utm-field">
          <label htmlFor="utmId">UTM ID</label>
          <input id="utmId" name="utmId" value={form.utmId} onChange={handleChange} placeholder="ex: id interno da campanha" />
        </div>
      </div>

      <div className="utm-extra">
        <div className="utm-field">
          <label htmlFor="extra">Campo extra</label>
          <input
            id="extra"
            name="extra"
            value={form.extra}
            onChange={handleChange}
            placeholder={firstSixComplete ? 'Agora liberado' : 'Preencha os 6 campos acima'}
            disabled={!firstSixComplete}
          />
        </div>
        <small className="utm-extra__note" aria-live="polite">
          {firstSixComplete ? 'Campo extra liberado.' : 'O campo extra será liberado após preencher os 6 campos obrigatórios.'}
        </small>
      </div>
    </div>
  )
}
