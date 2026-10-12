import React from 'react'
import {Routes, Route} from 'react-router'

import AllQuotes from '../routes/AllQuotes'
import Author from '../routes/Author'
import ShowQuote from '../routes/ShowQuote'
import RandomQuote from '../routes/RandomQuote'
import Statistics from '../routes/Statistics'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<RandomQuote />} />
      <Route path='/all-quotes' element={<AllQuotes />} />
      <Route path='/quote/:id' element={<ShowQuote />} />
      <Route path='/author/:name' element={<Author />} />
      <Route path='/statistics' element={<Statistics />} />
      <Route path='*' element={null} />
    </Routes>
  )
}

export default Router
