import React from 'react'
import translate from '../shared/translate'
import Quotes from '../components/main/Quotes'

const Main = ({ language, currentQuotes, password }) => {
  return (
    <main>
      <h1>{translate('PROGRAMMING_QUOTES')}</h1>
      <Quotes language={language} currentQuotes={currentQuotes} password={password} />
    </main>
  )
}

export default Main
