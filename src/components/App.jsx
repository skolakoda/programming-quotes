import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'
import translate from '../shared/translate'
import {getallImages} from '../shared/helpers'
import {API} from '../config/api'
import {LS} from '../config/localstorage'
import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import AllQuotes from '../routes/AllQuotes'
import Author from '../routes/Author'
import EditQuote from '../routes/EditQuote'
import ShowQuote from '../routes/ShowQuote'
import RandomQuote from '../routes/RandomQuote'
import Login from '../routes/Login'
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
      password: localStorage.getItem(LS.password)
    }
  }

  componentDidMount() {
    this.loadQuotes(API.read)
  }

  loadQuotes(url) {
    const http = new XMLHttpRequest()
    http.open('GET', url)
    http.send()
    http.onload = () => this.initState(JSON.parse(http.responseText))
    http.onerror = () => this.initState(cachedQuotes)
  }

  initState = allQuotes => {
    const allAuthors = new Set(allQuotes.map(quote => quote.autor).sort())
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

  setPassword = password => {
    this.setState({password})
    localStorage.setItem(LS.password, password)
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
            password={this.state.password}
          />

          <Switch>
            <Route path='/add-quote' component={props => (
              <EditQuote {...props} password={this.state.password} />
            )} />
            <Route path='/edit-quote/:id' component={props => (
              <EditQuote {...props} allQuotes={this.state.allQuotes} password={this.state.password} />
            )} />
            <Route path='/quote/:id' component={props => (
              <ShowQuote {...props}
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                allImages={this.state.allImages}
                password={this.state.password} />
            )} />
            <Route path='/login' component={() => (
              <Login setPassword={this.setPassword} />
            )} />
            <Route path='/author/:name' render={props => (
              <Author {...props}
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                allImages={this.state.allImages}
                password={this.state.password}
                phrase={this.state.phrase}
              />
            )} />
            <Route path='/all-quotes' render={() => (
              <AllQuotes
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                phrase={this.state.phrase}
                password={this.state.password}
                setPhrase={this.setPhrase}
              />
            )} />
            <Route path='/' render={() => (
              <RandomQuote
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                allImages={this.state.allImages}
                password={this.state.password}
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
