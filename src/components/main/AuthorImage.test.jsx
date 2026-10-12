import React, {StrictMode} from 'react'
import {vi} from 'vitest'
import {act, render, unmount, flushRequests} from '../../test/render'
import AuthorImage from './AuthorImage'
import unknownImage from '../../assets/images/unknown.jpg'

const originalFetch = global.fetch
const originalWidth = window.innerWidth
let container

beforeEach(() => {
  container = document.createElement('div')
  window.innerWidth = 320
})

afterEach(() => {
  unmount(container)
  global.fetch = originalFetch
  window.innerWidth = originalWidth
})

const imageResponse = source => ({
  ok: true,
  json: () => Promise.resolve({query: {pages: {
    1: {thumbnail: {source}}
  }}})
})

test('uses the mobile thumbnail URL returned by Wikipedia without rewriting its size', async () => {
  const source = 'https://example.com/330px-Alan_Perlis.jpg'
  global.fetch = vi.fn(() => Promise.resolve(imageResponse(source)))

  render(<AuthorImage author="Alan Perlis" />, container)
  await flushRequests()

  const request = new URL(global.fetch.mock.calls[0][0])
  expect(request.searchParams.get('pithumbsize')).toBe('320')
  expect(request.searchParams.get('pilicense')).toBe('any')
  expect(request.searchParams.get('redirects')).toBe('1')
  const image = container.querySelector('img')
  expect(image.getAttribute('src')).toBe(source)
  expect(image.classList.contains('loaded')).toBe(false)
  act(() => image.dispatchEvent(new Event('load')))
  expect(image.classList.contains('loaded')).toBe(true)
})

test('ignores a delayed portrait response for the previous author', async () => {
  const requests = []
  global.fetch = vi.fn(() => new Promise(resolve => requests.push(resolve)))

  render(<AuthorImage author="Alan Perlis" />, container)
  render(<AuthorImage author="Alan Kay" />, container)
  requests[1](imageResponse('kay.jpg'))
  await flushRequests()
  requests[0](imageResponse('perlis.jpg'))
  await flushRequests()

  expect(container.querySelector('img').getAttribute('src')).toBe('kay.jpg')
  expect(container.querySelector('img').getAttribute('alt')).toBe('Alan Kay')
})

test('shows the placeholder after a failed request when the author page requires an image', async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error('Network unavailable')))

  render(<AuthorImage author="Alan Perlis" showUnknown={true} />, container)
  await flushRequests()

  const image = container.querySelector('img')
  expect(image.getAttribute('src')).toBe(unknownImage)
  act(() => image.dispatchEvent(new Event('load')))
  expect(image.classList.contains('loaded')).toBe(true)
})

test('falls back to the placeholder if the portrait itself fails to load', async () => {
  global.fetch = vi.fn(() => Promise.resolve(imageResponse('perlis.jpg')))

  render(<AuthorImage author="Alan Perlis" showUnknown={true} />, container)
  await flushRequests()
  act(() => container.querySelector('img').dispatchEvent(new Event('error')))

  expect(container.querySelector('img').getAttribute('src')).toBe(unknownImage)
  act(() => container.querySelector('img').dispatchEvent(new Event('error')))
  expect(container.querySelector('img')).toBeNull()
})

test('omits the portrait when Wikipedia has no image and no placeholder is requested', async () => {
  global.fetch = vi.fn(() => Promise.resolve({
    ok: true, json: () => Promise.resolve({query: {pages: {1: {title: 'Unknown author'}}}})
  }))

  render(<AuthorImage author="Unknown author" />, container)
  await flushRequests()

  expect(container.querySelector('img')).toBeNull()
})

test('clears a previous portrait when returning to its author while a fresh request is pending', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce(imageResponse('perlis.jpg'))
    .mockImplementation(() => new Promise(() => {}))
  render(<AuthorImage author="Alan Perlis" />, container)
  await flushRequests()
  expect(container.querySelector('img').getAttribute('src')).toBe('perlis.jpg')
  render(<AuthorImage author="Alan Kay" />, container)
  render(<AuthorImage author="Alan Perlis" />, container)
  expect(container.querySelector('img')).toBeNull()
})

test('ignores the first request when Strict Mode restarts the effect', async () => {
  const requests = []
  global.fetch = vi.fn(() => new Promise(resolve => requests.push(resolve)))
  render(<StrictMode><AuthorImage author="Alan Perlis" /></StrictMode>, container)
  expect(requests).toHaveLength(2)
  requests[1](imageResponse('current.jpg'))
  await flushRequests()
  requests[0](imageResponse('stale.jpg'))
  await flushRequests()
  expect(container.querySelector('img').getAttribute('src')).toBe('current.jpg')
})
