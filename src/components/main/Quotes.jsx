import React, {useState} from 'react'

import Quote from './Quote'
import preloader from '../../assets/images/preloader.gif'

const quotesPerPage = 10

export default function Quotes({loaded, currentQuotes}) {
  const [page, setPage] = useState({quotes: currentQuotes, index: 0})
  if (page.quotes !== currentQuotes) {
    setPage({quotes: currentQuotes, index: 0})
  }
  const currentPage = page.quotes === currentQuotes ? page.index : 0
  const turnThePage = e => setPage({quotes: currentQuotes, index: Number(e.target.value)})
  const startPosition = currentPage * quotesPerPage
  const preparedQuotes = currentQuotes
    .filter((q, i) => i >= startPosition && i < startPosition + quotesPerPage)
    .map(q =>
      <Quote key={q._id} quote={q} />
    )
  const pagination = []
  const totalPages = Math.ceil(currentQuotes.length / quotesPerPage)
  for (let i = 0; i < totalPages; i++)
    pagination.push(<button value={i} onClick={turnThePage} key={i}>{i}</button>)

  return loaded ?
    (
      <div>
        {preparedQuotes}
        {totalPages > 1 && <p>{pagination}</p>}
      </div>
    )
    : <img src={preloader} alt="loading..." />
}
