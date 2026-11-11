import NekadISad from './NekadISad'
import Zagonetka from './Zagonetka'
import Glas from './Glas'
import { zagonetke } from './data/zagonetke'
import { licnosti } from './data/licnosti'

export default function Detalji({
  t,
  jezik,
  lokacija,
  jePoseceno,
  promeniPoseceno,
  zatvori,
  imaPecat,
  dobijPecat,
  otvoriObjektiv,
  otvoriLicnosti
}) {
  const vezaneLicnosti = licnosti.filter((l) => l.lokacije.includes(lokacija.id))
  const tekst = lokacija[jezik]
  const [lat, lng] = lokacija.koordinate
  const mapeLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <article className="rb-detalji" key={lokacija.id}>
      <button className="rb-detalji-zatvori" onClick={zatvori} aria-label={t.zatvori}>
        ×
      </button>

      <div className="rb-detalji-zaglavlje">
        <span className="rb-detalji-broj">{lokacija.redosled}</span>
        <div>
          <span className="rb-detalji-kategorija">
            {t.kategorije[lokacija.kategorija]} · {lokacija.godina}
          </span>
          <h3 className="rb-detalji-naziv">{tekst.naziv}</h3>
          <p className="rb-detalji-autor">{tekst.autor}</p>
        </div>
      </div>

      <NekadISad key={lokacija.id} id={lokacija.id} t={t} />

      <button className="rb-dugme-objektiv" onClick={otvoriObjektiv}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
        <span>
          <b>{t.krozObjektiv}</b>
          <small>{t.krozObjektivOpis}</small>
        </span>
      </button>

      <p className="rb-detalji-opis">{tekst.opis}</p>

      <div className="rb-zanimljivost">
        <span className="rb-zanimljivost-naslov">{t.zanimljivost}</span>
        <p>{tekst.zanimljivost}</p>
      </div>

      <Glas key={`glas-${lokacija.id}`} t={t} jezik={jezik} id={lokacija.id} />

      <Zagonetka
        key={`z-${lokacija.id}`}
        t={t}
        jezik={jezik}
        zagonetka={zagonetke[lokacija.id]}
        redosled={lokacija.redosled}
        imaPecat={imaPecat}
        dobijPecat={dobijPecat}
      />

      {vezaneLicnosti.length > 0 && (
        <div className="rb-vezane-licnosti">
          <span className="rb-vezane-naslov">{t.licnosti}:</span>
          {vezaneLicnosti.map((l) => (
            <button key={l.id} className="rb-cip-licnost" onClick={otvoriLicnosti}>
              {imaPecat ? l[jezik].ime : `${t.zakljucano} ?`}
            </button>
          ))}
        </div>
      )}

      <p className="rb-detalji-adresa">📍 {lokacija.adresa}</p>

      <div className="rb-detalji-dugmad">
        <button className={`rb-dugme ${jePoseceno ? 'rb-dugme-zlatno' : 'rb-dugme-crveno'}`} onClick={promeniPoseceno}>
          {jePoseceno ? t.poseceno : t.oznaci}
        </button>
        <a className="rb-dugme rb-dugme-obrub" href={mapeLink} target="_blank" rel="noreferrer">
          {t.navigacija}
        </a>
      </div>
    </article>
  )
}
