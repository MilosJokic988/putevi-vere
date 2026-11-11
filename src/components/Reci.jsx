import { useJ } from '../i18n'

// Reči koje su iste (ili skoro iste) na srpskom i ruskom
export default function Reci() {
  const { t, s } = useJ()
  return (
    <>
      <header className="zaglavlje">
        <div className="zaglavlje-red">
          <span className="oznaka-mala">{t.iste}</span>
          <span className="poeni">{s.isteReci.length}</span>
        </div>
        <h1 className="naslov-ekrana">{t.reciNaslov}</h1>
      </header>
      <div className="traka" />

      <div className="sadrzaj-ekrana">
        <p className="tekst-pogleda">{t.isteOpis}</p>
        <div className="mreza-reci">
          {s.isteReci.map(([a, b]) => (
            <div key={a} className="rec-kartica"><b>{a}</b><small>{t.drugiJezik} · {b}</small></div>
          ))}
        </div>
      </div>
    </>
  )
}
