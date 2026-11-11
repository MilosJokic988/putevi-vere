import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useNekad } from '../components/Nekad'

// Mapa je napravljena direktno sa Leaflet-om (bez react-leaflet),
// tako da ima što manje zavisnosti koje mogu da pokvare prikaz.

const CENTAR_BEOGRADA = [44.8105, 20.468]

// OpenStreetMap podloga – besplatna, bez API ključa
const PODLOGA_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const PODLOGA_ATRIBUCIJA =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

// Numerisani marker u „ruskom“ stilu: crveni krug sa zlatnim obrubom
function napraviIkonu(broj, aktivna, posecena) {
  const klase = ['rb-marker', aktivna && 'rb-marker-aktivan', posecena && 'rb-marker-posecen']
    .filter(Boolean)
    .join(' ')
  const velicina = aktivna ? 46 : 36
  return L.divIcon({
    className: 'rb-marker-omotac',
    html: `<div class="${klase}"><span>${broj}</span></div>`,
    iconSize: [velicina, velicina],
    iconAnchor: [velicina / 2, velicina / 2]
  })
}

export default function Mapa({ lokacije, jezik, izabrana, setIzabrana, poseceno, prikaziRutu }) {
  const kontejnerRef = useRef(null)
  const mapaRef = useRef(null)
  const slojRef = useRef(null)
  const klikRef = useRef(setIzabrana)
  klikRef.current = setIzabrana

  // 1) Napravi mapu jednom
  useEffect(() => {
    const mapa = L.map(kontejnerRef.current, {
      center: CENTAR_BEOGRADA,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    })
    // Atribucija: OpenStreetMap mora da ostane (uslov licence), Leaflet bez ikonice zastave
    L.control
      .attribution({ prefix: '<a href="https://leafletjs.com">Leaflet</a>' })
      .addTo(mapa)
    L.tileLayer(PODLOGA_URL, {
      attribution: PODLOGA_ATRIBUCIJA,
      maxZoom: 19
    }).addTo(mapa)
    L.control.zoom({ position: 'bottomleft' }).addTo(mapa)

    slojRef.current = L.layerGroup().addTo(mapa)
    mapaRef.current = mapa

    // Kad se promeni veličina prozora/okvira, Leaflet mora ponovo da izmeri mapu
    const posmatrac = new ResizeObserver(() => mapa.invalidateSize())
    posmatrac.observe(kontejnerRef.current)
    const tajmer = setTimeout(() => mapa.invalidateSize(), 200)

    return () => {
      clearTimeout(tajmer)
      posmatrac.disconnect()
      mapa.remove()
      mapaRef.current = null
      slojRef.current = null
    }
  }, [])

  // Istorijski sloj „Некад ↔ Сад“
  useNekad(() => [mapaRef.current])

  // 2) Iscrtaj markere i rutu kad god se nešto promeni
  useEffect(() => {
    const sloj = slojRef.current
    if (!sloj) return
    sloj.clearLayers()

    if (prikaziRutu && lokacije.length > 1) {
      const tacke = lokacije.map((l) => l.koordinate)
      L.polyline(tacke, { color: '#f4ecd8', weight: 8, opacity: 0.9 }).addTo(sloj)
      L.polyline(tacke, { color: '#7a1a1a', weight: 3, dashArray: '2 10', lineCap: 'round' }).addTo(sloj)
    }

    lokacije.forEach((l) => {
      const aktivna = izabrana === l.id
      const marker = L.marker(l.koordinate, {
        icon: napraviIkonu(l.redosled, aktivna, poseceno.includes(l.id)),
        zIndexOffset: aktivna ? 1000 : 0,
        title: l[jezik].naziv
      })
      marker.bindTooltip(l[jezik].naziv, { direction: 'top', offset: [0, -18], className: 'rb-oblacic' })
      marker.on('click', () => klikRef.current(l.id))
      marker.addTo(sloj)
    })
  }, [lokacije, jezik, izabrana, poseceno, prikaziRutu])

  // 3) Kad se promeni filter, prikaži sve vidljive lokacije
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa || lokacije.length === 0) return
    const granice = L.latLngBounds(lokacije.map((l) => l.koordinate))
    mapa.fitBounds(granice, { padding: [50, 50], maxZoom: 16 })
  }, [lokacije])

  // 4) Kad se izabere lokacija, mapa „preleti“ do nje
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa || !izabrana) return
    const l = lokacije.find((x) => x.id === izabrana)
    if (!l) return
    let cilj = L.latLng(l.koordinate)
    if (window.innerWidth < 800) {
      // na telefonu pomeri tačku malo gore da je ne prekrije panel sa detaljima
      const tacka = mapa.project(cilj, 16)
      tacka.y += 120
      cilj = mapa.unproject(tacka, 16)
    }
    mapa.flyTo(cilj, 16, { duration: 0.8 })
  }, [izabrana, lokacije])

  return <div ref={kontejnerRef} className="rb-mapa" />
}
