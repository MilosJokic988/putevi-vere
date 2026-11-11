import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { postaviPodlogu } from '../podloga'
import StilPrekidac from './StilPrekidac'
import NekadKontrola, { useNekad } from './Nekad'
import { useJ } from '../i18n'

// Mapa Srbije na početnoj: tačke povezane sa Rusijom.
// Klik na tačku → kartica; „Пређи у Русију“ → mapa preleti do povezanog mesta u Rusiji.
const SRBIJA = [[42.3, 18.9], [46.1, 22.9]]

export default function MapaSrbije({ idi, otvoriZitije }) {
  const { t, s, stilMape } = useJ()
  const slojRef = useRef(null)
  const elRef = useRef(null)
  const mapaRef = useRef(null)
  const [izabrano, setIzabrano] = useState(null) // { id, vezaIndeks? } — vezaIndeks znači da smo „u Rusiji“

  // Srpska mesta (bez Svete Gore) i ruska mesta
  const srpska = Object.entries(s.mesta).filter(([, m]) => m.mapa === 'sr' && m.ll[0] > 42)
  const ruska = Object.entries(s.mesta).filter(([, m]) => m.mapa === 'ru')

  useEffect(() => {
    const m = L.map(elRef.current, { zoomControl: true, minZoom: 3, maxZoom: 12, scrollWheelZoom: false })
    m.fitBounds(SRBIJA, { padding: [10, 10] })
    mapaRef.current = m
    const tm = setTimeout(() => m.invalidateSize(), 100)
    return () => {
      clearTimeout(tm)
      m.remove()
      mapaRef.current = null
    }
  }, [])

  useNekad(() => [mapaRef.current])

  useEffect(() => {
    if (!mapaRef.current) return
    slojRef.current = postaviPodlogu(mapaRef.current, stilMape, slojRef.current)
    return () => {
      slojRef.current?.remove()
      slojRef.current = null
    }
  }, [stilMape])

  // Markeri (ponovo kad se promeni jezik)
  useEffect(() => {
    const m = mapaRef.current
    if (!m) return
    const markeri = []
    const dodaj = (id, mesto, ruski) => {
      const ikona = L.divIcon({
        className: 'marker-omotac',
        html: `<div class="marker ${ruski ? 'marker-ru' : 'vazno'}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      const mk = L.marker(mesto.ll, { icon: ikona, title: mesto.ime }).addTo(m)
      const strana = mesto.strana || 'right'
      const pomak = { right: [10, 0], left: [-10, 0], top: [0, -10], bottom: [0, 10] }[strana]
      mk.bindTooltip(mesto.ime, { permanent: true, direction: strana, offset: pomak, className: 'ime-mesta' })
      if (!ruski) mk.on('click', () => setIzabrano({ id }))
      markeri.push(mk)
    }
    srpska.forEach(([id, mesto]) => dodaj(id, mesto, false))
    ruska.forEach(([id, mesto]) => dodaj(id, mesto, true))
    return () => markeri.forEach((mk) => mk.remove())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s])

  const vezeZa = (id) =>
    s.veze
      .map((v, i) => ({ ...v, i }))
      .filter((v) => (v.od === id && s.mesta[v.do]?.mapa === 'ru') || (v.do === id && s.mesta[v.od]?.mapa === 'ru'))

  const uRusiju = (v) => {
    const ciljId = s.mesta[v.do].mapa === 'ru' ? v.do : v.od
    setIzabrano({ id: izabrano.id, vezaIndeks: v.i, ciljId })
    mapaRef.current?.flyTo(s.mesta[ciljId].ll, 6, { duration: 2.5 })
  }
  const uSrbiju = () => {
    setIzabrano({ id: izabrano.id })
    mapaRef.current?.flyToBounds(SRBIJA, { duration: 2, padding: [10, 10] })
  }

  const mesto = izabrano ? s.mesta[izabrano.id] : null
  const veze = izabrano ? vezeZa(izabrano.id) : []
  const uRusiji = izabrano && izabrano.vezaIndeks !== undefined
  const veza = uRusiji ? s.veze[izabrano.vezaIndeks] : null
  const cilj = uRusiji ? s.mesta[izabrano.ciljId] : null

  return (
    <section className="mapa-srbije">
      <div className="mapa-srbije-zaglavlje">
        <h2 className="naslov-odeljka">{t.mapaSrbijeNaslov}</h2>
        <StilPrekidac />
        <span className="legenda">
          <span className="tacka-leg crvena-leg" /> {t.legendaSrbija}
          <span className="tacka-leg plava-leg" /> {t.legendaRusija}
        </span>
      </div>
      <NekadKontrola predlog={1878} />
      <div className={`mapa-srbije-okvir stil-${stilMape}`}>
        <div className="mapa" ref={elRef} />
        {!izabrano && <div className="uputstvo">{t.uputstvoSrbija}</div>}

        {mesto && !uRusiji && (
          <div className="kartica-most">
            <button className="zatvori" onClick={() => setIzabrano(null)} aria-label={t.zatvori}>×</button>
            <span className="oznaka-mala crvena">{t.srbijaMalo}</span>
            <h2>{mesto.ime}</h2>
            <p>{mesto.kratko || t.uPripremi}</p>
            <div className="kartica-dno">
              <span className="dugmad">
                {veze.map((v) => (
                  <button key={v.i} className="dugme crveno" onClick={() => uRusiju(v)}>
                    {t.preciURusiju(s.mesta[s.mesta[v.do].mapa === 'ru' ? v.do : v.od].ime)}
                  </button>
                ))}
                {mesto.pogledi && <button className="dugme obrub" onClick={() => idi('mesto', izabrano.id)}>{t.otvoriMesto}</button>}
                {!mesto.pogledi && mesto.zitije && <button className="dugme obrub" onClick={() => otvoriZitije(mesto.zitije)}>{t.procitaj}</button>}
              </span>
            </div>
            {veze.length === 0 && <p className="napomena">{t.bezVeze}</p>}
          </div>
        )}

        {uRusiji && (
          <div className="kartica-most">
            <button className="zatvori" onClick={() => setIzabrano(null)} aria-label={t.zatvori}>×</button>
            <span className="oznaka-mala crvena">{t.rusijaMalo} · {veza.tema}</span>
            <h2>{cilj.ime}</h2>
            <p><b>{veza.naslov}.</b> {veza.tekst}</p>
            <div className="kartica-dno">
              <span className="dugmad">
                <button className="dugme obrub" onClick={uSrbiju}>{t.nazadUSrbiju}</button>
                {veza.zitije && <button className="dugme crveno" onClick={() => otvoriZitije(veza.zitije)}>{t.procitaj}</button>}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
