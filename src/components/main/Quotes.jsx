import React, {useRef, useState} from 'react'

import Quote from './Quote'
import './Quotes.css'

const quotesPerPage = 10

export default function Quotes({currentQuotes}) {
  const [page, setPage] = useState({quotes: currentQuotes, index: 0})
  const list = useRef(null)
  if (page.quotes !== currentQuotes) {
    setPage({quotes: currentQuotes, index: 0})
  }
  const currentPage = page.quotes === currentQuotes ? page.index : 0
  const turnThePage = e => {
    setPage({quotes: currentQuotes, index: Number(e.target.value)})
    if (list.current.getBoundingClientRect().top < 0) list.current.scrollIntoView()
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
      <button value={i} onClick={turnThePage} key={i} aria-current={i === currentPage ? 'page' : undefined}>{i}</button>
    )

  return (
    <div ref={list}>
      {preparedQuotes}
      {totalPages > 1 && <p className="pagination">{pagination}</p>}
    </div>
  )
}
