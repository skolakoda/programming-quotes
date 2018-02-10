import React from 'react'
import Quotes from '../components/main/Quotes'
import Picture from '../components/main/Picture'

const Home = ({ language, chosenAuthor, mainImage, currentQuotes }) => {

  return (
    <div>
      <Picture imgSrc={mainImage} author={chosenAuthor} />
      <Quotes language={language} currentQuotes={currentQuotes} />
    </div>
  )
}

export default Home
