import React, {StrictMode} from 'react'
import {vi} from 'vitest'
import {render, unmount, flushRequests} from '../../test/render'
import AuthorInfo from './AuthorInfo'

const originalFetch = global.fetch
let container

beforeEach(() => {
  container = document.createElement('div')
})

afterEach(() => {
  unmount(container)
  global.fetch = originalFetch
  vi.restoreAllMocks()
})

const biographyResponse = extract => ({
  ok: true,
  json: () => Promise.resolve({query: {pages: {1: {extract}}}})
})

test('a delayed response cannot replace the current author biography or its Wikipedia link', async () => {
  const requests = []
  global.fetch = vi.fn(() => new Promise(resolve => requests.push(resolve)))

  render(<AuthorInfo author="Alan Perlis" />, container)
  render(<AuthorInfo author="Alan Kay" />, container)
  requests[1](biographyResponse('Biography of Alan Kay.'))
  await flushRequests()
  requests[0](biographyResponse('Biography of Alan Perlis.'))
  await flushRequests()

  expect(container.textContent).toContain('Biography of Alan Kay.')
  expect(container.textContent).not.toContain('Alan Perlis')
  expect(container.querySelector('a').getAttribute('href')).toBe('https://en.wikipedia.org/wiki/Alan%20Kay')
})

test('a failed earlier request does not clear a newer successful biography', async () => {
  const requests = []
  global.fetch = vi.fn(() => new Promise((resolve, reject) => requests.push({resolve, reject})))

  render(<AuthorInfo author="Alan Perlis" />, container)
  render(<AuthorInfo author="Alan Kay" />, container)
  requests[1].resolve(biographyResponse('Biography of Alan Kay.'))
  await flushRequests()
  requests[0].reject(new Error('Network unavailable'))
  await flushRequests()

  expect(container.textContent).toContain('Biography of Alan Kay.')
  expect(container.textContent).not.toContain('Problem with network')
})

test('clears the previous biography immediately while loading another author', async () => {
  global.fetch = vi.fn()
    .mockResolvedValueOnce(biographyResponse('Biography of Alan Perlis.'))
    .mockImplementationOnce(() => new Promise(() => {}))

  render(<AuthorInfo author="Alan Perlis" />, container)
  await flushRequests()
  expect(container.textContent).toContain('Biography of Alan Perlis.')

  render(<AuthorInfo author="Alan Kay" />, container)

  expect(container.textContent).toBe('')
  expect(container.querySelector('a')).toBeNull()
})

test('handles a network failure and recovers when the author changes', async () => {
  global.fetch = vi.fn()
    .mockRejectedValueOnce(new Error('Network unavailable'))
    .mockResolvedValueOnce(biographyResponse('Biography of Alan Kay.'))

  render(<AuthorInfo author="Alan Perlis" />, container)
  await flushRequests()
  expect(container.textContent).toBe('Problem with network, please try again later.')

  render(<AuthorInfo author="Alan Kay" />, container)
  await flushRequests()

  expect(container.textContent).toContain('Biography of Alan Kay.')
  expect(container.textContent).not.toContain('Problem with network')
})

test('handles an HTTP error without attempting to parse its body as a biography', async () => {
  const json = vi.fn()
  global.fetch = vi.fn(() => Promise.resolve({ok: false, status: 503, json}))

  render(<AuthorInfo author="Alan Perlis" />, container)
  await flushRequests()

  expect(json).not.toHaveBeenCalled()
  expect(container.textContent).toContain('Problem with network')
  expect(container.querySelector('a')).toBeNull()
})

test('does not update a biography after its component has unmounted', async () => {
  let completeRequest
  global.fetch = vi.fn(() => new Promise(resolve => { completeRequest = resolve }))
  const consoleError = vi.spyOn(console, 'error')

  render(<AuthorInfo author="Alan Perlis" />, container)
  unmount(container)
  completeRequest(biographyResponse('Biography of Alan Perlis.'))
  await flushRequests()

  expect(container.textContent).toBe('')
  expect(consoleError).not.toHaveBeenCalled()
})

test('omits the biography and link when Wikipedia has no extract', async () => {
  global.fetch = vi.fn(() => Promise.resolve(biographyResponse('')))

  render(<AuthorInfo author="Unknown author" />, container)
  await flushRequests()

  expect(container.textContent).toBe('')
  expect(container.querySelector('a')).toBeNull()
})

test('clears a previous biography when returning to its author while a fresh request is pending', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce(biographyResponse('Previous biography.'))
    .mockImplementation(() => new Promise(() => {}))
  render(<AuthorInfo author="Alan Perlis" />, container)
  await flushRequests()
  expect(container.textContent).toContain('Previous biography.')
  render(<AuthorInfo author="Alan Kay" />, container)
  render(<AuthorInfo author="Alan Perlis" />, container)
  expect(container.textContent).toBe('')
})

test('ignores the first request when Strict Mode restarts the effect', async () => {
  const requests = []
  global.fetch = vi.fn(() => new Promise(resolve => requests.push(resolve)))
  render(<StrictMode><AuthorInfo author="Alan Perlis" /></StrictMode>, container)
  expect(requests).toHaveLength(2)
  requests[1](biographyResponse('Current biography.'))
  await flushRequests()
  requests[0](biographyResponse('Stale biography.'))
  await flushRequests()
  expect(container.textContent).toContain('Current biography.')
  expect(container.textContent).not.toContain('Stale biography.')
})
