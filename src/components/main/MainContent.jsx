import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../../routes/Home'
import AddQuote from '../../routes/AddQuote'
import EditQuote from '../../routes/EditQuote'
import ShowQuote from '../../routes/ShowQuote'
import ShowAuthor from '../../routes/ShowAuthor'
import Login from '../../routes/Login'

const MainContent = ({ language, chosenAuthor, mainImage, currentQuotes }) => {

  return (
    <main>
      <Switch>
        <Route path='/quote/:id' component={ShowQuote}/>
        <Route path='/author/:id' component={ShowAuthor}/>
        <Route path='/add-quote' component={AddQuote}/>
        <Route path='/edit-quote/:id' component={EditQuote}/>
        <Route path='/login' component={Login}/>
        <Route path='/' render={(routeProps) => (
          <Home imgSrc={mainImage} author={chosenAuthor} language={language} currentQuotes={currentQuotes} />
        )} />
      </Switch>
    </main>
  )
}

export default MainContent
