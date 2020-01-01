import React, {useState} from 'react'

import Quote from './Quote'
import preloader from '../../assets/images/preloader.gif'

const quotesPerPage = 10

export default function Paginated({ loaded, currentQuotes }) {
  const [currentPage, setCurrentPage] = useState(0)

  if (!loaded) return <img src={preloader} alt="loading..." />
  window.scrollTo(0, 0)

  const totalPages = Math.ceil(currentQuotes.length / quotesPerPage)
  const startPosition = currentPage * quotesPerPage

  const mappedQuotes = currentQuotes
    .filter((q, i) => i >= startPosition && i < startPosition + quotesPerPage)
    .map(q =>
      <Quote key={q._id} quote={q} />
    )

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

  const createButton = i => (
    <button
      value={i}
      style={{ color: currentPage === i && 'darkred' }}
      onClick={turnThePage}
      key={i}
    >
      {i + 1}
    </button>
  )

  const range = 3
  const low = currentPage > range ? currentPage - range : 1
  const high = currentPage < totalPages - range ? currentPage + range : totalPages - 1
  const pagination = []
  for (let i = low; i < high; i++) pagination.push(createButton(i))

  return (
    <div>
      {mappedQuotes}
      {totalPages > 1 && (
        <p>
          <button onClick={prev} disabled={currentPage === 0} >‹</button>
          {createButton(0)}
          {currentPage > range + 1 && <span>...</span>}
          {pagination}
          {currentPage < totalPages - range - 1 && <span>...</span>}
          {createButton(totalPages - 1)}
          <button disabled={currentPage === totalPages - 1} onClick={next}>›</button>
        </p>
      )}
    </div>
  )
}
