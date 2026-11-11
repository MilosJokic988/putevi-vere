const KATEGORIJE = ['sve', 'arhitektura', 'vera', 'kultura', 'memorijal']

export default function Lista({
  t,
  jezik,
  lokacije,
  ukupno,
  filter,
  setFilter,
  izabrana,
  setIzabrana,
  poseceno,
  prikaziRutu,
  setPrikaziRutu,
  pecati = []
}) {
  const procenat = Math.round((poseceno.length / ukupno) * 100)

  return (
    <div className="rb-lista">
      <div className="rb-napredak">
        <div className="rb-napredak-tekst">{t.posecenoOd(poseceno.length, ukupno)}</div>
        <div className="rb-napredak-traka">
          <div className="rb-napredak-popuna" style={{ width: `${procenat}%` }} />
        </div>
        <div className="rb-napredak-pecati">{t.pecatiOd(pecati.length, ukupno)}</div>
      </div>

      <div className="rb-filteri">
        {KATEGORIJE.map((k) => (
          <button
            key={k}
            className={`rb-cip ${filter === k ? 'rb-aktivno' : ''}`}
            onClick={() => setFilter(k)}
          >
            {k === 'sve' ? t.sve : t.kategorije[k]}
          </button>
        ))}
      </div>

      <label className="rb-prekidac">
        <input
          type="checkbox"
          checked={prikaziRutu}
          onChange={(e) => setPrikaziRutu(e.target.checked)}
        />
        <span>{t.ruta}</span>
      </label>

      <h2 className="rb-lista-naslov">{t.lokacije}</h2>

      <ol className="rb-kartice">
        {lokacije.map((l) => {
          const tekst = l[jezik]
          const aktivna = izabrana === l.id
          const posecena = poseceno.includes(l.id)
          return (
            <li key={l.id}>
              <button
                className={`rb-kartica ${aktivna ? 'rb-aktivna' : ''} ${posecena ? 'rb-posecena' : ''}`}
                onClick={() => setIzabrana(l.id)}
              >
                <span className="rb-kartica-broj">{l.redosled}</span>
                <span className="rb-kartica-telo">
                  <span className="rb-kartica-naziv">{tekst.naziv}</span>
                  <span className="rb-kartica-meta">
                    {t.kategorije[l.kategorija]} · {l.godina}
                  </span>
                </span>
                {posecena && <span className="rb-kartica-stiklirano" aria-label="✓">✓</span>}
              </button>
            </li>
          )
        })}
      </ol>

      <p className="rb-podnozje">{t.podnozje}</p>
    </div>
  )
}
