import { TABELA_CSV } from './podesavanja'

// Mesta koja saradnici (geograf, istoričar, politikolog…) unose preko Google obrasca.
// Prikazuju se samo redovi gde u koloni „Објави“ piše да / da / x.
// Zaglavlja kolona prepoznajemo po početku reči, pa nije bitno da li je ćirilica ili latinica.

const KLJUC_KES = 'pv-saradnici'

export function parsirajCSV(tekst) {
  const redovi = []
  let red = [], polje = '', uNavodnicima = false
  for (let i = 0; i < tekst.length; i++) {
    const c = tekst[i]
    if (uNavodnicima) {
      if (c === '"' && tekst[i + 1] === '"') { polje += '"'; i++ }
      else if (c === '"') uNavodnicima = false
      else polje += c
    } else if (c === '"') uNavodnicima = true
    else if (c === ',') { red.push(polje); polje = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && tekst[i + 1] === '\n') i++
      red.push(polje); redovi.push(red); red = []; polje = ''
    } else polje += c
  }
  if (polje !== '' || red.length) { red.push(polje); redovi.push(red) }
  return redovi.filter((r) => r.some((x) => x.trim() !== ''))
}

const LAT = { а:'a',б:'b',в:'v',г:'g',д:'d',ђ:'dj',е:'e',ж:'z',з:'z',и:'i',ј:'j',к:'k',л:'l',љ:'lj',м:'m',н:'n',њ:'nj',о:'o',п:'p',р:'r',с:'s',т:'t',ћ:'c',у:'u',ф:'f',х:'h',ц:'c',ч:'c',џ:'dz',ш:'s',č:'c',ć:'c',ž:'z',š:'s',đ:'dj',ы:'y',э:'e',ю:'ju',я:'ja',й:'j',ь:'',ъ:'',щ:'s',ё:'e' }
const norm = (s) => s.toLowerCase().trim().split('').map((c) => (c in LAT ? LAT[c] : c)).join('')

// kolona → početak naslova pitanja u obrascu (latinično, bez kvačica)
const KOLONE = {
  id: ['id'],
  objavi: ['objav'],
  imeRu: ['naziv na rusk', 'ime na rusk'],
  ime: ['naziv', 'ime mesta'],
  drzava: ['drzav', 'mapa'],
  koordinate: ['koordinat'],
  tura: ['tura'],
  kratkoRu: ['kratko na rusk', 'kratak opis na rusk'],
  kratko: ['kratko', 'kratak opis'],
  istorija: ['istorij'],
  vera: ['vera'],
  put: ['put'],
  kontekst: ['kontekst'],
  autor: ['autor', 'uneo', 'vase ime'],
  vreme: ['vremensk', 'timestamp']
}

function mapirajZaglavlje(zaglavlje) {
  const idx = {}
  zaglavlje.forEach((z, i) => {
    const n = norm(z)
    for (const [k, pocetci] of Object.entries(KOLONE)) {
      if (idx[k] === undefined && pocetci.some((p) => n.startsWith(p))) { idx[k] = i; break }
    }
  })
  return idx
}

const da = (v) => ['да', 'da', 'x', 'х', 'yes', 'true', '✓'].includes(norm(v || ''))

export function redoviUMesta(redovi) {
  if (redovi.length < 2) return []
  const idx = mapirajZaglavlje(redovi[0])
  const uzmi = (r, k) => (idx[k] === undefined ? '' : (r[idx[k]] || '').trim())
  const izlaz = []
  redovi.slice(1).forEach((r, i) => {
    if (idx.objavi !== undefined && !da(uzmi(r, 'objavi'))) return
    const ime = uzmi(r, 'ime')
    const brojevi = (uzmi(r, 'koordinate').match(/-?\d+(?:[.,]\d+)?/g) || []).map((x) => parseFloat(x.replace(',', '.')))
    if (!ime || brojevi.length < 2 || brojevi.some(isNaN)) return
    const drz = norm(uzmi(r, 'drzava'))
    const tura = (uzmi(r, 'tura').match(/\b(I{1,3}|IV|V|0)\b/) || [])[1] || ''
    const pogled = (k) => uzmi(r, k) || null
    const svojId = uzmi(r, 'id')
    izlaz.push({
      id: svojId || 'sar-' + (i + 1),
      tura,
      mesto: {
        ime,
        mapa: drz.startsWith('rus') || drz === 'ru' ? 'ru' : 'sr',
        ll: [brojevi[0], brojevi[1]],
        kratko: uzmi(r, 'kratko') || undefined,
        autor: uzmi(r, 'autor') || undefined,
        saradnici: true,
        tura: tura || undefined,
        pogledi: { istorija: pogled('istorija'), vera: pogled('vera'), put: pogled('put'), kontekst: pogled('kontekst') }
      },
      ru: { ime: uzmi(r, 'imeRu') || undefined, kratko: uzmi(r, 'kratkoRu') || undefined }
    })
  })
  return izlaz
}

export function izKesa() {
  try {
    return JSON.parse(localStorage.getItem(KLJUC_KES) || '[]')
  } catch {
    return []
  }
}

export async function ucitajSaradnike() {
  const url = (typeof window !== 'undefined' && window.PV_TABELA) || TABELA_CSV
  if (!url) return null
  const odg = await fetch(url, { cache: 'no-store' })
  if (!odg.ok) throw new Error('Tabela nije dostupna')
  const lista = redoviUMesta(parsirajCSV(await odg.text()))
  try {
    localStorage.setItem(KLJUC_KES, JSON.stringify(lista))
  } catch {
    /* ignoriši */
  }
  return lista
}

// Ubaci mesta saradnika u sadržaj aplikacije (mapa, sva mesta, ture, pasoš)
export function dodajSaradnike(s, lista, jezik) {
  if (!lista || !lista.length) return s
  const mesta = { ...s.mesta }
  const nova = []
  for (const x of lista) {
    const staro = s.mesta[x.id]
    let m
    if (staro && jezik === 'ru') {
      // postojeće mesto na ruskom: menjaju se samo ruske kolone i koordinate
      m = { ...staro, ll: x.mesto.ll }
    } else if (staro) {
      // postojeće mesto: prazne ćelije ne brišu tekst iz aplikacije
      const pogledi = { ...(staro.pogledi || {}) }
      for (const [k, v] of Object.entries(x.mesto.pogledi)) if (v) pogledi[k] = v
      m = { ...staro, ime: x.mesto.ime, ll: x.mesto.ll, mapa: x.mesto.mapa, pogledi: staro.pogledi || Object.values(pogledi).some(Boolean) ? pogledi : staro.pogledi }
      if (x.mesto.kratko) m.kratko = x.mesto.kratko
      if (x.mesto.autor) m.autor = x.mesto.autor
    } else {
      m = { ...x.mesto }
      nova.push(x)
    }
    if (jezik === 'ru') {
      if (x.ru.ime) m.ime = x.ru.ime
      if (x.ru.kratko) m.kratko = x.ru.kratko
    }
    mesta[x.id] = m
  }
  if (!nova.length) return { ...s, mesta }
  const ture = s.ture.map((t) => {
    const nova2 = nova.filter((x) => x.tura === t.id).map((x) => x.id)
    return nova2.length && t.mesta ? { ...t, mesta: [...t.mesta, ...nova2] } : t
  })
  return { ...s, mesta, ture, kategorijeMesta: { ...s.kategorijeMesta, saradnici: nova.map((x) => x.id) } }
}
