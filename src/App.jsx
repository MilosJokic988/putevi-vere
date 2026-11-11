import { useEffect, useState } from 'react'
import Pocetna from './components/Pocetna'
import Koreni from './components/Koreni'
import MostVere from './components/MostVere'
import Tura from './components/Tura'
import Mesto from './components/Mesto'
import Pasos from './components/Pasos'
import Reci from './components/Reci'
import Zitije from './components/Zitije'
import Nav from './components/Nav'
import MapaPrice from './components/MapaPrice'
import SvaMesta from './components/SvaMesta'
import { JezikProvider } from './i18n'
import RuskiBeograd from './rb/RuskiBeograd'

// Bezbedno čitanje/pisanje u localStorage
function ucitaj(k, d) {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : d
  } catch {
    return d
  }
}
function sacuvaj(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* ignoriši */
  }
}

function Aplikacija() {
  // ekran: pocetna | koreni | most | tura | mesto | pasos | reci
  const [ekran, setEkran] = useState({ ime: 'pocetna' })
  const [istorija, setIstorija] = useState([])
  const [zitije, setZitije] = useState(null) // id otvorenog žitija (panel odozdo)
  const [pecati, setPecati] = useState(() => ucitaj('pv-pecati', []))

  useEffect(() => sacuvaj('pv-pecati', pecati), [pecati])

  const idi = (ime, param) => {
    setIstorija((h) => [...h, ekran])
    setEkran({ ime, param })
    setZitije(null)
    window.scrollTo(0, 0)
  }
  const nazad = () => {
    const prethodni = istorija[istorija.length - 1] || { ime: 'pocetna' }
    setEkran(prethodni)
    setIstorija(istorija.slice(0, -1))
    setZitije(null)
  }
  const glavni = (ime) => {
    setIstorija([])
    setEkran({ ime })
    setZitije(null)
  }
  const dodajPecat = (id) => setPecati((p) => (p.includes(id) ? p : [...p, id]))

  const zajednicko = { idi, nazad, otvoriZitije: setZitije, pecati, dodajPecat }

  let sadrzaj
  switch (ekran.ime) {
    case 'koreni':
      sadrzaj = <Koreni {...zajednicko} />
      break
    case 'most':
      sadrzaj = <MostVere {...zajednicko} />
      break
    case 'tura':
      sadrzaj = <Tura {...zajednicko} turaId={ekran.param} />
      break
    case 'mesto':
      sadrzaj = <Mesto {...zajednicko} mestoId={ekran.param} />
      break
    case 'mapaPrice':
      sadrzaj = <MapaPrice {...zajednicko} pricaId={ekran.param} />
      break
    case 'svaMesta':
      sadrzaj = <SvaMesta {...zajednicko} />
      break
    case 'beograd':
      sadrzaj = <RuskiBeograd {...zajednicko} />
      break
    case 'pasos':
      sadrzaj = <Pasos {...zajednicko} />
      break
    case 'reci':
      sadrzaj = <Reci {...zajednicko} />
      break
    default:
      sadrzaj = <Pocetna {...zajednicko} />
  }

  const aktivni = { pocetna: 'pocetna', koreni: 'pocetna', tura: 'pocetna', mesto: 'pocetna', mapaPrice: 'pocetna', beograd: 'pocetna', svaMesta: 'pocetna', most: 'most', reci: 'reci', pasos: 'pasos' }[ekran.ime]

  return (
    <div className="pozadina">
      <div className="telefon">
        <main className={`ekran ekran-${ekran.ime}`}>{sadrzaj}</main>
        <Nav aktivni={aktivni} glavni={glavni} />
        {zitije && <Zitije id={zitije} zatvori={() => setZitije(null)} otvoriZitije={setZitije} idi={idi} />}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <JezikProvider>
      <Aplikacija />
    </JezikProvider>
  )
}
