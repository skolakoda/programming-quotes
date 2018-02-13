import React from 'react'
import Quote from './Quote'

const Quotes = ({ language, currentQuotes }) => {
  const preparedQuotes = currentQuotes
    .filter(q => q[language])
    .map(q => <Quote key={q._id} content={q[language]} author={q.autor} rating={q.ocena} id={q._id} />)

  return (
    <div>
      {preparedQuotes}
    </div>
  )
}

export default Quotes
