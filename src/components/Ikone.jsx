// Jednostavne ikonice (inline SVG)
const osnova = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const Kuca = () => (<svg {...osnova}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>)
export const Mapa = () => (<svg {...osnova}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>)
export const Reci = () => (<svg {...osnova}><path d="M4 6h16M4 12h10M4 18h13" /></svg>)
export const Pasos = () => (<svg {...osnova}><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="11" r="3" /><path d="M9 17h6" /></svg>)
export const Nazad = () => (<svg {...osnova}><path d="M15 18l-6-6 6-6" /></svg>)

export const Krst = ({ boja = '#D4B04A', velicina = 26 }) => (
  <svg width={velicina * 0.82} height={velicina} viewBox="0 0 28 34" aria-hidden="true">
    <path d="M14 1v32M8 7h12M4 14h20M9 25l10-4" stroke={boja} strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </svg>
)

export function Pecat({ tekst, boja = '#A32A1E', velicina = 92, nagib = -8 }) {
  return (
    <svg width={velicina} height={velicina} viewBox="0 0 92 92" style={{ transform: `rotate(${nagib}deg)` }} aria-hidden="true">
      <circle cx="46" cy="46" r="43" fill="none" stroke={boja} strokeWidth="3" />
      <circle cx="46" cy="46" r="35" fill={boja} fillOpacity="0.07" stroke={boja} strokeWidth="1.3" strokeDasharray="2 3" />
      <path d="M46 20v44M38 28h16M33 37h26M39 54l14-6" stroke={boja} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <text x="46" y="76" textAnchor="middle" fontSize="9" fontWeight="700" fill={boja} fontFamily="PT Sans, Arial">{tekst}</text>
    </svg>
  )
}
