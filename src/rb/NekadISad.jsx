import { useState } from 'react'

// Poređenje fotografija „nekad i sad“ sa klizačem.
// Fotografije stavi u public/slike/ sa imenima:
//   <id-lokacije>-nekad.jpg   i   <id-lokacije>-sad.jpg
// npr. public/slike/ruski-dom-nekad.jpg i public/slike/ruski-dom-sad.jpg
export default function NekadISad({ id, t }) {
  const [pozicija, setPozicija] = useState(50)
  const [greske, setGreske] = useState({ nekad: false, sad: false })

  const nekad = `/slike/${id}-nekad.jpg`
  const sad = `/slike/${id}-sad.jpg`
  const oznaciGresku = (k) => () => setGreske((g) => ({ ...g, [k]: true }))

  // Nema nijedne fotografije – prikaži mesto za njih
  if (greske.nekad && greske.sad) {
    return (
      <div className="rb-foto-prazno">
        <span className="rb-foto-prazno-ikona" aria-hidden="true">◈</span>
        <span>{t.dodajFoto}</span>
        <code>public/slike/{id}-nekad.jpg</code>
        <code>public/slike/{id}-sad.jpg</code>
      </div>
    )
  }

  // Samo jedna fotografija – prikaži nju bez klizača
  if (greske.nekad || greske.sad) {
    const jedina = greske.nekad ? sad : nekad
    return (
      <div className="rb-foto-okvir">
        <img
          src={jedina}
          alt=""
          className="rb-foto"
          onError={() => setGreske({ nekad: true, sad: true })}
        />
        <span className="rb-foto-oznaka rb-foto-oznaka-levo">{greske.nekad ? t.sad : t.nekad}</span>
      </div>
    )
  }

  return (
    <div className="rb-foto-okvir" style={{ '--poz': `${pozicija}%` }}>
      <img src={sad} alt={t.sad} className="rb-foto" onError={oznaciGresku('sad')} />
      <img
        src={nekad}
        alt={t.nekad}
        className="rb-foto rb-foto-nekad"
        onError={oznaciGresku('nekad')}
      />
      <div className="rb-foto-linija" aria-hidden="true">
        <span className="rb-foto-rucica">⟷</span>
      </div>
      <span className="rb-foto-oznaka rb-foto-oznaka-levo">{t.nekad}</span>
      <span className="rb-foto-oznaka rb-foto-oznaka-desno">{t.sad}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={pozicija}
        onChange={(e) => setPozicija(Number(e.target.value))}
        className="rb-foto-klizac"
        aria-label={`${t.nekad} / ${t.sad}`}
      />
    </div>
  )
}
