import { useState } from 'react'

// Pitanje sa tri odgovora. Tačan odgovor otključava pečat lokacije.
export default function Zagonetka({ t, jezik, zagonetka, redosled, imaPecat, dobijPecat }) {
  const [pogresno, setPogresno] = useState(null)

  if (!zagonetka) return null

  if (imaPecat) {
    return (
      <div className="rb-zagonetka rb-zagonetka-resena">
        <Pecat broj={redosled} />
        <div>
          <span className="rb-zagonetka-naslov">{t.pecatDobijen}</span>
          <p>{t.pecatOpis}</p>
        </div>
      </div>
    )
  }

  const z = zagonetka[jezik]
  const odgovori = (i) => {
    if (i === zagonetka.tacan) {
      setPogresno(null)
      dobijPecat()
    } else {
      setPogresno(i)
    }
  }

  return (
    <div className="rb-zagonetka">
      <span className="rb-zagonetka-naslov">{t.zagonetka}</span>
      <p className="rb-zagonetka-pitanje">{z.pitanje}</p>
      <div className="rb-zagonetka-odgovori">
        {z.odgovori.map((o, i) => (
          <button
            key={i}
            className={`rb-zagonetka-odgovor ${pogresno === i ? 'rb-pogresno' : ''}`}
            onClick={() => odgovori(i)}
          >
            {o}
          </button>
        ))}
      </div>
      {pogresno !== null && <p className="rb-zagonetka-poruka">{t.pokusajOpet}</p>}
    </div>
  )
}

// Okrugli pečat u „ruskom“ stilu
export function Pecat({ broj, mali = false }) {
  const v = mali ? 44 : 64
  return (
    <svg className="rb-pecat" width={v} height={v} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="none" stroke="#7a1a1a" strokeWidth="3" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="#7a1a1a" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M32 12 L44 32 L32 52 L20 32 Z" fill="none" stroke="#c9a227" strokeWidth="2" />
      <text x="32" y="38" textAnchor="middle" fontSize="16" fontFamily="Yeseva One, Georgia, serif" fill="#7a1a1a">
        {broj}
      </text>
    </svg>
  )
}
