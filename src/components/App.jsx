import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {getallImages, checkToken} from '../shared/helpers'
import {API, domain} from '../config/api'
import {LS} from '../config/localstorage'
import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'

import cachedQuotes from '../data/quotes.json'
import './App.css'

import {setAllQuotes, setAllAuthors, setAllImages, setUser} from '../store/actions'

class App extends Component {
  componentDidMount() {
    this.initState(cachedQuotes)
    this.loadQuotes(API.read)
    if (this.props.token) this.checkToken()
  }

  checkToken() {
    const service = localStorage.getItem(LS.service)
    const token = this.props.token
    checkToken(`${domain}/auth/${service}/${token}`, token, this.props.setUser)
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

  render() {
    return (
      <div className="App">
        <section className="right-section">
          <Navigation />
          <Router />
        </section>
        <Sidebar/>
      </div>
    )
  }
}

const mapDispatchToProps = {setAllQuotes, setAllAuthors, setAllImages, setUser}

export default withRouter(connect(null, mapDispatchToProps)(App))