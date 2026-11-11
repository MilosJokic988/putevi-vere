import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { zitija, vremenskaLinija } from './data/zitija'
import { mesta, veze, teme, kategorijeMesta } from './data/mesta'
import { ture } from './data/ture'
import { lazniPrijatelji, isteReci } from './data/reci'
import { izKesa, ucitajSaradnike, dodajSaradnike } from './saradnici'
import { mestaPrica } from './data/mestaPrica'
import { citat } from './data/citat'
import * as RU from './data/ru'

// ===== Tekstovi interfejsa =====
const UI = {
  sr: {
    naslovApp: 'Путеви вере', podnaslovApp: 'Места, приче и ходочашћа која спајају два народа',
    pocetna: 'Почетна', mapa: 'Мапа', reci: 'Речи', pasos: 'Пасош', glavniMeni: 'Главни мени',
    nazad: 'Назад', zatvori: 'Затвори', jezik: 'Језик',
    turaMeseca: 'ТУРА МЕСЕЦА', mostVere: 'Мост вере', mostOpis: 'Србија и Русија на једној мапи — свака линија је прича',
    svaMesta: 'Сва места', svaMestaOpis: 'Светиње, руска емиграција и руски добровољци — на једном списку',
    sveTure: 'Све туре', podnozje: 'Пројекат младих из Србије и Русије',
    tura: 'ТУРА', uvod: 'ТУРА 0 · УВОД', koreniNaslov: 'Словенски корени',
    koreniUvod: 'рби и Руси говоре сродним језицима, пишу истим писмом и исповедају исту веру. Ево како је све почело.', koreniInicijal: 'С',
    dodirniIme: 'Додирни подвучено име или догађај', igraLink: 'Речи које делимо →',
    zitije: 'Житије', zivotopis: 'Животопис', prica: 'Прича', veze: 'Везе', praznik: 'ПРАЗНИК',
    poNovom: 'по новом', poStarom: 'по старом', gdeSeDogodilo: 'Погледај где се то догодило',
    naMapi: 'Погледај на мапи „Мост вере“ →', potpis: 'Пише: тим пројекта · Проверио: [стручни рецензент]',
    gdeNaslov: 'ГДЕ СЕ ТО ДОГОДИЛО',
    mostPodnaslov: 'Свака линија је једна прича', rusija: 'РУСИЈА', srbija: 'СРБИЈА И СВЕТА ГОРА', rusijaMalo: 'Русија', srbijaMalo: 'Србија и Света Гора',
    uputstvo: 'Додирни златну линију или место', pokaziOba: 'Покажи оба места', procitaj: 'Прочитај →',
    provereno: '✓ проверено', proveriti: '⚠ проверити', uPripremi: 'Прича у припреми.', cetiriPogleda: 'Историја · Вера · Пут · Контекст',
    otvoriMesto: 'Отвори место →',
    pogledi: { istorija: 'Историја', vera: 'Вера', put: 'Пут', kontekst: 'Контекст' },
    autori: { istorija: 'историчар', vera: 'теолог', put: 'географ', kontekst: 'политиколог' },
    slova: { istorija: 'И', vera: 'В', put: 'П', kontekst: 'К' },
    pise: 'Пише:', tima: 'тима', uPripremiPogled: (a) => `[У припреми — овај део пише ${a} тима.]`,
    foto: 'ФОТО: НЕКАД / САД', mesto: 'МЕСТО', proveritiMesto: 'Ово место још треба проверити пре објављивања.',
    celaPrica: 'Прочитај целу причу →', pecatUPasosu: 'Печат је у пасошу', bioSi: 'Био си на овом месту.', dodajPecat: '+ Печат у пасош', ukloniPecat: 'Уклони печат', uredi: 'Уреди', gotovo: 'Готово', urediUputstvo: 'Додирни печат који желиш да уклониш.',
    pasosNaslov: 'Ходочаснички пасош', sakupljeno: (a, b) => `Сакупљено ${a} од ${b} печата`,
    sertifikat: 'Сертификат ходочасника', sertifikatGotov: (t) => `Тура ${t} је завршена. Сертификат на српском и руском стиже у следећој верзији.`,
    sertifikatOpis: 'Сакупи све печате једне туре и добићеш сертификат на српском и руском.',
    igra: 'ИГРА', reciNaslov: 'Речи које делимо', lazni: 'Лажни пријатељи', iste: 'Исте речи',
    isteOpis: 'Ове речи су исте у оба језика и значе исто:', drugiJezik: 'РУ', savrseno: 'Савршено! Ти си прави мост између два језика.',
    dobro: 'Добро је! Пробај поново.', ponovo: 'Играј поново', tacno: '✓ тачно', netacno: '✗ није', zapamti: 'Запамти:',
    sledece: 'Следеће питање →', rezultat: 'Види резултат →',
    mestaBroj: (n) => `${n} МЕСТА`, svaMestaPodnaslov: 'Места српско-руских веза у Србији, на Светој Гори и у Русији',
    oznakaRu: 'РУ', oznakaSr: 'СР', svaMestaSavet: 'Списак допуњује историчар тима. Свако ново место уписује се у фајл src/data/mesta.js.',
    spoljna1: 'Тура „Руски Београд“ постоји као посебна апликација: мапа са 8 места, загонетке, печати, личности и „Кроз објектив“.',
    spoljna2: 'У следећој верзији спојићемо је са Путевима вере.',
    razdaljina: '≈ 1.700 км',
    mapaSrbijeNaslov: 'Србија и Русија: места која нас спајају', legendaSrbija: 'Србија', legendaRusija: 'Русија',
    uputstvoSrbija: 'Додирни црвену тачку', preciURusiju: (m) => `Пређи у Русију: ${m} →`, nazadUSrbiju: '← Назад у Србију',
    bezVeze: 'Веза са Русијом описана је у причи о месту.',
    stilStara: 'Стара карта', stilDetaljna: 'Детаљна', stilMape: 'Стил мапе',
    nekadSad: 'Некад ↔ Сад', nekad: 'Некад', sad: 'Сад', izaberiGodinu: 'Изабери годину',
    ucitavaKartu: 'учитавам историјску карту…', greskaKarte: 'историјска карта сада није доступна (провери интернет)',
    godineOpis: { 1350: 'Српско царство цара Душана', 1878: 'Берлински конгрес: независна Србија', 1913: 'После балканских ратова; Руско царство', 1925: 'Краљевина СХС — време руске емиграције' },
    granicePrema: 'Границе: OpenHistoricalMap (јавни домен), приближне',
    uneo: 'Унео/унела', rbPodnaslov: 'Траговима руске емиграције — 8 места у центру града'
  },
  ru: {
    naslovApp: 'Пути веры', podnaslovApp: 'Места, истории и паломничества, которые объединяют два народа',
    pocetna: 'Главная', mapa: 'Карта', reci: 'Слова', pasos: 'Паспорт', glavniMeni: 'Главное меню',
    nazad: 'Назад', zatvori: 'Закрыть', jezik: 'Язык',
    turaMeseca: 'МАРШРУТ МЕСЯЦА', mostVere: 'Мост веры', mostOpis: 'Сербия и Россия на одной карте — каждая линия — это история',
    svaMesta: 'Все места', svaMestaOpis: 'Святыни, русская эмиграция и русские добровольцы — в одном списке',
    sveTure: 'Все маршруты', podnozje: 'Проект молодёжи Сербии и России',
    tura: 'МАРШРУТ', uvod: 'МАРШРУТ 0 · ВВЕДЕНИЕ', koreniNaslov: 'Славянские корни',
    koreniUvod: 'ербы и русские говорят на родственных языках, пишут одним письмом и исповедуют одну веру. Вот как всё начиналось.', koreniInicijal: 'С',
    dodirniIme: 'Нажмите на подчёркнутое имя или событие', igraLink: 'Общие слова →',
    zitije: 'Житие', zivotopis: 'Жизнеописание', prica: 'История', veze: 'Связи', praznik: 'ПАМЯТЬ',
    poNovom: 'по новому стилю', poStarom: 'по старому стилю', gdeSeDogodilo: 'Посмотреть, где это произошло',
    naMapi: 'Посмотреть на карте «Мост веры» →', potpis: 'Автор: команда проекта · Проверил: [научный редактор]',
    gdeNaslov: 'ГДЕ ЭТО ПРОИЗОШЛО',
    mostPodnaslov: 'Каждая линия — это история', rusija: 'РОССИЯ', srbija: 'СЕРБИЯ И СВЯТАЯ ГОРА', rusijaMalo: 'Россия', srbijaMalo: 'Сербия и Святая Гора',
    uputstvo: 'Нажмите на золотую линию или место', pokaziOba: 'Показать оба места', procitaj: 'Читать →',
    provereno: '✓ проверено', proveriti: '⚠ проверить', uPripremi: 'История готовится.', cetiriPogleda: 'История · Вера · Путь · Контекст',
    otvoriMesto: 'Открыть место →',
    pogledi: { istorija: 'История', vera: 'Вера', put: 'Путь', kontekst: 'Контекст' },
    autori: { istorija: 'историк', vera: 'богослов', put: 'географ', kontekst: 'политолог' },
    slova: { istorija: 'И', vera: 'В', put: 'П', kontekst: 'К' },
    pise: 'Автор:', tima: 'команды', uPripremiPogled: (a) => `[Готовится — этот раздел пишет ${a} команды.]`,
    foto: 'ФОТО: ТОГДА / СЕЙЧАС', mesto: 'МЕСТО', proveritiMesto: 'Это место ещё нужно проверить перед публикацией.',
    celaPrica: 'Читать всю историю →', pecatUPasosu: 'Печать в паспорте', bioSi: 'Вы побывали на этом месте.', dodajPecat: '+ Печать в паспорт', ukloniPecat: 'Убрать печать', uredi: 'Изменить', gotovo: 'Готово', urediUputstvo: 'Нажмите на печать, который хотите убрать.',
    pasosNaslov: 'Паспорт паломника', sakupljeno: (a, b) => `Собрано ${a} из ${b} печатей`,
    sertifikat: 'Сертификат паломника', sertifikatGotov: (t) => `Маршрут ${t} пройден. Сертификат на сербском и русском появится в следующей версии.`,
    sertifikatOpis: 'Соберите все печати одного маршрута и получите сертификат на сербском и русском.',
    igra: 'ИГРА', reciNaslov: 'Общие слова', lazni: 'Ложные друзья', iste: 'Одинаковые слова',
    isteOpis: 'Эти слова одинаковы в обоих языках и значат одно и то же:', drugiJezik: 'СР', savrseno: 'Отлично! Вы — настоящий мост между двумя языками.',
    dobro: 'Хорошо! Попробуйте ещё раз.', ponovo: 'Играть снова', tacno: '✓ верно', netacno: '✗ нет', zapamti: 'Запомните:',
    sledece: 'Следующий вопрос →', rezultat: 'Результат →',
    mestaBroj: (n) => `${n} МЕСТ`, svaMestaPodnaslov: 'Места русско-сербских связей в Сербии, на Святой Горе и в России',
    oznakaRu: 'РФ', oznakaSr: 'СР', svaMestaSavet: 'Список дополняет историк команды.',
    spoljna1: 'Маршрут «Русский Белград» существует как отдельное приложение: карта с 8 местами, загадки, печати, личности и «Сквозь объектив».',
    spoljna2: 'В следующей версии мы объединим его с «Путями веры».',
    razdaljina: '≈ 1700 км',
    mapaSrbijeNaslov: 'Сербия и Россия: места, которые нас связывают', legendaSrbija: 'Сербия', legendaRusija: 'Россия',
    uputstvoSrbija: 'Нажмите на красную точку', preciURusiju: (m) => `Перейти в Россию: ${m} →`, nazadUSrbiju: '← Назад в Сербию',
    bezVeze: 'Связь с Россией описана в истории места.',
    stilStara: 'Старинная карта', stilDetaljna: 'Подробная', stilMape: 'Стиль карты',
    nekadSad: 'Тогда ↔ Сейчас', nekad: 'Тогда', sad: 'Сейчас', izaberiGodinu: 'Выберите год',
    ucitavaKartu: 'загружаю историческую карту…', greskaKarte: 'историческая карта сейчас недоступна (проверьте интернет)',
    godineOpis: { 1350: 'Сербское царство Стефана Душана', 1878: 'Берлинский конгресс: независимая Сербия', 1913: 'После Балканских войн; Российская империя', 1925: 'Королевство СХС — время русской эмиграции' },
    granicePrema: 'Границы: OpenHistoricalMap (общественное достояние), приблизительно',
    uneo: 'Добавил(а)', rbPodnaslov: 'По следам русской эмиграции — 8 мест в центре города'
  }
}

// Spaja srpske podatke sa ruskim prevodom (ključ po ključ)
function spoj(sr, ru) {
  if (!ru) return sr
  const out = { ...sr }
  for (const [k, v] of Object.entries(ru)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && sr[k] && typeof sr[k] === 'object') out[k] = spoj(sr[k], v)
    else out[k] = v
  }
  return out
}

function sadrzaj(jezik) {
  if (jezik === 'sr') {
    return { zitija, vremenskaLinija, mesta, veze, teme, ture, lazniPrijatelji, isteReci, mestaPrica, citat, kategorijeMesta, kategorijeNaslovi: null }
  }
  const z = Object.fromEntries(Object.entries(zitija).map(([k, v]) => [k, spoj(v, RU.zitijaRu[k])]))
  const vl = vremenskaLinija.map((d) => spoj(d, RU.vremenskaRu[d.id]))
  const m = Object.fromEntries(Object.entries(mesta).map(([k, v]) => [k, spoj(v, RU.mestaRu[k])]))
  const ve = veze.map((v, i) => ({ ...spoj(v, RU.vezeRu[i]), tema: RU.temeRu[teme.indexOf(v.tema)] || v.tema }))
  const tu = ture.map((t) => spoj(t, RU.tureRu[t.id]))
  const mp = Object.fromEntries(Object.entries(mestaPrica).map(([k, lista]) => [k, lista.map((x, i) => spoj(x, RU.mestaPricaRu[k]?.[i]))]))
  return {
    zitija: z, vremenskaLinija: vl, mesta: m, veze: ve, teme: RU.temeRu, ture: tu,
    lazniPrijatelji: RU.lazniRu, isteReci: isteReci.map(([a, b]) => [b, a]), mestaPrica: mp,
    citat: { ...citat, ...RU.citatRu }, kategorijeMesta, kategorijeNaslovi: RU.kategorijeRu
  }
}

const Kontekst = createContext(null)

export function JezikProvider({ children }) {
  const [jezik, setJezik] = useState(() => {
    try {
      return localStorage.getItem('pv-jezik') || 'sr'
    } catch {
      return 'sr'
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('pv-jezik', jezik)
    } catch {
      /* ignoriši */
    }
    document.documentElement.lang = jezik
    document.title = UI[jezik].naslovApp
  }, [jezik])
  const [stilMape, setStilMape] = useState(() => {
    try {
      return localStorage.getItem('pv-stil-mape') || 'detaljna'
    } catch {
      return 'detaljna'
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('pv-stil-mape', stilMape)
    } catch {
      /* ignoriši */
    }
  }, [stilMape])
  // Istorijski sloj „Некад ↔ Сад“ (zajednički za sve mape): godina null = isključen
  const [istorija, setIstorija] = useState({ godina: null, providnost: 0.7, status: null })
  // Mesta koja unose saradnici (Google tabela); prvo iz keša, pa sveže sa mreže
  const [saradnici, setSaradnici] = useState(izKesa)
  useEffect(() => {
    ucitajSaradnike().then((l) => l && setSaradnici(l)).catch(() => {})
  }, [])
  const s = useMemo(() => dodajSaradnike(sadrzaj(jezik), saradnici, jezik), [jezik, saradnici])
  const vrednost = useMemo(() => ({ jezik, setJezik, t: UI[jezik], s, stilMape, setStilMape, istorija, setIstorija }), [jezik, s, stilMape, istorija])
  return <Kontekst.Provider value={vrednost}>{children}</Kontekst.Provider>
}

export const useJ = () => useContext(Kontekst)
