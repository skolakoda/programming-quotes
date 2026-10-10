import {vi} from 'vitest'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {act, render, unmount, flushRequests} from '../test/render'
import Profile from './Profile'
import {reducer} from '../store/reducer'
import {setUser} from '../store/actions'
import {LS} from '../config/localstorage'

const dataMode = vi.hoisted(() => ({useServerData: true}))
vi.mock('../config/api', async importOriginal => ({
  ...await importOriginal(),
  get useServerData() { return dataMode.useServerData }
}))

let container
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
  dataMode.useServerData = true
  localStorage.setItem(LS.token, 'saved-token')
  localStorage.setItem(LS.service, 'github')
  vi.stubGlobal('fetch', vi.fn())
})
afterEach(() => {
  unmount(container)
  container.remove()
  localStorage.clear()
  vi.unstubAllGlobals()
})
function mount() {
  const store = createStore(reducer, {...reducer(undefined, {}), token: 'saved-token'}, applyMiddleware(thunk))
  render(<Provider store={store}><Profile /></Provider>, container)
  return store
}
const userResponse = (name = 'Test user', memberSince = '2020-01-02') => ({
  ok: true, json: async () => ({user: {name, memberSince, admin: true}})
})

test('loads the profile, updates privileges, and logs out', async () => {
  fetch.mockResolvedValue(userResponse())
  const store = mount()
  await flushRequests()
  expect(container.textContent).toContain('Test user')
  expect(container.textContent).toContain('2020-01-02')
  expect(store.getState().admin).toBe(true)
  act(() => container.querySelector('button').click())
  expect(store.getState().token).toBe('')
  expect(store.getState().admin).toBe(false)
  expect(localStorage.getItem(LS.token)).toBe('')
  expect(container.textContent).toContain('successfully logged out')
})

test('a delayed profile response cannot restore a logged-out account', async () => {
  let finish
  fetch.mockReturnValue(new Promise(resolve => { finish = resolve }))
  const store = mount()
  act(() => container.querySelector('button').click())
  finish(userResponse())
  await flushRequests()
  expect(store.getState().token).toBe('')
  expect(store.getState().admin).toBe(false)
  expect(container.textContent).not.toContain('Test user')
})

test('a previous account response cannot replace the current account', async () => {
  const requests = []
  fetch.mockImplementation(() => new Promise(resolve => requests.push(resolve)))
  const store = mount()
  act(() => store.dispatch(setUser('new-token')))
  requests[1](userResponse('New user'))
  await flushRequests()
  requests[0](userResponse('Old user'))
  await flushRequests()
  expect(store.getState().token).toBe('new-token')
  expect(container.textContent).toContain('New user')
  expect(container.textContent).not.toContain('Old user')
})

test.each([
  {ok: false, status: 503},
  {ok: true, json: async () => ({})}
])('profile failures show a message without restoring privileges', async response => {
  fetch.mockResolvedValue(response)
  mount()
  await flushRequests()
  expect(container.textContent).toContain('Problem with network')
})

test('invalid membership dates do not crash the profile', async () => {
  fetch.mockResolvedValue(userResponse('Test user', 'invalid-date'))
  mount()
  await flushRequests()
  expect(container.textContent).toContain('Test user')
  expect(container.textContent).not.toContain('Invalid Date')
})

test('local mode does not load the profile from the backend', () => {
  dataMode.useServerData = false
  mount()
  expect(fetch).not.toHaveBeenCalled()
})
