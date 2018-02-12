import React from 'react'
import Quote from './Quote'
import Picture from './Picture'
import Header from '../header/Header'

const MainContent = ({ language, chosenAuthor, mainImage, currentQuotes }) => {
  const preparedQuotes = currentQuotes
    .filter(q => q[language])
    .map(q => <Quote key={q._id} content={q[language]} author={q.autor} rating={q.ocena} id={q._id} />)

  return (
    <main>
      <Header language={language}/>
      <Picture
        imgSrc={mainImage}
        author={chosenAuthor}
      />
      {preparedQuotes}
    </main>
  )
}
export default MainContent