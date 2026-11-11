import { useEffect, useMemo, useState } from 'react'
import { lokacije } from './data/lokacije'
import { tekstovi } from './tekstovi'
import Mapa from './Mapa'
import Lista from './Lista'
import Detalji from './Detalji'
import Licnosti from './Licnosti'
import KrozObjektiv from './KrozObjektiv'
import NekadKontrola from '../components/Nekad'
import { Nazad } from '../components/Ikone'
import { useJ } from '../i18n'
import './rb.css'

// Tura I „Руски Београд“ — nekadašnja posebna aplikacija, sada deo Puteva vere.
// Pečati se čuvaju u zajedničkom pasošu kao 'rb-<id lokacije>'.
export const RB_PREFIKS = 'rb-'

function ucitaj(k, d) {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : d
  } catch {
    return d
  }
}

export default function RuskiBeograd({ nazad, pecati: sviPecati, dodajPecat }) {
  const { jezik, t: tp, s } = useJ()
  const t = tekstovi[jezik]
  const tura = s.ture.find((x) => x.id === 'I')

  const [izabrana, setIzabrana] = useState(null)
  const [filter, setFilter] = useState('sve')
  const [prikaziRutu, setPrikaziRutu] = useState(true)
  const [poseceno, setPoseceno] = useState(() => ucitaj('rb-poseceno', []))
  const [pogled, setPogled] = useState('lokacije')
  const [objektiv, setObjektiv] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem('rb-poseceno', JSON.stringify(poseceno))
    } catch {
      /* ignoriši */
    }
  }, [poseceno])

  // Pečati iz zajedničkog pasoša (bez prefiksa)
  const pecati = useMemo(
    () => sviPecati.filter((p) => p.startsWith(RB_PREFIKS)).map((p) => p.slice(RB_PREFIKS.length)),
    [sviPecati]
  )

  const sortirane = useMemo(() => [...lokacije].sort((a, b) => a.redosled - b.redosled), [])
  const vidljive = useMemo(
    () => (filter === 'sve' ? sortirane : sortirane.filter((l) => l.kategorija === filter)),
    [filter, sortirane]
  )
  const izabranaLokacija = sortirane.find((l) => l.id === izabrana) || null
  const objektivLokacija = sortirane.find((l) => l.id === objektiv) || null

  const promeniPoseceno = (id) => setPoseceno((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const dobijPecat = (id) => {
    dodajPecat(RB_PREFIKS + id)
    setPoseceno((p) => (p.includes(id) ? p : [...p, id]))
  }

  return (
    <div className="rb-aplikacija">
      <header className="zaglavlje kompaktno" style={{ background: tura?.boja }}>
        <div className="zaglavlje-red">
          <button className="dugme-nazad" onClick={nazad} aria-label={tp.nazad}><Nazad /></button>
          <span className="oznaka-mala">{tp.tura} I</span>
        </div>
        <h1 className="naslov-ekrana">{tura?.naslov}</h1>
        <p className="podnaslov">{tp.rbPodnaslov}</p>
      </header>
      <div className="traka" />
      <div className="nekad-omotac"><NekadKontrola predlog={1925} /></div>

      <main className="rb-sadrzaj">
        <aside className="rb-bocna-traka">
          <div className="rb-pogledi" role="tablist">
            <button role="tab" aria-selected={pogled === 'lokacije'} className={pogled === 'lokacije' ? 'rb-aktivno' : ''} onClick={() => setPogled('lokacije')}>
              {t.lokacije}
            </button>
            <button role="tab" aria-selected={pogled === 'licnosti'} className={pogled === 'licnosti' ? 'rb-aktivno' : ''} onClick={() => setPogled('licnosti')}>
              {t.licnosti}
            </button>
          </div>

          {pogled === 'licnosti' ? (
            <Licnosti
              t={t}
              jezik={jezik}
              pecati={pecati}
              lokacije={sortirane}
              setIzabrana={(id) => {
                setPogled('lokacije')
                setIzabrana(id)
              }}
            />
          ) : (
            <Lista
              t={t}
              jezik={jezik}
              lokacije={vidljive}
              ukupno={sortirane.length}
              filter={filter}
              setFilter={setFilter}
              izabrana={izabrana}
              setIzabrana={setIzabrana}
              poseceno={poseceno}
              prikaziRutu={prikaziRutu}
              setPrikaziRutu={setPrikaziRutu}
              pecati={pecati}
            />
          )}
        </aside>

        <section className="rb-mapa-okvir">
          <Mapa
            lokacije={vidljive}
            jezik={jezik}
            izabrana={izabrana}
            setIzabrana={setIzabrana}
            poseceno={poseceno}
            prikaziRutu={prikaziRutu && filter === 'sve'}
          />
        </section>

        {izabranaLokacija && (
          <Detalji
            t={t}
            jezik={jezik}
            lokacija={izabranaLokacija}
            jePoseceno={poseceno.includes(izabranaLokacija.id)}
            promeniPoseceno={() => promeniPoseceno(izabranaLokacija.id)}
            zatvori={() => setIzabrana(null)}
            imaPecat={pecati.includes(izabranaLokacija.id)}
            dobijPecat={() => dobijPecat(izabranaLokacija.id)}
            otvoriObjektiv={() => setObjektiv(izabranaLokacija.id)}
            otvoriLicnosti={() => setPogled('licnosti')}
            pecati={pecati}
          />
        )}

        {objektivLokacija && (
          <KrozObjektiv t={t} id={objektivLokacija.id} naziv={objektivLokacija[jezik].naziv} zatvori={() => setObjektiv(null)} />
        )}
      </main>
    </div>
  )
}
