import React from 'react'
import Quote from './Quote'
import preloader from '../../assets/images/preloader.gif'

const Quotes = ({ language, loaded, currentQuotes, password }) => {
  const preparedQuotes = currentQuotes.map(q =>
    <Quote key={q._id} language={language} quote={q} id={q._id} password={password} />
  )
  return loaded ? preparedQuotes : <img src={preloader} alt="loading..." />
}

export default Quotes
