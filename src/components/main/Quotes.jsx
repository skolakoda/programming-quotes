import React, {useState} from 'react'

import Quote from './Quote'
import preloader from '../../assets/images/preloader.gif'

const quotesPerPage = 10

export default function Quotes({ loaded, currentQuotes }) {
  const [currentPage, setCurrentPage] = useState(0)

  if (!loaded) return <img src={preloader} alt="loading..." />

  const turnThePage = e => {
    setCurrentPage(Number(e.target.value))
    window.scrollTo(0, 0)
  }

  const startPosition = currentPage * quotesPerPage
  const preparedQuotes = currentQuotes
    .filter((q, i) => i >= startPosition && i < startPosition + quotesPerPage)
    .map(q =>
      <Quote key={q._id} quote={q} />
    )
  const pagination = []
  const totalPages = Math.ceil(currentQuotes.length / quotesPerPage)

  for (let i = 0; i < totalPages; i++)
    pagination.push(
      <button
        value={i}
        style={{ color: currentPage === i && 'darkred' }}
        onClick={turnThePage}
        key={i}
      >
        {i + 1}
      </button>
    )

  return (
    <div>
      {preparedQuotes}
      {totalPages > 1 && <p>{pagination}</p>}
    </div>
  )
}
