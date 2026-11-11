import { useEffect, useRef, useState } from 'react'

// „Kroz objektiv“: kamera telefona + providna stara fotografija preko nje.
// Kamera radi samo na https adresi ili na localhost-u (npm run dev).
export default function KrozObjektiv({ t, id, naziv, zatvori }) {
  const videoRef = useRef(null)
  const [stanje, setStanje] = useState('pokrecem') // pokrecem | radi | bez-kamere
  const [providnost, setProvidnost] = useState(55)
  const [imaSliku, setImaSliku] = useState(true)

  useEffect(() => {
    let tok = null
    let otkazano = false
    async function pokreni() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('nema kamere')
        tok = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        })
        if (otkazano) {
          tok.getTracks().forEach((tr) => tr.stop())
          return
        }
        if (videoRef.current) {
          videoRef.current.srcObject = tok
          await videoRef.current.play().catch(() => {})
        }
        setStanje('radi')
      } catch {
        if (!otkazano) setStanje('bez-kamere')
      }
    }
    pokreni()
    return () => {
      otkazano = true
      if (tok) tok.getTracks().forEach((tr) => tr.stop())
    }
  }, [])

  // Zatvaranje na Escape
  useEffect(() => {
    const naTaster = (e) => e.key === 'Escape' && zatvori()
    window.addEventListener('keydown', naTaster)
    return () => window.removeEventListener('keydown', naTaster)
  }, [zatvori])

  return (
    <div className="rb-objektiv" role="dialog" aria-modal="true" aria-label={t.krozObjektiv}>
      <div className="rb-objektiv-scena">
        <video ref={videoRef} className="rb-objektiv-video" playsInline muted />
        {stanje === 'bez-kamere' && (
          <div className="rb-objektiv-poruka">
            <p>{t.bezKamere}</p>
          </div>
        )}
        {imaSliku ? (
          <img
            src={`/slike/${id}-nekad.jpg`}
            alt=""
            className="rb-objektiv-slika"
            style={{ opacity: providnost / 100 }}
            onError={() => setImaSliku(false)}
          />
        ) : (
          <div className="rb-objektiv-poruka rb-objektiv-poruka-dole">
            <p>{t.nemaStareSlike}</p>
            <code>public/slike/{id}-nekad.jpg</code>
          </div>
        )}
        <div className="rb-objektiv-okvir" aria-hidden="true" />
      </div>

      <div className="rb-objektiv-kontrole">
        <div className="rb-objektiv-zaglavlje">
          <div>
            <span className="rb-objektiv-oznaka">{t.krozObjektiv}</span>
            <p className="rb-objektiv-naziv">{naziv}</p>
          </div>
          <button className="rb-objektiv-zatvori" onClick={zatvori} aria-label={t.zatvori}>
            ×
          </button>
        </div>
        <label className="rb-objektiv-klizac">
          <span>{t.danas}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={providnost}
            onChange={(e) => setProvidnost(Number(e.target.value))}
            aria-label={`${t.danas} / ${t.nekad}`}
          />
          <span>{t.nekad}</span>
        </label>
        <p className="rb-objektiv-savet">{t.objektivSavet}</p>
      </div>
    </div>
  )
}
