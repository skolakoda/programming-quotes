import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'
import translate from '../shared/translate'
import {API} from '../config/endpoints'
import {LS} from '../config/localstorage'
import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Home from '../routes/Home'
import Author from '../routes/Author'
import EditQuote from '../routes/EditQuote'
import ShowQuote from '../routes/ShowQuote'
import Login from '../routes/Login'
import cachedQuotes from '../data/quotes.json'
import './App.css'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      allQuotes: [],
      allAuthors: new Set(),
      phrase: '',
      language: translate.currentLanguage,
      password: localStorage.getItem(LS.password)
    }
  }

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    const http = new XMLHttpRequest()
    http.open('GET', API.read)
    http.send()
    http.onload = () => this.initData(JSON.parse(http.responseText))
    http.onerror = () => this.initData(cachedQuotes)
  }

  initData = allQuotes => {
    const allAuthors = new Set(allQuotes.map(quote => quote.autor))
    this.setState(() => ({allQuotes, allAuthors}))
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
                password={this.state.password} />
            )} />
            <Route path='/login' component={() => (
              <Login setPassword={this.setPassword} />
            )} />
            <Route path='/author/:name' render={props => (
              <Author {...props}
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                password={this.state.password}
                phrase={this.state.phrase}
              />
            )} />
            <Route path='/' render={() => (
              <Home
                language={this.state.language}
                allQuotes={this.state.allQuotes}
                phrase={this.state.phrase}
                password={this.state.password}
                setPhrase={this.setPhrase}
              />
            )} />
          </Switch>
        </section>

        <Sidebar
          authors={this.state.allAuthors}
          setPhrase={this.setPhrase}
        />
      </div>
    )
  }
}
