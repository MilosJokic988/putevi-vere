# Путеви вере

Апликација о православним везама Србије и Русије: туре, житија, мапа „Мост вере“, ходочаснички пасош и игра са речима.
React (Vite) + Leaflet. Текстови су на српској ћирилици.

## Brzo isprobavanje (bez instalacije)

Otvori `putevi-vere-jedan-fajl.html` duplim klikom u Chrome-u (potreban internet za mapu i fontove).

## Jezik

Dugme СР/РУ (dole na telefonu, gore desno na sajtu) prebacuje celu aplikaciju na ruski. Ruski prevod sadržaja je u `src/data/ru.js`, a tekstovi interfejsa u `src/i18n.jsx`. Prevod je nacrt i treba ga proveriti sa izvornim govornikom.

## Mapa Srbije na početnoj

Crvene tačke su mesta u Srbiji, plave u Rusiji. Klik na tačku otvara karticu; ako mesto ima vezu sa Rusijom (linija u `veze` u `mesta.js`), dugme „Пређи у Русију“ preleti mapom do povezanog mesta.

## Sajt i telefon

Ista aplikacija radi i kao sajt: na širokom ekranu (računar) meni je gore, sadržaj je širi, mape „Most vere“ stoje jedna pored druge, a žitija se otvaraju sa desne strane. Na telefonu je raspored kao aplikacija.

## Pokretanje projekta

```bash
npm install
npm run dev
```

## Ekrani

| Ekran | Fajl |
|---|---|
| Početna (ture) | `src/components/Pocetna.jsx` |
| Tura 0: Slovenski koreni (vremenska linija) | `src/components/Koreni.jsx` |
| Žitije / životopis (panel odozdo) | `src/components/Zitije.jsx` |
| Most vere (dve mape, linije) | `src/components/MostVere.jsx` |
| Tura i mesto (četiri pogleda) | `src/components/Tura.jsx`, `Mesto.jsx` |
| Hodočasnički pasoš | `src/components/Pasos.jsx` |
| Sva mesta (spisak po temama) | `src/components/SvaMesta.jsx` |
| Gde se to dogodilo (mapa priče) | `src/components/MapaPrice.jsx` |
| Igra „Reči koje delimo“ | `src/components/Reci.jsx` |

## Sadržaj (ovde se menja tekst)

| Šta | Fajl |
|---|---|
| Žitija, životopisi, vremenska linija | `src/data/zitija.js` |
| Mesta, četiri pogleda, linije Mosta vere | `src/data/mesta.js` |
| Ture | `src/data/ture.js` |
| Reči za igru | `src/data/reci.js` |
| Mesta za „Где се то догодило“ | `src/data/mestaPrica.js` |
| Citat na početnoj | `src/data/citat.js` |

U `mesta.js` pogled koji je `null` prikazuje se kao „У припреми“. Veza sa `provereno: false` crta se isprekidano.

## Pre objavljivanja

- Teolog i istoričar proveravaju sve tekstove (vidi dokument „Словенски корени — житија и животописи“).
- Proveriti ruski prevod.
- Koordinate mesta su približne (posebno Gornji Adrovac i Oreanda).
- Mapa ima dva stila (`src/podloga.js`): „Детаљна“ (OpenStreetMap kao u „Ruskom Beogradu“, sa gradovima, putevima i granicama) i „Стара карта“ (Esri reljef bez granica i natpisa). Boje se podešavaju u `index.css` (`.stil-stara`, `.stil-detaljna`). Za Esri podlogu proveriti uslove korišćenja.
- Krim je, po odluci tima, prikazan na mapi Rusije (`mapa: 'ru'` u `mesta.js`).

## Tura I „Руски Београд“ (spojeno)

Nekadašnja posebna aplikacija je sada deo Puteva vere: `src/rb/`.
- Lokacije, zagonetke, ličnosti, glasovi: `src/rb/data/` (isti format kao ranije).
- Pečati idu u zajednički pasoš kao `rb-<id lokacije>`.
- Fotografije „некад/сад“: `public/slike/<id>-nekad.jpg` i `<id>-sad.jpg`.
- Stilovi su u `src/rb/rb.css` (sve klase imaju prefiks `rb-`).

## Некад ↔ Сад (istorijske granice)

Dugme iznad mapa uključuje istorijske granice iz OpenHistoricalMap (javni domen) za 1350, 1878, 1913. i 1925. godinu; klizač menja providnost.
- Kod: `src/istorija.js` i `src/components/Nekad.jsx`.
- Biblioteke (MapLibre GL, maplibre-gl-leaflet, maplibre-gl-dates) se učitavaju sa unpkg tek kad se dugme pritisne.
- Granice su onoliko tačne koliko su ih uneli volonteri OHM-a; za srednji vek pokrivenost može biti slaba — proveriti sa istoričarem tima.
- Ako hoćemo i izgled prave stare karte (npr. David Rumsey, licenca CC BY-NC-SA), dovoljno je dodati XYZ link kao još jedan sloj.

## Sadržaj iz Google tabele (saradnici menjaju tekst, ne izgled)

1. `putevi-vere-sadrzaj.xlsx` otpremi na Google Drive → Otvori pomoću Google tabela.
2. Podeli link sa saradnicima (Uređivač).
3. Datoteka → Deli → Objavi na vebu → list „Места“ → CSV → Objavi. Kopiraj link.
4. Link nalepi u `src/podesavanja.js` (`TABELA_CSV`) i ponovo napravi aplikaciju.

Aplikacija pri svakom otvaranju čita tabelu (i pamti poslednju verziju za rad bez interneta).
Redovi sa ID-om menjaju postojeća mesta; redovi bez ID-a su nova mesta (grupa „Додали сарадници“, a ako je upisana tura — i u turi i pasošu).
Prikazuje se samo red gde u koloni „Објави“ piše „да“. Kod: `src/saradnici.js`.
