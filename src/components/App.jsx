import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'
import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Main from '../routes/Main'
import Author from '../routes/Author'
import AddQuote from '../routes/AddQuote'
import Login from '../routes/Login'
import {fetchImage} from '../shared/helpers'
import translate from '../shared/translate'
import * as api from '../config/endpoints'
import './App.css'
const cachedQuotes = require('../data/quotes.json')

class App extends Component {
  constructor() {
    super()
    this.state = {
      allQuotes: [],
      allAuthors: new Set(),
      filteredAuthors: [],
      authorImages: new Map(),
      quoteLanguage: '',
      phrase: '',
      password: ''
    }
  }

  componentDidMount() {
    this.setState({quoteLanguage: translate.currentLanguage})
    const password = localStorage.programerskiCitatiPassword
    if (password) this.setState({password})

    const http = new XMLHttpRequest()
    http.open('GET', api.read)
    http.send()
    http.onload = () => this.initData(JSON.parse(http.responseText))
    http.onerror = () => this.initData(cachedQuotes)
  }

  initData = allQuotes => {
    const allAuthors = new Set(allQuotes.map(quote => quote.autor))
    this.setState(() => ({allQuotes, allAuthors, filteredAuthors: [...allAuthors]}))
    for (const author of allAuthors) this.fetchThumbnail(author)
  }

  fetchThumbnail(authorName) {
    fetchImage(authorName, '50', (src) => {
      const authorImages = this.state.authorImages.set(authorName, src)
      this.setState({authorImages})
    })
  }

  filterAuthors = text => {
    const filteredAuthors = [...this.state.allAuthors].filter(
      name => name.toLowerCase().includes(text.toLowerCase())
    )
    this.setState({filteredAuthors})
  }

  setPhrase = e => {
    this.setState({phrase:e.target.value})
  }

  setPassword = e => {
    e.preventDefault()
    const password = e.target.elements.password.value
    this.setState({password})
    localStorage.programerskiCitatiPassword = password
  }

  setLang = language => {
    this.setState({quoteLanguage: language})
    translate.setLanguage(language)
  }

  render() {
    return (
      <div className="App">
        <section className="right-section">
          <Navigation setLang={this.setLang} password={this.state.password} />
          <Switch>
            <Route path='/add-quote' component={props => (
              <AddQuote {...props} password={this.state.password} />
            )} />
            <Route path='/edit-quote/:id' component={props => (
              <AddQuote {...props} allQuotes={this.state.allQuotes} password={this.state.password} />
            )} />
            <Route path='/login' component={() => (
              <Login setPassword={this.setPassword} />
            )} />
            <Route path='/author/:name' render={props => (
              <Author {...props}
                language={this.state.quoteLanguage}
                allQuotes={this.state.allQuotes}
                password={this.state.password}
              />
            )} />
            <Route path='/' render={() => (
              <Main
                language={this.state.quoteLanguage}
                allQuotes={this.state.allQuotes}
                phrase={this.state.phrase}
                password={this.state.password}
              />
            )} />
          </Switch>
        </section>
        <Sidebar
          authors={this.state.filteredAuthors}
          authorImages={this.state.authorImages}
          setPhrase={this.setPhrase}
          filterAuthors={this.filterAuthors}
        />
      </div>
    )
  }
}

export default App
