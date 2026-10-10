import React from 'react'
import {Switch, Route} from 'react-router-dom'

import AllQuotes from '../routes/AllQuotes'
import Author from '../routes/Author'
import EditQuote from '../routes/EditQuote'
import ShowQuote from '../routes/ShowQuote'
import RandomQuote from '../routes/RandomQuote'
import Login from '../routes/Login'
import Profile from '../routes/Profile'
import Auth from '../routes/Auth'
import {useServerData} from '../config/api'

const Router = () => {
  return (
    <Switch>
      <Route exact path='/' component={RandomQuote} />
      <Route path='/all-quotes' component={AllQuotes} />
      {useServerData && <Route path='/login' component={Login} />}
      <Route path='/quote/:id' component={ShowQuote} />
      <Route path='/author/:name' component={Author} />
      {useServerData && <Route path='/add-quote' component={EditQuote} />}
      {useServerData && <Route path='/edit-quote/:id' component={EditQuote} />}
      {useServerData && <Route path='/profile' component={Profile} />}
      {useServerData && <Route path='/auth/:service/:token' component={Auth} />}
    </Switch>
  )
}

export default Router
