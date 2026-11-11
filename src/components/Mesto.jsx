import { useState } from 'react'
import { Nazad, Pecat } from './Ikone'
import { useJ } from '../i18n'

const POGLEDI = ['istorija', 'vera', 'put', 'kontekst']

export default function Mesto({ mestoId, nazad, pecati, dodajPecat, otvoriZitije }) {
  const { t, s } = useJ()
  const [pogled, setPogled] = useState('istorija')
  const m = s.mesta[mestoId]
  if (!m) return null
  const tekst = m.pogledi?.[pogled]
  const imaPecat = pecati.includes(mestoId)

  return (
    <>
      <header className="zaglavlje mesto-zaglavlje">
        <div className="zaglavlje-red">
          <button className="dugme-nazad" onClick={nazad} aria-label={t.nazad}><Nazad /></button>
          <span className="foto-oznaka">{t.foto}</span>
        </div>
        <span className="oznaka-mala">{m.tura ? `${t.tura} ${m.tura}` : t.mesto}</span>
        <h1 className="naslov-ekrana">{m.ime}</h1>
        {m.autor && <p className="podnaslov">{t.uneo}: {m.autor}</p>}
      </header>
      <div className="traka" />

      <div className="sadrzaj-ekrana">
        {m.proveriti && <p className="upozorenje">{t.proveritiMesto}</p>}

        <div className="kartice-izbor cetiri" role="tablist">
          {POGLEDI.map((x) => (
            <button key={x} role="tab" aria-selected={pogled === x} className={pogled === x ? 'aktivno' : ''} onClick={() => setPogled(x)}>
              {t.pogledi[x]}
            </button>
          ))}
        </div>

        <div className="autor">
          <span className="autor-krug">{t.slova[pogled]}</span>
          <span>{t.pise} <b>{t.autori[pogled]} {t.tima}</b></span>
        </div>

        {tekst ? <p className="tekst-pogleda">{tekst}</p> : <p className="u-pripremi">{t.uPripremiPogled(t.autori[pogled])}</p>}

        {m.zitije && <button className="dugme-siroko obrub" onClick={() => otvoriZitije(m.zitije)}>{t.celaPrica}</button>}

        {imaPecat ? (
          <div className="pecat-dobijen">
            <Pecat tekst="2026" />
            <div>
              <b>{t.pecatUPasosu}</b>
              <small>{t.bioSi}</small>
            </div>
          </div>
        ) : (
          <button className="dugme-siroko crveno" onClick={() => dodajPecat(mestoId)}>{t.dodajPecat}</button>
        )}
      </div>
    </>
  )
}
