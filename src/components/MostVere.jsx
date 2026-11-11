import { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { postaviPodlogu } from '../podloga'
import StilPrekidac from './StilPrekidac'
import NekadKontrola, { useNekad } from './Nekad'
import { useJ } from '../i18n'
import { veze as VEZE_RED } from '../data/mesta'

const GRANICE = {
  ru: [[43.8, 29.0], [60.5, 40.0]], // uključuje Krim
  sr: [[40.0, 19.2], [46.2, 24.6]] // Srbija i Sveta Gora
}

export default function MostVere({ idi, otvoriZitije }) {
  const { t, s: S, stilMape } = useJ()
  const slojeviRef = useRef({})
  const { mesta, veze, teme } = S
  const mestaRef = useRef(mesta)
  mestaRef.current = mesta
  const omotacRef = useRef(null)
  const elRef = { ru: useRef(null), sr: useRef(null) }
  const mapeRef = useRef({})
  const [filter, setFilter] = useState(0) // indeks teme; 0 = sve
  const [izabrana, setIzabrana] = useState(null) // { vrsta:'veza'|'mesto', id }
  const [linije, setLinije] = useState([])

  // Izračunaj položaj linija preko obe mape
  const preracunaj = useCallback(() => {
    const mape = mapeRef.current
    const omotac = omotacRef.current
    if (!mape.ru || !mape.sr || !omotac) return
    const o = omotac.getBoundingClientRect()
    const tacka = (id) => {
      const m = mestaRef.current[id]
      const mapa = mape[m.mapa]
      const p = mapa.latLngToContainerPoint(m.ll)
      const r = mapa.getContainer().getBoundingClientRect()
      return { x: p.x + r.left - o.left, y: p.y + r.top - o.top }
    }
    setLinije(
      VEZE_RED.map((v, i) => {
        const a = tacka(v.od)
        const b = tacka(v.do)
        const dx = b.x - a.x
        const dy = b.y - a.y
        const c1 = { x: a.x + dx * 0.25 - dy * 0.25, y: a.y + dy * 0.25 + dx * 0.12 }
        const c2 = { x: a.x + dx * 0.75 - dy * 0.25, y: a.y + dy * 0.75 + dx * 0.12 }
        return { i, d: `M${a.x},${a.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}` }
      })
    )
  }, [])

  // Napravi obe mape jednom
  useEffect(() => {
    const mape = {}
    for (const k of ['ru', 'sr']) {
      const m = L.map(elRef[k].current, { zoomControl: true, minZoom: 3, maxZoom: 12 })
      m.fitBounds(GRANICE[k], { padding: [24, 24] })
      m.on('move zoom resize', preracunaj)
      mape[k] = m
    }
    mapeRef.current = mape
    const posmatrac = new ResizeObserver(() => {
      Object.values(mape).forEach((m) => m.invalidateSize())
      preracunaj()
    })
    posmatrac.observe(omotacRef.current)
    const t0 = setTimeout(preracunaj, 100)
    return () => {
      clearTimeout(t0)
      posmatrac.disconnect()
      Object.values(mape).forEach((m) => m.remove())
      mapeRef.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preracunaj])

  useNekad(() => Object.values(mapeRef.current))

  // Podloga (menja se kad se promeni stil mape)
  useEffect(() => {
    const mape = mapeRef.current
    if (!mape.ru) return
    for (const k of ['ru', 'sr']) slojeviRef.current[k] = postaviPodlogu(mape[k], stilMape, slojeviRef.current[k])
    return () => {
      for (const k of ['ru', 'sr']) slojeviRef.current[k]?.remove()
      slojeviRef.current = {}
    }
  }, [stilMape])

  // Markeri (ponovo se crtaju kad se promeni jezik)
  useEffect(() => {
    const mape = mapeRef.current
    if (!mape.ru) return
    const markeri = []
    Object.entries(mesta).forEach(([id, m]) => {
      const ikona = L.divIcon({
        className: 'marker-omotac',
        html: `<div class="marker ${m.vazno ? 'vazno' : ''}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      const strana = m.strana || 'right'
      const pomak = { right: [10, 0], left: [-10, 0], top: [0, -10], bottom: [0, 10] }[strana]
      const mk = L.marker(m.ll, { icon: ikona, title: m.ime }).addTo(mape[m.mapa])
      mk.bindTooltip(m.ime, { permanent: true, direction: strana, offset: pomak, className: 'ime-mesta' })
      mk.on('click', () => setIzabrana({ vrsta: 'mesto', id }))
      markeri.push(mk)
    })
    return () => markeri.forEach((mk) => mk.remove())
  }, [mesta])

  const pokaziObaMesta = (v) => {
    ;[v.od, v.do].forEach((id) => {
      const m = mesta[id]
      mapeRef.current[m.mapa]?.flyTo(m.ll, 7, { duration: 0.8 })
    })
  }

  const vidljive = linije.filter(({ i }) => filter === 0 || veze[i].tema === teme[filter])
  const veza = izabrana?.vrsta === 'veza' ? veze[izabrana.id] : null
  const mesto = izabrana?.vrsta === 'mesto' ? mesta[izabrana.id] : null

  return (
    <div className="most">
      <header className="zaglavlje kompaktno">
        <h1 className="naslov-ekrana">{t.mostVere}</h1>
        <p className="podnaslov">{t.mostPodnaslov}</p>
      </header>
      <div className="traka" />
      <div className="filteri">
        <StilPrekidac />
        {teme.map((tema, i) => (
          <button key={tema} className={`cip ${i === filter ? 'aktivno' : ''}`} onClick={() => { setFilter(i); setIzabrana(null) }}>
            {tema}
          </button>
        ))}
      </div>

      <div className="nekad-omotac"><NekadKontrola predlog={1913} /></div>

      <div className={`mape stil-${stilMape}`} ref={omotacRef}>
        <div className="panel">
          <div className="mapa" ref={elRef.ru} />
          <span className="oznaka-mape">{t.rusija}</span>
        </div>
        <div className="razdelnik"><span>{t.razdaljina}</span></div>
        <div className="panel">
          <div className="mapa" ref={elRef.sr} />
          <span className="oznaka-mape">{t.srbija}</span>
        </div>

        <svg className="linije" aria-hidden="true">
          {vidljive.map(({ i, d }) => {
            const v = veze[i]
            const akt = veza === v
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="rgba(243,235,221,.9)" strokeWidth={akt ? 9 : 6} strokeLinecap="round" />
                <path d={d} fill="none" stroke={akt ? '#A32A1E' : '#C9A227'} strokeWidth={akt ? 5 : 3} strokeLinecap="round" strokeDasharray={v.provereno ? undefined : '8 6'} />
                <path className="veza-klik" d={d} fill="none" stroke="transparent" strokeWidth="22" onClick={() => setIzabrana({ vrsta: 'veza', id: i })} />
              </g>
            )
          })}
        </svg>

        {!izabrana && <div className="uputstvo">{t.uputstvo}</div>}

        {veza && (
          <div className="kartica-most">
            <button className="zatvori" onClick={() => setIzabrana(null)} aria-label={t.zatvori}>×</button>
            <span className="oznaka-mala crvena">{veza.tema}</span>
            <h2>{veza.naslov}</h2>
            <p>{veza.tekst}</p>
            <div className="kartica-dno">
              <span className={`status ${veza.provereno ? '' : 'proveri'}`}>{veza.provereno ? t.provereno : t.proveriti}</span>
              <span className="dugmad">
                <button className="dugme obrub" onClick={() => pokaziObaMesta(veza)}>{t.pokaziOba}</button>
                {veza.zitije && <button className="dugme crveno" onClick={() => otvoriZitije(veza.zitije)}>{t.procitaj}</button>}
              </span>
            </div>
          </div>
        )}

        {mesto && (
          <div className="kartica-most">
            <button className="zatvori" onClick={() => setIzabrana(null)} aria-label={t.zatvori}>×</button>
            <span className="oznaka-mala crvena">{mesto.mapa === 'ru' ? t.rusijaMalo : t.srbijaMalo}</span>
            <h2>{mesto.ime}</h2>
            <p>{mesto.kratko || t.uPripremi}</p>
            <div className="kartica-dno">
              <span className="status">{t.cetiriPogleda}</span>
              <span className="dugmad">
                {mesto.pogledi && <button className="dugme crveno" onClick={() => idi('mesto', izabrana.id)}>{t.otvoriMesto}</button>}
                {!mesto.pogledi && mesto.zitije && <button className="dugme crveno" onClick={() => otvoriZitije(mesto.zitije)}>{t.procitaj}</button>}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
