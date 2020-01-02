import React from 'react'
import {Switch, Route} from 'react-router-dom'

import AllQuotes from '../routes/AllQuotes'
import Author from '../routes/Author'
import EditQuote from '../routes/EditQuote'
import AddQuote from '../routes/AddQuote'
import ShowQuote from '../routes/ShowQuote'
import RandomQuote from '../routes/RandomQuote'
import Login from '../routes/Login'
import Profile from '../routes/Profile'
import Auth from '../routes/Auth'

const Router = () => (
  <Switch>
    <Route path='/' exact component={RandomQuote} />
    <Route path='/all-quotes' component={AllQuotes} />
    <Route path='/login' component={Login} />
    <Route path='/quote/:id' component={ShowQuote} />
    <Route path='/author/:name' component={Author} />
    <Route path='/add-quote' component={AddQuote} />
    <Route path='/edit-quote/:id' component={EditQuote} />
    <Route path='/profile' component={Profile} />
    <Route path='/auth/:service/:token' component={Auth} />
  </Switch>
)

export default Router
