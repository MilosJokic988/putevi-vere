import { useState } from 'react'
import { licnosti } from './data/licnosti'

// Kolekcija „Ruski Beograđani“: kartice se otključavaju pečatima.
export default function Licnosti({ t, jezik, pecati, lokacije, setIzabrana }) {
  const [otvorena, setOtvorena] = useState(null)
  const otkljucana = (l) => l.lokacije.some((id) => pecati.includes(id))
  const broj = licnosti.filter(otkljucana).length

  return (
    <div className="rb-licnosti">
      <p className="rb-licnosti-uvod">{t.licnostiUvod}</p>
      <p className="rb-licnosti-broj">{t.sakupljeno(broj, licnosti.length)}</p>

      <ul className="rb-licnosti-mreza">
        {licnosti.map((l) => {
          const otk = otkljucana(l)
          const tekst = l[jezik]
          const inicijali = tekst.ime
            .split(' ')
            .map((r) => r[0])
            .join('')
          const gde = lokacije.find((x) => x.id === l.lokacije[0])
          return (
            <li key={l.id}>
              {otk ? (
                <button
                  className={`rb-licnost ${otvorena === l.id ? 'rb-otvorena' : ''}`}
                  onClick={() => setOtvorena(otvorena === l.id ? null : l.id)}
                  aria-expanded={otvorena === l.id}
                >
                  <span className="rb-licnost-portret" aria-hidden="true">{inicijali}</span>
                  <span className="rb-licnost-ime">{tekst.ime}</span>
                  <span className="rb-licnost-uloga">
                    {tekst.uloga}
                    {l.godine ? ` · ${l.godine}` : ''}
                  </span>
                </button>
              ) : (
                <button
                  className="rb-licnost rb-zakljucana"
                  onClick={() => gde && setIzabrana(gde.id)}
                  title={t.otkljucajNa(gde ? gde[jezik].naziv : '')}
                >
                  <span className="rb-licnost-portret" aria-hidden="true">?</span>
                  <span className="rb-licnost-ime">{t.zakljucano}</span>
                  <span className="rb-licnost-uloga">{t.otkljucajNa(gde ? gde[jezik].naziv : '')}</span>
                </button>
              )}
              {otk && otvorena === l.id && <p className="rb-licnost-bio">{tekst.bio}</p>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
