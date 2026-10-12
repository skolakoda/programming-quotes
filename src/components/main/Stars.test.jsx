import {vi} from 'vitest'
import {act, render, unmount} from '../../test/render'
import Stars from './Stars'
import {LS} from '../../config/localstorage'

let container
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
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

test('half-star votes are saved without network requests and can be changed', () => {
  localStorage.setItem(LS.localRatings, JSON.stringify({other: 2}))
  render(<Stars id="local" rating="3.5" />, container)
  expect(container.querySelector('[role="radiogroup"]').getAttribute('aria-label')).toBe('Rating: 3.5 / 5')
  expect(container.querySelectorAll('.rating-star')).toHaveLength(5)
  expect(container.querySelectorAll('.rating-fill')[3].style.width).toBe('50%')
  click(4.5)
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({other: 2, local: 4.5})
  click(2)
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 2 / 5')
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({other: 2, local: 2})
  expect(fetch).not.toHaveBeenCalled()
})

test('restores local ratings after remounting and changing quotes', () => {
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
  'recovers from invalid saved ratings: %s', saved => {
      localStorage.setItem(LS.localRatings, saved)
    render(<Stars id="local" rating={3} />, container)
    expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 3 / 5')
    click(4)
    expect(JSON.parse(localStorage.getItem(LS.localRatings)).local).toBe(4)
  }
)

test('blocked storage reports an error and allows retrying', () => {
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
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage blocked') })
  render(<Stars id="local" rating={3} />, container)
  expect(container.querySelector('.rating').getAttribute('aria-label')).toBe('Rating: 3 / 5')
})

test('saves a vote for the currently displayed rating', () => {
  render(<Stars id="local" rating={3} />, container)
  click(3)
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({local: 3})
})
