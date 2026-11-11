import { Nazad } from './Ikone'
import { useJ } from '../i18n'

const NASLOVI_SR = { vera: 'Вера и светиње', emigracija: 'Руска емиграција', dobrovoljci: 'Руски добровољци', imena: 'Имена', saradnici: 'Додали сарадници' }

export default function SvaMesta({ nazad, idi, otvoriZitije }) {
  const { t, s } = useJ()
  const naslovi = s.kategorijeNaslovi || NASLOVI_SR
  const otvori = (id) => {
    const m = s.mesta[id]
    if (m.pogledi) idi('mesto', id)
    else if (m.zitije) otvoriZitije(m.zitije)
    else idi('most')
  }
  return (
    <>
      <header className="zaglavlje">
        <div className="zaglavlje-red">
          <button className="dugme-nazad" onClick={nazad} aria-label={t.nazad}><Nazad /></button>
          <span className="oznaka-mala">{t.mestaBroj(Object.keys(s.mesta).length)}</span>
        </div>
        <h1 className="naslov-ekrana">{t.svaMesta}</h1>
        <p className="podnaslov">{t.svaMestaPodnaslov}</p>
      </header>
      <div className="traka" />
      <div className="sadrzaj-ekrana">
        {Object.entries(s.kategorijeMesta).map(([k, ids]) => (
          <section key={k} className="grupa-mesta">
            <h2 className="naslov-odeljka">{naslovi[k]}</h2>
            <ul className="lista-mesta">
              {ids.map((id) => {
                const m = s.mesta[id]
                return (
                  <li key={id}>
                    <button className="kartica-mesta" onClick={() => otvori(id)}>
                      <span className="krug mali-krug">{m.mapa === 'ru' ? t.oznakaRu : t.oznakaSr}</span>
                      <span className="kartica-tekst">
                        <b>{m.ime}</b>
                        <small>{m.kratko || t.uPripremi}</small>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
        <p className="savet">{t.svaMestaSavet}</p>
      </div>
    </>
  )
}
