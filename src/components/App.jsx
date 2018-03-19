import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'
import translate from '../shared/translate'
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

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      allQuotes: [],
      allAuthors: new Set(),
      allImages: new Map(),
      phrase: '',
      language: translate.currentLanguage,
      token: localStorage.getItem(LS.token),
      admin: false
    }
  }

  componentDidMount() {
    this.loadQuotes(API.read)
    if (this.state.token) this.checkToken()
  }

  checkToken() {
    const service = localStorage.getItem(LS.service)
    const token = this.state.token
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
    const allAuthors = new Set(allQuotes.map(quote => quote.author).sort())
    this.setState(() => ({allQuotes, allAuthors}))
    this.getAuthorThumbs(allAuthors)
  }

  getAuthorThumbs(allAuthors) {
    const wikiApiLimit = 50
    const promises = []
    for (let i = 0; i < [...allAuthors].length; i += wikiApiLimit)
      promises.push(getallImages([...allAuthors].slice(i, i + wikiApiLimit)))
    Promise.all(promises).then(data =>
      this.setState({ allImages: data.reduce((a, b) => new Map([...a, ...b])) })
    )
  }

  setPhrase = phrase => {
    this.setState({phrase})
  }

  setUser = (token, admin = false) => {
    this.setState({token, admin})
  }

  setLang = language => {
    this.setState({language})
    translate.setLanguage(language)
  }

  render() {
    return (
      <div className="App">
        <section className="right-section">
          <Navigation
            language={this.state.language}
            setLang={this.setLang}
            token={this.state.token}
            admin={this.state.admin}
          />

          <Switch>
            <Route path='/add-quote' component={props => (
              <EditQuote
                {...props}
                token={this.state.token}
                admin={this.state.admin}
              />
            )} />
            <Route path='/edit-quote/:id' component={props => (
              <EditQuote
                {...props}
                allQuotes={this.state.allQuotes}
                token={this.state.token}
                admin={this.state.admin}
              />
            )} />
            <Route path='/quote/:id' component={props => (
              <ShowQuote {...props}
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                allImages={this.state.allImages}
                token={this.state.token}
                admin={this.state.admin}
              />
            )} />
            <Route path='/login' component={() => (
              <Login/>
            )} />
            <Route path='/profile' component={() => (
              <Profile setUser={this.setUser} />
            )} />
            <Route path='/auth/:service/:token' render={props => (
              <Auth {...props} setUser={this.setUser} />
            )} />
            <Route path='/author/:name' render={props => (
              <Author {...props}
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                allImages={this.state.allImages}
                token={this.state.token}
                phrase={this.state.phrase}
                admin={this.state.admin}
              />
            )} />
            <Route path='/all-quotes' render={() => (
              <AllQuotes
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                phrase={this.state.phrase}
                token={this.state.token}
                setPhrase={this.setPhrase}
                admin={this.state.admin}
              />
            )} />
            <Route path='/' render={() => (
              <RandomQuote
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                allImages={this.state.allImages}
                token={this.state.token}
                admin={this.state.admin}
              />
            )} />
          </Switch>
        </section>

        <Sidebar
          authors={this.state.allAuthors}
          allImages={this.state.allImages}
          setPhrase={this.setPhrase}
        />
      </div>
    )
  }
}
