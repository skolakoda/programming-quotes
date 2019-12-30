import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import Header from './header/Header'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import './App.css'

import {fetchQuotes, checkUser} from '../store/actions'

class App extends Component {
  componentDidMount() {
    this.props.fetchQuotes()
    this.props.checkUser()
  }

  render() {
    return (
      <div className="App">
        <section className="main-section">
          <Header />
          <Router />
        </section>
        <Sidebar/>
      </div>
    )
  }
}

const mapDispatchToProps = {fetchQuotes, checkUser}

export default withRouter(connect(null, mapDispatchToProps)(App))
