import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { postaviPodlogu } from '../podloga'
import { useJ } from '../i18n'
import { Nazad } from './Ikone'
import NekadKontrola, { useNekad } from './Nekad'


export default function MapaPrice({ pricaId, nazad }) {
  const elRef = useRef(null)
  const mapaRef = useRef(null)
  const [aktivno, setAktivno] = useState(null)
  const { t, s, stilMape } = useJ()
  const z = s.zitija[pricaId]
  const lista = s.mestaPrica[pricaId] || []

  useEffect(() => {
    if (!lista.length) return
    const m = L.map(elRef.current, { zoomControl: true, minZoom: 3, maxZoom: 12 })
    postaviPodlogu(m, stilMape)
    if (lista.length > 1) {
      L.polyline(lista.map((x) => x.ll), { color: '#9B2D20', weight: 3, dashArray: '2 9', lineCap: 'round' }).addTo(m)
    }
    lista.forEach((x, i) => {
      const ikona = L.divIcon({ className: 'marker-omotac', html: `<div class="marker-broj">${i + 1}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] })
      const mk = L.marker(x.ll, { icon: ikona, title: x.ime }).addTo(m)
      mk.bindTooltip(x.ime, { permanent: true, direction: 'right', offset: [14, 0], className: 'ime-mesta' })
      mk.on('click', () => setAktivno(i))
    })
    if (lista.length === 1) m.setView(lista[0].ll, 7)
    else m.fitBounds(lista.map((x) => x.ll), { padding: [50, 50], maxZoom: 7 })
    mapaRef.current = m
    const t = setTimeout(() => m.invalidateSize(), 100)
    return () => {
      clearTimeout(t)
      m.remove()
      mapaRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricaId, lista, stilMape])

  useNekad(() => [mapaRef.current], `${pricaId}-${stilMape}`)

  const idiNa = (i) => {
    setAktivno(i)
    mapaRef.current?.flyTo(lista[i].ll, 8, { duration: 0.8 })
  }

  if (!z) return null

  return (
    <div className="mapa-price">
      <header className="zaglavlje kompaktno">
        <div className="zaglavlje-red">
          <button className="dugme-nazad" onClick={nazad} aria-label={t.nazad}><Nazad /></button>
          <span className="oznaka-mala">{t.gdeNaslov}</span>
        </div>
        <h1 className="naslov-ekrana">{z.naslov}</h1>
      </header>
      <div className="traka" />
      <div className="nekad-omotac"><NekadKontrola predlog={1350} /></div>
      <div className={`mapa-price-mapa stil-${stilMape}`}>
        <div className="mapa" ref={elRef} />
      </div>
      <ol className="mapa-price-lista">
        {lista.map((x, i) => (
          <li key={x.ime}>
            <button className={`mesto-red ${aktivno === i ? 'aktivno' : ''}`} onClick={() => idiNa(i)}>
              <span className="broj">{i + 1}</span>
              <span className="kartica-tekst">
                <b>{x.ime}</b>
                <small>{x.opis}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
