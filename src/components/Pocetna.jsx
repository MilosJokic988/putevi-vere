import { Krst } from './Ikone'
import { useJ } from '../i18n'
import MapaSrbije from './MapaSrbije'

export default function Pocetna({ idi, otvoriZitije }) {
  const { t, s } = useJ()
  const istaknuta = s.ture[2]
  return (
    <>
      <header className="zaglavlje">
        <div className="zaglavlje-red">
          <div className="logo">
            <Krst />
            <h1>{t.naslovApp}</h1>
          </div>
        </div>
        <p className="podnaslov">{t.podnaslovApp}</p>
      </header>
      <div className="traka" />

      <div className="sadrzaj-ekrana">
        <figure className="citat">
          <span className="citat-znak" aria-hidden="true">„</span>
          <blockquote>{s.citat.tekst}</blockquote>
          <figcaption>
            — {s.citat.autor}
            {s.citat.izvor && <span>, {s.citat.izvor}</span>}
          </figcaption>
        </figure>

        <MapaSrbije idi={idi} otvoriZitije={otvoriZitije} />

        <button className="istaknuta" onClick={() => idi('tura', istaknuta.id)}>
          <svg className="istaknuta-ukras" width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
            <circle cx="75" cy="75" r="70" stroke="#F3EBDD" strokeWidth="3" fill="none" />
            <circle cx="75" cy="75" r="52" stroke="#F3EBDD" strokeWidth="2" fill="none" />
            <path d="M75 30v90M50 55h50M40 78h70" stroke="#F3EBDD" strokeWidth="3" />
          </svg>
          <span className="oznaka-mala">{t.turaMeseca}</span>
          <span className="istaknuta-naslov">{istaknuta.naslov}</span>
          <span className="istaknuta-opis">{istaknuta.opis}</span>
        </button>

        <button className="baner-most" onClick={() => idi('most')}>
          <span className="baner-naslov">{t.mostVere}</span>
          <span className="baner-opis">{t.mostOpis}</span>
          <span className="strelica" aria-hidden="true">→</span>
        </button>

        <button className="baner-most baner-mesta" onClick={() => idi('svaMesta')}>
          <span className="baner-naslov">{t.svaMesta}</span>
          <span className="baner-opis">{t.svaMestaOpis}</span>
          <span className="strelica" aria-hidden="true">→</span>
        </button>

        <h2 className="naslov-odeljka">{t.sveTure}</h2>
        <ul className="lista-tura">
          {s.ture.map((tu) => (
            <li key={tu.id}>
              <button className="kartica-ture" onClick={() => (tu.ekran ? idi(tu.ekran) : idi('tura', tu.id))}>
                <span className="krug" style={{ background: tu.boja }}>{tu.broj}</span>
                <span className="kartica-tekst">
                  <b>{tu.naslov}</b>
                  <small>{tu.info}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="podnozje">{t.podnozje}</p>
      </div>
    </>
  )
}
