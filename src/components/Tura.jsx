import { Nazad } from './Ikone'
import { useJ } from '../i18n'

export default function Tura({ turaId, nazad, idi, pecati }) {
  const { t, s } = useJ()
  const tu = s.ture.find((x) => x.id === turaId)
  if (!tu) return null

  return (
    <>
      <header className="zaglavlje" style={{ background: tu.boja }}>
        <div className="zaglavlje-red">
          <button className="dugme-nazad" onClick={nazad} aria-label={t.nazad}><Nazad /></button>
          <span className="oznaka-mala">{t.tura} {tu.broj}</span>
        </div>
        <h1 className="naslov-ekrana">{tu.naslov}</h1>
        <p className="podnaslov">{tu.opis}</p>
      </header>
      <div className="traka" />

      <div className="sadrzaj-ekrana">
        {tu.spoljna ? (
          <div className="obavestenje">
            <p>{t.spoljna1}</p>
            <p>{t.spoljna2}</p>
          </div>
        ) : (
          <>
            <ol className="lista-mesta">
              {tu.mesta.map((id, i) => {
                const m = s.mesta[id]
                const imaPecat = pecati.includes(id)
                return (
                  <li key={id}>
                    <button className="kartica-mesta" onClick={() => idi('mesto', id)}>
                      <span className={`krug ${imaPecat ? 'zlatni' : ''}`}>{i + 1}</span>
                      <span className="kartica-tekst">
                        <b>{m.ime}</b>
                        <small>{m.kratko}</small>
                      </span>
                      {imaPecat && <span className="stiklirano">✓</span>}
                    </button>
                  </li>
                )
              })}
            </ol>
            <button className="dugme-siroko" onClick={() => idi('most')}>{t.naMapi}</button>
          </>
        )}
      </div>
    </>
  )
}
