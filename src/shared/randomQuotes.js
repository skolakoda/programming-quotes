import {LS} from '../config/localstorage'

export function readQuoteHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS.quoteHistory))
    return Object.fromEntries(['en', 'sr', 'stsl'].flatMap(language => {
      const history = saved?.[language]
      return Array.isArray(history?.remaining) && history.remaining.every(id => typeof id === 'string')
        && new Set(history.remaining).size === history.remaining.length
        && Array.isArray(history?.known) && history.known.every(id => typeof id === 'string')
        && typeof history.lastId === 'string' ? [[language, history]] : []
    }))
  } catch {
    return {}
  }
}

export function saveQuoteHistory(history) {
  try {
    localStorage.setItem(LS.quoteHistory, JSON.stringify(history))
  } catch {
    // The current page still keeps its history when browser storage is unavailable.
  }
}

function shuffle(ids) {
  const shuffled = [...ids]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[other]
    shuffled[other] = current
  }
  return shuffled
}

export function selectRandomQuote(allQuotes, language, history, preferredId) {
  const translated = allQuotes.filter(quote => quote[language])
  if (!translated.length) return {allQuotes, language, history, quote: null}

  const previous = history[language]
  const ids = translated.map(quote => quote._id)
  const availableIds = new Set(ids)
  const known = new Set(previous?.known || [])
  let remaining = (previous?.remaining || []).filter(id => availableIds.has(id))
  remaining = [...remaining, ...shuffle(ids.filter(id => !known.has(id)))]
  const preferred = translated.find(quote => quote._id === preferredId)
  if (!preferred && !remaining.length) {
    remaining = shuffle(ids)
    if (remaining.length > 1 && remaining[0] === previous?.lastId) {
      const first = remaining[0]
      remaining[0] = remaining[1]
      remaining[1] = first
    }
  }

  const quote = preferred || translated.find(quote => quote._id === remaining[0])
  remaining = remaining.filter(id => id !== quote._id)
  return {
    allQuotes, language, quote,
    history: {...history, [language]: {remaining, known: ids, lastId: quote._id}}
  }
}
