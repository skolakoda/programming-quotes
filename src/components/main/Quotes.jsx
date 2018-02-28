import React from 'react'
import Quote from './Quote'

const Quotes = ({ language, currentQuotes, password }) => {
  const preparedQuotes = currentQuotes.map(q =>
    <Quote key={q._id} content={q[language]} author={q.autor} rating={q.ocena} id={q._id} password={password} />
  )
  return (
    <div>
      {preparedQuotes}
    </div>
  )
}

export default Quotes
