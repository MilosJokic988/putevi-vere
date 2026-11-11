import { Pecat } from './Ikone'
import { useJ } from '../i18n'
import { lokacije } from '../rb/data/lokacije'

// Tura I (Руски Београд) ima svoje lokacije; pečati su 'rb-<id>'
const RB = [...lokacije].sort((a, b) => a.redosled - b.redosled)
const RB_IDS = RB.map((l) => 'rb-' + l.id)

const BOJE = ['#A32A1E', '#1E3A6E', '#7A5A1E']

export default function Pasos({ pecati, idi }) {
  const { t, s, jezik } = useJ()
  const sveTure = s.ture.map((x) => (x.id === 'I' ? { ...x, mesta: RB_IDS } : x)).filter((x) => x.mesta)
  const ime = (id) => (id.startsWith('rb-') ? RB.find((l) => 'rb-' + l.id === id)?.[jezik].naziv : s.mesta[id].ime)
  const otvori = (id) => (id.startsWith('rb-') ? idi('beograd') : idi('mesto', id))
  const ukupno = sveTure.reduce((z, x) => z + x.mesta.length, 0)
  const broj = pecati.filter((id) => sveTure.some((x) => x.mesta.includes(id))).length
  const procenat = Math.round((broj / ukupno) * 100)
  const nekaGotova = sveTure.some((x) => x.mesta.every((id) => pecati.includes(id)))

  return (
    <>
      <header className="zaglavlje">
        <h1 className="naslov-ekrana">{t.pasosNaslov}</h1>
        <p className="podnaslov-sitno">{t.sakupljeno(broj, ukupno)}</p>
        <div className="napredak"><div style={{ width: `${procenat}%` }} /></div>
      </header>
      <div className="traka" />

      <div className="sadrzaj-ekrana">
        {sveTure.map((tu) => {
          const gotova = tu.mesta.every((id) => pecati.includes(id))
          return (
            <section key={tu.id} className="pasos-tura">
              <h2 className="naslov-odeljka">{t.tura.charAt(0) + t.tura.slice(1).toLowerCase()} {tu.broj} · {tu.naslov}</h2>
              <div className="pecati">
                {tu.mesta.map((id, i) => {
                  const ima = pecati.includes(id)
                  return (
                    <button key={id} className="pecat-polje" onClick={() => otvori(id)}>
                      {ima ? <Pecat tekst="2026" boja={BOJE[i % 3]} velicina={84} nagib={i % 2 ? 6 : -8} /> : <span className="prazan-pecat">?</span>}
                      <span>{ime(id)}</span>
                    </button>
                  )
                })}
              </div>
              {gotova && (
                <div className="sertifikat">
                  <b>{t.sertifikat}</b>
                  <span>{t.sertifikatGotov(tu.broj)}</span>
                </div>
              )}
            </section>
          )
        })}
        {!nekaGotova && (
          <div className="sertifikat">
            <b>{t.sertifikat}</b>
            <span>{t.sertifikatOpis}</span>
          </div>
        )}
      </div>
    </>
  )
}
