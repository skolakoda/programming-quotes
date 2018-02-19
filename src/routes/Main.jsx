import React from 'react'
import translate from '../shared/translate'
import Quotes from '../components/main/Quotes'
import Picture from '../components/main/Picture'

const Main = ({ language, chosenAuthor, mainImage, currentQuotes, password }) => {
  return (
    <main>
      <h1>{translate('PROGRAMMING_QUOTES')}</h1>
      <Picture imgSrc={mainImage} author={chosenAuthor} />
      <Quotes language={language} currentQuotes={currentQuotes} password={password} />
    </main>
  )
}

export default Main
