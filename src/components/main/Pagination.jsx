import React from 'react'

export default function Pagination({totalPages, page, setPage}) {
  if (page >= totalPages) setPage(0)

  const turnThePage = e => {
    setPage(Number(e.target.value))
  }

  const prev = () => {
    if (page <= 0) return
    setPage(page - 1)
  }

  const next = () => {
    if (page >= totalPages - 1) return
    setPage(page + 1)
  }

  const button = i => (
    <button value={i} className={page === i ? 'red' : ''} onClick={turnThePage} key={i}>
      {i + 1}
    </button>
  )

  const range = 3
  const low = page > range ? page - range : 1
  const high = page < totalPages - range ? page + range : totalPages - 1
  const pagination = []
  for (let i = low; i < high; i++) pagination.push(button(i))

  return (
    <p>
      <button onClick={prev} disabled={page === 0} >‹</button>
      {button(0)}
      {page > range + 1 && <span>...</span>}
      {pagination}
      {page < totalPages - range - 1 && <span>...</span>}
      {button(totalPages - 1)}
      <button disabled={page === totalPages - 1} onClick={next}>›</button>
    </p>
  )
}
