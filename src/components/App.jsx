import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'

import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Main from '../routes/Main'
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
      currentQuotes: [],
      allAuthors: new Set(),
      filteredAuthors: [],
      authorImages: new Map(),
      quoteLanguage: '',
      chosenAuthor: '',
      mainImage:'',
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
    http.onload = () => this.prepareData(JSON.parse(http.responseText))
    http.onerror = () => this.prepareData(cachedQuotes)
  }

  prepareData = data => {
    const allQuotes = data.sort(() => .5 - Math.random())
    const currentQuotes = allQuotes.filter(q => Math.random() > .9)
    const allAuthors = new Set(allQuotes.map(quote => quote.autor))
    this.setState(() => ({allQuotes, currentQuotes, allAuthors, filteredAuthors: [...allAuthors]}))
    for (const author of allAuthors) this.fetchThumbnail(author)
  }

  filterQuotes = () => {
    const lang = this.state.quoteLanguage
    const currentQuotes = this.state.allQuotes.filter(quote =>
      (quote.autor === this.state.chosenAuthor || this.state.chosenAuthor === '')
      && quote[lang] && quote[lang].toLowerCase().includes(this.state.phrase.toLowerCase())
    )
    this.setState({currentQuotes})
  }

  fetchThumbnail(author) {
    fetchImage(author, '50', imgSrc => {
      const authorImages = this.state.authorImages.set(author, imgSrc)
      this.setState({authorImages})
    })
  }

  setAuthor = chosenAuthor => {
    this.setState({chosenAuthor, mainImage: ''}, this.filterQuotes)
    if (chosenAuthor)
      fetchImage(chosenAuthor, '250', imgSrc => this.setState({mainImage: imgSrc}))
  }

  filterAuthors = text => {
    const filteredAuthors = [...this.state.allAuthors].filter(
      name => name.toLowerCase().includes(text.toLowerCase())
    )
    this.setState({mainImage: '', filteredAuthors})
  }

  setPhrase = e => {
    this.setState({phrase:e.target.value}, this.filterQuotes)
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
            <Route path='/' render={() => (
              <Main
                language={this.state.quoteLanguage}
                mainImage={this.state.mainImage}
                chosenAuthor={this.state.chosenAuthor}
                currentQuotes={this.state.currentQuotes}
                password={this.state.password}
              />
            )} />
          </Switch>
        </section>
        <Sidebar
          authors={this.state.filteredAuthors}
          authorImages={this.state.authorImages}
          setAuthor={this.setAuthor}
          setPhrase={this.setPhrase}
          filterAuthors={this.filterAuthors}
        />
      </div>
    )
  }
}

export default App
