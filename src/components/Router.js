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
import Untranslated from '../routes/Untranslated'

const Router = () => (
  <Switch>
    <Route path='/' exact component={RandomQuote} />
    <Route path='/citati' component={AllQuotes} />
    <Route path='/prijava' component={Login} />
    <Route path='/citat/:id' component={ShowQuote} />
    <Route path='/autor/:name' component={Author} />
    <Route path='/dodaj-citat' component={AddQuote} />
    <Route path='/neprevedeno' component={Untranslated} />
    <Route path='/edituj-citat/:id' component={EditQuote} />
    <Route path='/moj-profil' component={Profile} />
    <Route path='/auth/:service/:token' component={Auth} />
  </Switch>
)

export default Router
