import React from 'react'
import translate from '../shared/translate'
import Quotes from '../components/main/Quotes'

const numberOfQuotes = 10

const Main = ({ language, allQuotes, phrase, password }) => {
  const currentQuotes = allQuotes
    .filter(quote => quote[language] && quote[language].toLowerCase().includes(phrase.toLowerCase()))
    .filter((quote, i) => i < numberOfQuotes)
  return (
    <main>
      <h1>{translate('PROGRAMMING_QUOTES')}</h1>
      <Quotes language={language} currentQuotes={currentQuotes} password={password} />
    </main>
  )
}

export default Main
