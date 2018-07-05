import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'

import {getallImages, checkToken} from '../shared/helpers'
import {API, domain} from '../config/api'
import {LS} from '../config/localstorage'
import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import AllQuotes from '../routes/AllQuotes'
import Author from '../routes/Author'
import EditQuote from '../routes/EditQuote'
import ShowQuote from '../routes/ShowQuote'
import RandomQuote from '../routes/RandomQuote'
import Login from '../routes/Login'
import Profile from '../routes/Profile'
import Auth from '../routes/Auth'
import cachedQuotes from '../data/quotes.json'
import './App.css'

import {setAllQuotes, setAllAuthors, setAllImages, setToken, setAdmin} from '../store'

class App extends Component {
  componentDidMount() {
    this.initState(cachedQuotes)
    this.loadQuotes(API.read)
    if (this.props.token) this.checkToken()
  }

  checkToken() {
    const service = localStorage.getItem(LS.service)
    const token = this.props.token
    checkToken(`${domain}/auth/${service}/${token}`, token, this.setUser)
  }

  loadQuotes(url) {
    const http = new XMLHttpRequest()
    http.open('GET', url)
    http.send()
    http.onload = () => {
      const dbQuotes = JSON.parse(http.responseText)
      this.initState(dbQuotes.length ? dbQuotes : cachedQuotes)
    }
    http.onerror = () => this.initState(cachedQuotes)
  }

  initState = allQuotes => {
    this.props.setAllQuotes(allQuotes)
    const allAuthors = new Set(allQuotes.map(quote => quote.author).sort())
    this.props.setAllAuthors(allAuthors)
    this.getAuthorThumbs(allAuthors)
  }

  getAuthorThumbs(allAuthors) {
    const wikiApiLimit = 50
    const promises = []
    for (let i = 0; i < [...allAuthors].length; i += wikiApiLimit)
      promises.push(getallImages([...allAuthors].slice(i, i + wikiApiLimit)))
    Promise.all(promises).then(data =>
      this.props.setAllImages(data.reduce((a, b) => new Map([...a, ...b])))
    )
  }

  setUser = (token, admin = false) => {
    this.props.setToken(token)
    this.props.setAdmin(admin)
  }

  render() {
    return (
      <div className="App">
        <section className="right-section">
          <Navigation />

          <Route path='/add-quote' component={props => <EditQuote {...props} />} />
          <Route path='/edit-quote/:id' component={props => <EditQuote {...props} />} />
          <Route path='/quote/:id' component={props => <ShowQuote {...props} />} />
          <Route path='/login' component={Login} />
          <Route path='/profile' component={() => <Profile setUser={this.setUser} />} />
          <Route path='/auth/:service/:token' component={props => <Auth {...props} setUser={this.setUser} />} />
          <Route path='/author/:name' component={props => <Author {...props} />} />
          <Route path='/all-quotes' component={AllQuotes} />
          <Route exact path='/' component={RandomQuote} />
        </section>

        <Sidebar/>
      </div>
    )
  }
}

const mapDispatchToProps = {setAllQuotes, setAllAuthors, setAllImages, setToken, setAdmin}

export default connect(null, mapDispatchToProps)(App)