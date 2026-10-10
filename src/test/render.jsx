import {act} from 'react'
import {createRoot} from 'react-dom/client'

const roots = new WeakMap()

export {act}

export function render(element, container) {
  let root = roots.get(container)
  if (!root) {
    root = createRoot(container)
    roots.set(container, root)
  }
  act(() => root.render(element))
}

export function unmount(container) {
  const root = roots.get(container)
  if (!root) return
  act(() => root.unmount())
  roots.delete(container)
}

export async function flushRequests() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
  })
}
