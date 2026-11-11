import { useEffect, useRef } from 'react'
import { useJ } from '../i18n'
import { napraviSloj, postaviGodinu, postaviProvidnost, ukloniSloj } from '../istorija'

// Godine koje nudimo (granice iz OpenHistoricalMap)
export const GODINE = [1350, 1878, 1913, 1925]

// Kuka: dodaje istorijski sloj na mape koje vrati getMape().
// Pozvati POSLE efekta koji pravi mapu.
export function useNekad(getMape, kljuc = '') {
  const { istorija, setIstorija } = useJ()
  const slojeviRef = useRef([])
  const stanjeRef = useRef(istorija)
  stanjeRef.current = istorija
  const ukljuceno = istorija.godina != null

  useEffect(() => {
    if (!ukljuceno) return
    let otkazano = false
    const mape = getMape().filter(Boolean)
    if (mape.length === 0) return
    setIstorija((s) => ({ ...s, status: 'ucitava' }))
    const { godina, providnost } = stanjeRef.current
    Promise.all(mape.map((m) => napraviSloj(m, godina, providnost)))
      .then((sl) => {
        if (otkazano) return sl.forEach(ukloniSloj)
        slojeviRef.current = sl
        // ako se godina/providnost promenila dok se učitavalo
        const sad = stanjeRef.current
        sl.forEach((x) => {
          postaviGodinu(x, sad.godina)
          postaviProvidnost(x, sad.providnost)
        })
        setIstorija((s) => ({ ...s, status: 'ok' }))
      })
      .catch(() => {
        if (!otkazano) setIstorija((s) => ({ ...s, status: 'greska' }))
      })
    return () => {
      otkazano = true
      slojeviRef.current.forEach(ukloniSloj)
      slojeviRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ukljuceno, kljuc])

  useEffect(() => {
    if (istorija.godina != null) slojeviRef.current.forEach((x) => postaviGodinu(x, istorija.godina))
  }, [istorija.godina])

  useEffect(() => {
    slojeviRef.current.forEach((x) => postaviProvidnost(x, istorija.providnost))
  }, [istorija.providnost])
}

// Kontrola „Некад ↔ Сад“: dugme, izbor godine i klizač providnosti
export default function NekadKontrola({ predlog = 1878 }) {
  const { t, istorija, setIstorija } = useJ()
  const ukljuceno = istorija.godina != null

  if (!ukljuceno) {
    return (
      <button className="nekad-dugme" onClick={() => setIstorija((s) => ({ ...s, godina: predlog, status: 'ucitava' }))}>
        <span aria-hidden="true">⌛</span> {t.nekadSad}
      </button>
    )
  }

  return (
    <div className="nekad-panel">
      <div className="nekad-red">
        <div className="nekad-godine" role="group" aria-label={t.izaberiGodinu}>
          {GODINE.map((g) => (
            <button
              key={g}
              className={istorija.godina === g ? 'akt' : ''}
              aria-pressed={istorija.godina === g}
              title={t.godineOpis[g]}
              onClick={() => setIstorija((s) => ({ ...s, godina: g }))}
            >
              {g}
            </button>
          ))}
        </div>
        <button className="nekad-zatvori" onClick={() => setIstorija((s) => ({ ...s, godina: null, status: null }))} aria-label={t.zatvori}>×</button>
      </div>
      <div className="nekad-klizac">
        <span>{t.sad}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(istorija.providnost * 100)}
          aria-label={t.nekadSad}
          onChange={(e) => {
            const p = Number(e.target.value) / 100
            setIstorija((s) => ({ ...s, providnost: p }))
          }}
        />
        <span>{t.nekad}</span>
      </div>
      <p className="nekad-opis">
        <b>{istorija.godina}.</b> {t.godineOpis[istorija.godina]}
        {istorija.status === 'ucitava' && <> · <i>{t.ucitavaKartu}</i></>}
        {istorija.status === 'greska' && <> · <span className="nekad-greska">{t.greskaKarte}</span></>}
      </p>
    </div>
  )
}
