import { Nazad } from './Ikone'
import { useJ } from '../i18n'

export default function Koreni({ nazad, otvoriZitije, idi }) {
  const { t, s } = useJ()
  return (
    <>
      <header className="zaglavlje">
        <div className="zaglavlje-red">
          <button className="dugme-nazad" onClick={nazad} aria-label={t.nazad}><Nazad /></button>
          <span className="oznaka-mala">{t.uvod}</span>
        </div>
        <h1 className="naslov-ekrana">{t.koreniNaslov}</h1>
      </header>
      <div className="traka" />

      <div className="sadrzaj-ekrana">
        <p className="uvodni">
          <span className="inicijal">{t.koreniInicijal}</span>{t.koreniUvod}
        </p>

        <ol className="vremenska">
          {s.vremenskaLinija.map((d) => (
            <li key={d.id} className="dogadjaj">
              <span className="godina">{d.godina}</span>
              <span className={`tackica ${d.istaknuto ? 'istaknuta-tacka' : ''}`} aria-hidden="true" />
              <span className="dogadjaj-tekst">
                <button className="ime-link" onClick={() => otvoriZitije(d.id)}>{d.naslov}</button>
                <small>{d.opis}</small>
              </span>
            </li>
          ))}
        </ol>
        <p className="savet">{t.dodirniIme}</p>

        <button className="dugme-siroko" onClick={() => idi('reci')}>{t.igraLink}</button>
      </div>
    </>
  )
}
