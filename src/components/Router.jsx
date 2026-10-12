import React from 'react'
import {Routes, Route} from 'react-router'

import AllQuotes from '../routes/AllQuotes'
import Author from '../routes/Author'
import EditQuote from '../routes/EditQuote'
import ShowQuote from '../routes/ShowQuote'
import RandomQuote from '../routes/RandomQuote'
import Statistics from '../routes/Statistics'
import Login from '../routes/Login'
import Profile from '../routes/Profile'
import Auth from '../routes/Auth'
import {useServerData} from '../config/api'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<RandomQuote />} />
      <Route path='/all-quotes' element={<AllQuotes />} />
      {useServerData && <Route path='/login' element={<Login />} />}
      <Route path='/quote/:id' element={<ShowQuote />} />
      <Route path='/author/:name' element={<Author />} />
      <Route path='/statistics' element={<Statistics />} />
      {useServerData && <Route path='/add-quote' element={<EditQuote />} />}
      {useServerData && <Route path='/edit-quote/:id' element={<EditQuote />} />}
      {useServerData && <Route path='/profile' element={<Profile />} />}
      {useServerData && <Route path='/auth/:service/:token' element={<Auth />} />}
      <Route path='*' element={null} />
    </Routes>
  )
}

export default Router
