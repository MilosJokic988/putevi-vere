import L from 'leaflet'

// Dva stila podloge mape:
//  'stara'    – reljef bez granica i natpisa (Esri), zatamnjen kao stara karta
//  'detaljna' – OpenStreetMap kao u „Ruskom Beogradu“ (gradovi, putevi; prikazuje i granice)
export const PODLOGE = {
  stara: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
    opcije: { attribution: 'Podloga &copy; Esri, USGS, NOAA', maxNativeZoom: 9, maxZoom: 12 }
  },
  detaljna: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    opcije: { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 18 }
  }
}

// Postavi (ili zameni) podlogu na mapi; vraća novi sloj
export function postaviPodlogu(mapa, stil, stariSloj) {
  if (stariSloj) stariSloj.remove()
  const p = PODLOGE[stil] || PODLOGE.stara
  const sloj = L.tileLayer(p.url, p.opcije)
  sloj.addTo(mapa)
  return sloj
}
