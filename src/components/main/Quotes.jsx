import React from 'react'
import Quote from './Quote'
import preloader from '../../assets/images/preloader.gif'

const Quotes = ({ language, loaded, currentQuotes, password }) => {
  const preparedQuotes = currentQuotes.map(q =>
    <Quote key={q._id} content={q[language]} author={q.autor} rating={q.ocena} id={q._id} password={password} />
  )
  return (
    <div>
      { loaded ? preparedQuotes : <img src={preloader} alt="loading..." /> }
    </div>
  )
}

export default Quotes
