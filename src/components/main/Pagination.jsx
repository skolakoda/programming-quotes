import React from 'react'

export default function Paginated({totalPages, currentPage, setCurrentPage}) {

  const turnThePage = e => {
    setCurrentPage(Number(e.target.value))
  }

  const prev = () => {
    if (currentPage <= 0) return
    setCurrentPage(currentPage - 1)
  }

  const next = () => {
    if (currentPage >= totalPages - 1) return
    setCurrentPage(currentPage + 1)
  }

  const button = i => (
    <button value={i} className={currentPage === i ? 'red' : ''} onClick={turnThePage} key={i}>
      {i + 1}
    </button>
  )

  const range = 3
  const low = currentPage > range ? currentPage - range : 1
  const high = currentPage < totalPages - range ? currentPage + range : totalPages - 1
  const pagination = []
  for (let i = low; i < high; i++) pagination.push(button(i))

  return (
    <p>
      <button onClick={prev} disabled={currentPage === 0} >‹</button>
      {button(0)}
      {currentPage > range + 1 && <span>...</span>}
      {pagination}
      {currentPage < totalPages - range - 1 && <span>...</span>}
      {button(totalPages - 1)}
      <button disabled={currentPage === totalPages - 1} onClick={next}>›</button>
    </p>
  )
}
