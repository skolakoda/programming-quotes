import React from 'react'
import Quotes from '../components/main/Quotes'

const Home = ({ language, currentQuotes }) => (
  <main>
    <Quotes language={language} currentQuotes={currentQuotes} />
  </main>
)

export default Home
