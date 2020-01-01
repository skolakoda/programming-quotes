import React from 'react'

export default function Pagination({totalPages, current, setCurrent}) {

  const turnThePage = e => {
    setCurrent(Number(e.target.value))
  }

  const prev = () => {
    if (current <= 0) return
    setCurrent(current - 1)
  }

  const next = () => {
    if (current >= totalPages - 1) return
    setCurrent(current + 1)
  }

  const button = i => (
    <button value={i} className={current === i ? 'red' : ''} onClick={turnThePage} key={i}>
      {i + 1}
    </button>
  )

  const range = 3
  const low = current > range ? current - range : 1
  const high = current < totalPages - range ? current + range : totalPages - 1
  const pagination = []
  for (let i = low; i < high; i++) pagination.push(button(i))

  return (
    <p>
      <button onClick={prev} disabled={current === 0} >‹</button>
      {button(0)}
      {current > range + 1 && <span>...</span>}
      {pagination}
      {current < totalPages - range - 1 && <span>...</span>}
      {button(totalPages - 1)}
      <button disabled={current === totalPages - 1} onClick={next}>›</button>
    </p>
  )
}
