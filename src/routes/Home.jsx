import React from 'react'
import translate from '../shared/translate'
import Quotes from '../components/main/Quotes'
import preloader from '../assets/images/preloader.gif'

const numberOfQuotes = 10

const Home = ({ language, allQuotes, phrase, password }) => {
  const currentQuotes = allQuotes
    .filter(quote => quote[language] && quote[language].toLowerCase().includes(phrase.toLowerCase()))
    .filter((quote, i) => i < numberOfQuotes)

  return (
    <main>
      <h1>{translate('PROGRAMMING_QUOTES')}</h1>
      {allQuotes.length
        ? <Quotes language={language} currentQuotes={currentQuotes} password={password} />
        : <img src={preloader} alt="loading..." />
      }
    </main>
  )
}

export default Home
