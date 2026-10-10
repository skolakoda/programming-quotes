import {randomUUID} from 'node:crypto'
import {rename, rm, writeFile} from 'node:fs/promises'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {loadEnv} from 'vite'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const localData = fileURLToPath(new URL('../src/data/quotes.json', import.meta.url))

function validateQuotes(quotes) {
  if (!Array.isArray(quotes) || quotes.length === 0)
    throw new Error('Expected a non-empty array of quotes; local data was not changed.')
  const ids = new Set()
  for (const quote of quotes) {
    if (!quote || typeof quote._id !== 'string' || !quote._id.trim() || ids.has(quote._id)
      || typeof quote.author !== 'string' || !quote.author.trim()
      || !['en', 'sr'].some(language => typeof quote[language] === 'string' && quote[language].trim())
      || ['en', 'sr'].some(language => quote[language] != null && typeof quote[language] !== 'string')
      || (quote.rating != null && (!Number.isFinite(Number(quote.rating)) || Number(quote.rating) < 0 || Number(quote.rating) > 5)))
      throw new Error('Invalid quote data; local data was not changed.')
    ids.add(quote._id)
  }
}

export async function saveQuotes(url, destination = localData) {
  const endpoint = new URL(url)
  if (!['http:', 'https:'].includes(endpoint.protocol)) throw new Error('Use an HTTP or HTTPS quote URL.')
  const response = await fetch(endpoint, {signal: AbortSignal.timeout(30000)})
  if (!response.ok) throw new Error(`Quote server returned HTTP ${response.status}; local data was not changed.`)
  const quotes = await response.json()
  validateQuotes(quotes)

  const temporary = `${destination}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, JSON.stringify(quotes, null, 2) + '\n', {encoding: 'utf8', flag: 'wx'})
    await rename(temporary, destination)
  } finally {
    await rm(temporary, {force: true})
  }
  return quotes.length
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length > 3) throw new Error('Usage: npm run save -- [quotes-url]')
    const env = loadEnv('server', projectRoot, 'REACT_APP_')
    const domain = (env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/+$/, '')
    const count = await saveQuotes(process.argv[2] || `${domain}/quotes/`)
    console.log(`Saved ${count} quotes to src/data/quotes.json.`)
  } catch (error) {
    console.error(`Unable to save quotes: ${error.message}`)
    process.exitCode = 1
  }
}
