import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {Simulate} from 'react-dom/test-utils'
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
  unmountComponentAtNode(container)
  global.fetch = originalFetch
  window.innerWidth = originalWidth
})

const flushRequests = () => new Promise(resolve => setTimeout(resolve, 0))
const imageResponse = source => ({
  ok: true,
  json: () => Promise.resolve({query: {pages: {
    1: {thumbnail: {source}}
  }}})
})

test('uses the mobile thumbnail URL returned by Wikipedia without rewriting its size', async () => {
  const source = 'https://example.com/330px-Alan_Perlis.jpg'
  global.fetch = jest.fn(() => Promise.resolve(imageResponse(source)))

  render(<AuthorImage author="Alan Perlis" />, container)
  await flushRequests()

  const request = new URL(global.fetch.mock.calls[0][0])
  expect(request.searchParams.get('pithumbsize')).toBe('320')
  expect(request.searchParams.get('pilicense')).toBe('any')
  expect(request.searchParams.get('redirects')).toBe('1')
  const image = container.querySelector('img')
  expect(image.getAttribute('src')).toBe(source)
  Simulate.load(image)
  expect(image.style.display).toBe('')
})

test('ignores a delayed portrait response for the previous author', async () => {
  const requests = []
  global.fetch = jest.fn(() => new Promise(resolve => requests.push(resolve)))

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
  global.fetch = jest.fn(() => Promise.reject(new Error('Network unavailable')))

  render(<AuthorImage author="Alan Perlis" showUnknown={true} />, container)
  await flushRequests()

  const image = container.querySelector('img')
  expect(image.getAttribute('src')).toBe(unknownImage)
  Simulate.load(image)
  expect(image.style.display).toBe('')
})

test('falls back to the placeholder if the portrait itself fails to load', async () => {
  global.fetch = jest.fn(() => Promise.resolve(imageResponse('perlis.jpg')))

  render(<AuthorImage author="Alan Perlis" showUnknown={true} />, container)
  await flushRequests()
  Simulate.error(container.querySelector('img'))

  expect(container.querySelector('img').getAttribute('src')).toBe(unknownImage)
  Simulate.error(container.querySelector('img'))
  expect(container.querySelector('img')).toBeNull()
})

test('omits the portrait when Wikipedia has no image and no placeholder is requested', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true, json: () => Promise.resolve({query: {pages: {1: {title: 'Unknown author'}}}})
  }))

  render(<AuthorImage author="Unknown author" />, container)
  await flushRequests()

  expect(container.querySelector('img')).toBeNull()
})
