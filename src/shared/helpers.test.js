import {vi} from 'vitest'
import {displayName, getallImages} from './helpers'
import {getAuthorThumbs} from '../store/actions'

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

test('matches normalized and redirected Wikipedia titles to the original author names', async () => {
  global.fetch = vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({query: {
      normalized: [{from: 'edsger_W._Dijkstra', to: 'Edsger W. Dijkstra'}],
      redirects: [{from: 'Edsger W. Dijkstra', to: 'Edsger Dijkstra'}],
      pages: {
        1: {title: 'Edsger Dijkstra', thumbnail: {source: 'dijkstra.jpg'}},
        2: {title: 'Alan Kay', thumbnail: {source: 'kay.jpg'}},
        3: {title: 'Unknown author', missing: ''}
      }
    }})
  }))

  const authors = ['edsger_W._Dijkstra', 'Alan Kay', 'Unknown author', 'A & B']
  const images = await getallImages(authors)

  expect(images.get(authors[0])).toBe('dijkstra.jpg')
  expect(images.get('Alan Kay')).toBe('kay.jpg')
  expect(images.has('Unknown author')).toBe(false)
  const url = new URL(global.fetch.mock.calls[0][0])
  expect(url.searchParams.get('titles')).toBe(authors.join('|'))
  expect(url.searchParams.get('redirects')).toBe('1')
})

test('keeps successful image batches when another Wikipedia request fails', async () => {
  const authors = Array.from({length: 51}, (_, i) => `Author ${i}`)
  global.fetch = vi.fn()
    .mockRejectedValueOnce(new Error('Network unavailable'))
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({query: {pages: {
        1: {title: authors[50], thumbnail: {source: 'portrait.jpg'}}
      }}})
    })
  const dispatch = vi.fn()

  await getAuthorThumbs(new Set(authors))(dispatch)

  expect(dispatch).toHaveBeenCalledWith({
    type: 'SET_ALL_IMAGES',
    allImages: new Map([[authors[50], 'portrait.jpg']])
  })
})

test('handles an empty list of authors', async () => {
  global.fetch = vi.fn()
  const dispatch = vi.fn()

  await getAuthorThumbs(new Set())(dispatch)

  expect(global.fetch).not.toHaveBeenCalled()
  expect(dispatch).toHaveBeenCalledWith({type: 'SET_ALL_IMAGES', allImages: new Map()})
})

test('display names drop the Wikipedia disambiguation but keep other parentheses', () => {
  expect(displayName('Paul Graham (programmer)')).toBe('Paul Graham')
  expect(displayName('Alan Kay')).toBe('Alan Kay')
  expect(displayName('Edsger (W.) Dijkstra')).toBe('Edsger (W.) Dijkstra')
})
