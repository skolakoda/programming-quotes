// @vitest-environment node
import {mkdtemp, readFile, readdir, rm, rmdir, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {createServer} from 'node:http'
import {once} from 'node:events'
import {vi} from 'vitest'
import {saveQuotes} from './save-quotes.mjs'

let directory, destination
const original = 'Existing local quotes\n'
const quotes = [{_id: 'first', author: 'Alan Kay', en: 'A quote', sr: '', rating: 3.5}]

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'quotes-save-test-'))
  destination = join(directory, 'quotes.json')
  await writeFile(destination, original)
  vi.stubGlobal('fetch', vi.fn())
})
afterEach(async () => {
  vi.unstubAllGlobals()
  await rm(destination, {force: true})
  await rmdir(directory)
})

test('valid server data replaces local quotes and leaves no temporary file', async () => {
  fetch.mockResolvedValue({ok: true, json: async () => quotes})
  expect(await saveQuotes('https://example.com/quotes/', destination)).toBe(1)
  expect(JSON.parse(await readFile(destination, 'utf8'))).toEqual(quotes)
  expect(await readdir(directory)).toEqual(['quotes.json'])
})

test('downloads JSON from an HTTP server using native fetch', async () => {
  vi.unstubAllGlobals()
  const server = createServer((request, response) => {
    response.writeHead(200, {'content-type': 'application/json'})
    response.end(JSON.stringify(quotes))
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  try {
    await saveQuotes(`http://127.0.0.1:${server.address().port}/quotes/`, destination)
    expect(JSON.parse(await readFile(destination, 'utf8'))).toEqual(quotes)
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
})

test.each([
  [], {error: 'Unauthorized'}, [{...quotes[0], _id: ''}],
  [{...quotes[0], author: ''}], [{...quotes[0], en: '', sr: ''}],
  [{...quotes[0], sr: 3}], [{...quotes[0], rating: 6}],
  [quotes[0], quotes[0]]
])('invalid responses preserve existing local data: %j', async data => {
  fetch.mockResolvedValue({ok: true, json: async () => data})
  await expect(saveQuotes('https://example.com/quotes/', destination)).rejects.toThrow()
  expect(await readFile(destination, 'utf8')).toBe(original)
  expect(await readdir(directory)).toEqual(['quotes.json'])
})

test('HTTP errors preserve local data even if the error body looks valid', async () => {
  fetch.mockResolvedValue({ok: false, status: 500, json: async () => quotes})
  await expect(saveQuotes('https://example.com/quotes/', destination)).rejects.toThrow('HTTP 500')
  expect(await readFile(destination, 'utf8')).toBe(original)
})

test('invalid JSON preserves local data', async () => {
  fetch.mockResolvedValue({ok: true, json: async () => { throw new SyntaxError('Invalid JSON') }})
  await expect(saveQuotes('https://example.com/quotes/', destination)).rejects.toThrow('Invalid JSON')
  expect(await readFile(destination, 'utf8')).toBe(original)
})

test('network failures preserve local data', async () => {
  fetch.mockRejectedValue(new Error('Offline'))
  await expect(saveQuotes('https://example.com/quotes/', destination)).rejects.toThrow('Offline')
  expect(await readFile(destination, 'utf8')).toBe(original)
})

test('unsupported URLs fail before downloading or modifying data', async () => {
  await expect(saveQuotes('file:///quotes.json', destination)).rejects.toThrow('HTTP or HTTPS')
  expect(fetch).not.toHaveBeenCalled()
  expect(await readFile(destination, 'utf8')).toBe(original)
})
