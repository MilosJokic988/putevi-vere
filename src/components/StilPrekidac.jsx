import { useJ } from '../i18n'

// Prekidač stila mape: „Стара карта“ / „Детаљна“
export default function StilPrekidac() {
  const { t, stilMape, setStilMape } = useJ()
  return (
    <div className="stil-prekidac" role="group" aria-label={t.stilMape}>
      <button className={stilMape === 'stara' ? 'akt' : ''} onClick={() => setStilMape('stara')} aria-pressed={stilMape === 'stara'}>{t.stilStara}</button>
      <button className={stilMape === 'detaljna' ? 'akt' : ''} onClick={() => setStilMape('detaljna')} aria-pressed={stilMape === 'detaljna'}>{t.stilDetaljna}</button>
    </div>
  )
}
