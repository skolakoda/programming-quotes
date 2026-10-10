import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import App from './App'
import {reducer} from '../store/reducer'

jest.mock('./Router', () => () => null)
jest.mock('./header/Navigation', () => () => null)

test('loads sidebar portraits from cached authors when the quotes server is unavailable', async () => {
  const originalFetch = global.fetch
  const container = document.createElement('div')
  const store = createStore(reducer, applyMiddleware(thunk))
  const cachedQuotes = store.getState().allQuotes
  const portrait = 'https://example.com/alan-kay.jpg'
  global.fetch = jest.fn(url => Promise.resolve(url.includes('prop=pageimages')
    ? {ok: true, json: () => Promise.resolve({query: {pages: {
      1: {title: 'Alan Kay', thumbnail: {source: portrait}}
    }}})}
    : {ok: false, status: 404}))

  try {
    render(
      <Provider store={store}>
        <MemoryRouter><App /></MemoryRouter>
      </Provider>, container
    )
    await new Promise(resolve => setTimeout(resolve, 0))

    const author = container.querySelector('a[href="/author/Alan_Kay"]')
    expect(author.querySelector('img').getAttribute('src')).toBe(portrait)
    expect(store.getState().allQuotes).toBe(cachedQuotes)
    expect(store.getState().isFetching).toBe(false)
    expect(store.getState().error).toContain('404')
  } finally {
    unmountComponentAtNode(container)
    global.fetch = originalFetch
  }
})
