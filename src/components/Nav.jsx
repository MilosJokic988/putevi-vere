import { Kuca, Mapa, Reci, Pasos, Krst } from './Ikone'
import { useJ } from '../i18n'

export default function Nav({ aktivni, glavni }) {
  const { t, jezik, setJezik } = useJ()
  const STAVKE = [
    { id: 'pocetna', tekst: t.pocetna, Ikona: Kuca },
    { id: 'most', tekst: t.mapa, Ikona: Mapa },
    { id: 'reci', tekst: t.reci, Ikona: Reci },
    { id: 'pasos', tekst: t.pasos, Ikona: Pasos }
  ]
  return (
    <nav className="nav" aria-label={t.glavniMeni}>
      <button className="nav-brend" onClick={() => glavni('pocetna')}>
        <Krst velicina={24} />
        <span>{t.naslovApp}</span>
      </button>
      {STAVKE.map(({ id, tekst, Ikona }) => (
        <button key={id} className={aktivni === id ? 'aktivno' : ''} onClick={() => glavni(id)} aria-current={aktivni === id ? 'page' : undefined}>
          <Ikona />
          <span>{tekst}</span>
        </button>
      ))}
      <button className="nav-jezik" onClick={() => setJezik(jezik === 'sr' ? 'ru' : 'sr')} aria-label={t.jezik}>
        <span className="jezik-prekidac" aria-hidden="true">
          <span className={jezik === 'sr' ? 'akt' : ''}>СР</span>
          <span className={jezik === 'ru' ? 'akt' : ''}>РУ</span>
        </span>
        <span className="jezik-tekst">{jezik === 'sr' ? 'Русский' : 'Српски'}</span>
      </button>
    </nav>
  )
}
