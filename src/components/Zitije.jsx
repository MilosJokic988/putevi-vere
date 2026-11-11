import { useState } from 'react'
import { useJ } from '../i18n'

const VRSTA = { 'житије': 'zitije', 'житие': 'zitije', 'животопис': 'zivotopis', 'жизнеописание': 'zivotopis' }

// Panel odozdo (na sajtu sa desne strane) sa žitijem, životopisom ili opisom događaja
export default function Zitije({ id, zatvori, otvoriZitije, idi }) {
  const { t, s } = useJ()
  const [kartica, setKartica] = useState('tekst')
  const z = s.zitija[id]
  if (!z) return null

  const vezeZitija = (z.veze || []).filter((v) => !v.startsWith('most:') && s.zitija[v])
  const naMapi = (z.veze || []).some((v) => v.startsWith('most:'))
  const vrsta = VRSTA[z.vrsta]

  return (
    <div className="prekrivac" onClick={zatvori}>
      <article className="list" role="dialog" aria-modal="true" aria-label={z.naslov} onClick={(e) => e.stopPropagation()}>
        <div className="rucica" aria-hidden="true" />
        <button className="zatvori" onClick={zatvori} aria-label={t.zatvori}>×</button>

        <div className="list-zaglavlje">
          <div className="ikona-svetitelja" aria-hidden="true">{z.inicijal}</div>
          <div>
            <span className="oznaka-mala crvena">{z.vrsta.toUpperCase()}</span>
            <h2>{z.naslov}</h2>
            <small>{z.podnaslov}</small>
          </div>
        </div>

        <div className="kartice-izbor" role="tablist">
          <button role="tab" aria-selected={kartica === 'tekst'} className={kartica === 'tekst' ? 'aktivno' : ''} onClick={() => setKartica('tekst')}>
            {vrsta === 'zitije' ? t.zitije : vrsta === 'zivotopis' ? t.zivotopis : t.prica}
          </button>
          <button role="tab" aria-selected={kartica === 'veze'} className={kartica === 'veze' ? 'aktivno' : ''} onClick={() => setKartica('veze')}>
            {t.veze}
          </button>
        </div>

        {kartica === 'tekst' ? (
          <div className="list-tekst">
            {z.tekst.map((p, i) => (
              <p key={i}>
                {i === 0 && <span className="inicijal mali">{p[0]}</span>}
                {i === 0 ? p.slice(1) : p}
              </p>
            ))}
            {s.mestaPrica[id] && (
              <button className="dugme-siroko dugme-mapa" onClick={() => idi('mapaPrice', id)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                <span>{t.gdeSeDogodilo}</span>
              </button>
            )}
            {z.praznik && (
              <div className="praznik">
                <span className="oznaka-mala crvena">{t.praznik}</span>
                <b>{t.poNovom} {z.praznik[0]}</b>
                <span>{t.poStarom} {z.praznik[1]}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="list-tekst">
            <ul className="lista-veza">
              {vezeZitija.map((v) => (
                <li key={v}>
                  <button className="ime-link" onClick={() => otvoriZitije(v)}>{s.zitija[v].naslov}</button>
                </li>
              ))}
            </ul>
            {naMapi && <button className="dugme-siroko" onClick={() => idi('most')}>{t.naMapi}</button>}
          </div>
        )}

        <p className="potpis">{t.potpis}</p>
      </article>
    </div>
  )
}
