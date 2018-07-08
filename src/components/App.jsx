import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import cachedQuotes from '../data/quotes.json'
import './App.css'

import {fetchQuotes, initState, checkUser} from '../store/actions'

class App extends Component {
  componentDidMount() {
    this.props.initState(cachedQuotes)  // pomeriti u reducer
    this.props.fetchQuotes()
    this.props.checkUser()
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

const mapDispatchToProps = {fetchQuotes, initState, checkUser}

export default withRouter(connect(null, mapDispatchToProps)(App))
