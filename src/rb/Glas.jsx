import { useState } from 'react'
import { glasovi } from './data/glasovi'

// Plejer za „Glasove potomaka“ uz transkript.
export default function Glas({ t, jezik, id }) {
  const [greska, setGreska] = useState(false)
  const [prikaziTekst, setPrikaziTekst] = useState(false)
  const podaci = glasovi[id]?.[jezik]

  if (!podaci || greska) {
    return (
      <div className="rb-glas rb-glas-prazno">
        <MikrofonIkona />
        <div>
          <span className="rb-glas-naslov">{t.glasovi}</span>
          <p>{t.glasUskoro}</p>
          <code>public/glasovi/{id}.mp3</code>
        </div>
      </div>
    )
  }

  return (
    <div className="rb-glas">
      <div className="rb-glas-red">
        <MikrofonIkona />
        <div>
          <span className="rb-glas-naslov">{t.glasovi}</span>
          <p className="rb-glas-ko">{podaci.ko}</p>
        </div>
      </div>
      <audio controls preload="none" src={`/glasovi/${id}.mp3`} onError={() => setGreska(true)} />
      {podaci.transkript && (
        <>
          <button className="rb-glas-tekst-dugme" onClick={() => setPrikaziTekst((v) => !v)}>
            {prikaziTekst ? t.sakrijTekst : t.prikaziTekst}
          </button>
          {prikaziTekst && <p className="rb-glas-transkript">{podaci.transkript}</p>}
        </>
      )}
    </div>
  )
}

function MikrofonIkona() {
  return (
    <svg className="rb-glas-ikona" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
    </svg>
  )
}
