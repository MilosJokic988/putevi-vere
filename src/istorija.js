import L from 'leaflet'

// Istorijske granice: OpenHistoricalMap (javni domen).
// OHM ne objavljuje rasterske pločice, pa se koristi MapLibre GL + most za Leaflet
// i dodatak koji filtrira kartu po godini. Sve se učitava tek kad korisnik uključi „Некад“.
const CSS = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css'
const SKRIPTE = [
  'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js',
  'https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.0.22/leaflet-maplibre-gl.js',
  'https://unpkg.com/@openhistoricalmap/maplibre-gl-dates@1.3.0/index.js'
]
export const STIL_OHM = 'https://www.openhistoricalmap.org/map-styles/main/main.json'

let obecanje = null

function skripta(src) {
  return new Promise((ok, ne) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = ok
    s.onerror = () => ne(new Error('Nije učitano: ' + src))
    document.head.appendChild(s)
  })
}

export function ucitajBiblioteke() {
  if (!obecanje) {
    obecanje = (async () => {
      if (!document.querySelector(`link[href="${CSS}"]`)) {
        const l = document.createElement('link')
        l.rel = 'stylesheet'
        l.href = CSS
        document.head.appendChild(l)
      }
      for (const s of SKRIPTE) await skripta(s)
      if (typeof L.maplibreGL !== 'function') throw new Error('MapLibre most nije dostupan')
    })()
    obecanje.catch(() => {
      obecanje = null // dozvoli novi pokušaj
    })
  }
  return obecanje
}

function filtriraj(gm, godina) {
  const d = String(godina)
  try {
    if (typeof gm.filterByDate === 'function') gm.filterByDate(d)
    else if (typeof window.filterByDate === 'function') window.filterByDate(gm, d)
  } catch {
    /* stil još nije spreman */
  }
}

function kontejner(sloj) {
  return (sloj.getContainer && sloj.getContainer()) || sloj._container || null
}

export function postaviProvidnost(sloj, p) {
  const el = kontejner(sloj)
  if (el) {
    el.style.opacity = String(p)
    el.style.zIndex = '10' // uvek iznad obične podloge, i kad se promeni stil mape
  }
}

export function postaviGodinu(sloj, godina) {
  const gm = sloj.getMaplibreMap && sloj.getMaplibreMap()
  if (!gm) return
  if (gm.isStyleLoaded && gm.isStyleLoaded()) filtriraj(gm, godina)
  else gm.once('styledata', () => filtriraj(gm, godina))
}

export async function napraviSloj(mapa, godina, providnost) {
  await ucitajBiblioteke()
  const sloj = L.maplibreGL({
    style: STIL_OHM,
    interactive: false,
    attribution: '<a href="https://www.openhistoricalmap.org/">OpenHistoricalMap</a>'
  })
  sloj.addTo(mapa)
  postaviGodinu(sloj, godina)
  postaviProvidnost(sloj, providnost)
  return sloj
}

export function ukloniSloj(sloj) {
  try {
    sloj.remove()
  } catch {
    /* mapa je već uklonjena */
  }
}
