import {vi} from 'vitest'
import {act, render, unmount, flushRequests} from '../../test/render'
import Stars from './Stars'
import {API} from '../../config/api'
import {LS} from '../../config/localstorage'

const dataMode = vi.hoisted(() => ({useServerData: true}))
vi.mock('../../config/api', async importOriginal => ({
  ...await importOriginal(),
  get useServerData() { return dataMode.useServerData }
}))

let container
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
  dataMode.useServerData = true
  vi.stubGlobal('fetch', vi.fn())
  localStorage.clear()
})
afterEach(() => {
  unmount(container)
  container.remove()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function click(score, parent = container) {
  act(() => parent.querySelector(`input[value="${score}"]`).click())
}
const response = rating => ({ok: true, json: async () => ({quote: {rating}})})

test('local half-star votes are saved without server requests and can be changed', () => {
  dataMode.useServerData = false
  localStorage.setItem(LS.localRatings, JSON.stringify({other: 2}))
  localStorage.setItem(LS.ratings, JSON.stringify(['server-quote']))
  render(<Stars id="local" rating="3.5" />, container)
  expect(container.querySelector('[role="radiogroup"]').getAttribute('aria-label')).toBe('Rating: 3.5 / 5')
  expect(container.querySelectorAll('.rating-star')).toHaveLength(5)
  expect(container.querySelectorAll('.rating-fill')[3].style.width).toBe('50%')
  click(4.5)
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({other: 2, local: 4.5})
  click(2)
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 2 / 5')
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({other: 2, local: 2})
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['server-quote'])
  expect(fetch).not.toHaveBeenCalled()
})

test('restores local ratings after remounting and changing quotes', () => {
  dataMode.useServerData = false
  render(<Stars id="first" rating={3} />, container)
  click(4.5)
  render(<Stars id="second" rating={2} />, container)
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 2 / 5')
  click(1.5)
  unmount(container)
  render(<Stars id="first" rating={3} />, container)
  expect(container.querySelector('input[value="4.5"]').checked).toBe(true)
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({first: 4.5, second: 1.5})
})

test.each(['{broken', 'null', '[]', '"text"', '{"local":8}', '{"local":"4"}', '{"local":3.2}', '{"local":null}'])(
  'recovers from invalid saved local ratings: %s', saved => {
    dataMode.useServerData = false
    localStorage.setItem(LS.localRatings, saved)
    render(<Stars id="local" rating={3} />, container)
    expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 3 / 5')
    click(4)
    expect(JSON.parse(localStorage.getItem(LS.localRatings)).local).toBe(4)
  }
)

test('blocked storage reports a local error and allows retrying', () => {
  dataMode.useServerData = false
  render(<Stars id="local" rating={3} />, container)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new Error('Storage blocked') })
  click(4)
  expect(container.querySelector('[role="alert"]').textContent).toBe('Unable to save your rating in this browser.')
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 3 / 5')
  expect(localStorage.getItem(LS.localRatings)).toBeNull()
  click(4)
  expect(container.querySelector('[role="alert"]')).toBeNull()
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({local: 4})
  expect(fetch).not.toHaveBeenCalled()
})

test('blocked storage reads fall back to the initial rating', () => {
  dataMode.useServerData = false
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage blocked') })
  render(<Stars id="local" rating={3} />, container)
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 3 / 5')
})

test('server mode ignores local ratings and still accepts a server vote', async () => {
  localStorage.setItem(LS.localRatings, JSON.stringify({'quote-1': 1.5}))
  fetch.mockResolvedValue(response(4.2))
  render(<Stars id="quote-1" rating={3} />, container)
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 3 / 5')
  click(4)
  await flushRequests()
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({'quote-1': 1.5})
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['quote-1'])
})

test('server mode submits half-star votes and displays the average returned by the server', async () => {
  localStorage.setItem(LS.token, 'saved-token')
  fetch.mockResolvedValue(response(4.2))
  render(<Stars id="quote-1" rating={3} />, container)
  expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(10)
  click(3.5)
  expect([...container.querySelectorAll('input')].every(input => input.disabled)).toBe(true)
  await flushRequests()
  const [url, options] = fetch.mock.calls[0]
  expect(url).toBe(API.vote)
  expect(options.method).toBe('POST')
  expect(JSON.parse(options.body)).toEqual({quoteId: 'quote-1', token: 'saved-token', newVote: 3.5})
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 4.2 / 5')
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['quote-1'])
})

test('allows voting for the currently displayed rating', async () => {
  fetch.mockResolvedValue(response(3))
  render(<Stars id="quote-1" rating={3} />, container)
  click(3)
  await flushRequests()
  expect(fetch).toHaveBeenCalledTimes(1)
})

test('blocks repeated votes and preserves other saved votes', async () => {
  localStorage.setItem(LS.ratings, JSON.stringify(['other']))
  fetch.mockResolvedValue(response(4))
  render(<Stars id="quote-1" rating={3} />, container)
  click(4)
  await flushRequests()
  click(4)
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(container.querySelector('[role="alert"]').textContent).toBe('You can vote just once!')
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['other', 'quote-1'])
})

test.each([
  {ok: false, status: 500, json: async () => ({quote: {rating: 4}})},
  {ok: true, json: async () => ({error: 'Unauthorized'})},
  response(8),
  response(null)
])('failed server responses leave voting available for a retry', async failedResponse => {
  fetch.mockResolvedValueOnce(failedResponse).mockResolvedValueOnce(response(3.5))
  render(<Stars id="quote-1" rating={3} />, container)
  click(3.5)
  await flushRequests()
  expect(localStorage.getItem(LS.ratings)).toBeNull()
  expect(container.querySelector('[role="alert"]')).not.toBeNull()
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 3 / 5')
  click(3.5)
  await flushRequests()
  expect(fetch).toHaveBeenCalledTimes(2)
  expect(container.querySelector('[role="alert"]')).toBeNull()
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['quote-1'])
})

test('ignores late results for the previously displayed quote', async () => {
  let finish
  fetch.mockReturnValue(new Promise(resolve => { finish = resolve }))
  render(<Stars id="old" rating={3} />, container)
  click(4)
  render(<Stars id="new" rating={2} />, container)
  finish(response(4.5))
  await flushRequests()
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 2 / 5')
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['old'])
})

test('keeps both records when votes on different quotes finish concurrently', async () => {
  const requests = []
  fetch.mockImplementation(() => new Promise(resolve => requests.push(resolve)))
  render(<><Stars id="first" rating={3} /><Stars id="second" rating={3} /></>, container)
  const ratings = container.querySelectorAll('.rating')
  click(4, ratings[0])
  click(4, ratings[1])
  requests[0](response(4))
  requests[1](response(4))
  await flushRequests()
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['first', 'second'])
})

test('recovers from invalid stored votes', async () => {
  localStorage.setItem(LS.ratings, '{broken')
  fetch.mockResolvedValue(response(4))
  render(<Stars id="quote-1" rating={3} />, container)
  click(4)
  await flushRequests()
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['quote-1'])
})

test('network errors allow retrying the same vote', async () => {
  fetch.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(response(4))
  render(<Stars id="quote-1" rating={3} />, container)
  click(4)
  await flushRequests()
  expect(container.querySelector('[role="alert"]')).not.toBeNull()
  expect(localStorage.getItem(LS.ratings)).toBeNull()
  click(4)
  await flushRequests()
  expect(JSON.parse(localStorage.getItem(LS.ratings))).toEqual(['quote-1'])
})

test('does not submit a second vote while the first request is pending', async () => {
  let finish
  fetch.mockReturnValue(new Promise(resolve => { finish = resolve }))
  render(<Stars id="quote-1" rating={3} />, container)
  click(4)
  click(5)
  expect(fetch).toHaveBeenCalledTimes(1)
  finish(response(4))
  await flushRequests()
})
