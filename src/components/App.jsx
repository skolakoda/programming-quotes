import React, {Component} from 'react'
import {connect} from 'react-redux'

import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import './App.css'

import {fetchQuotes, checkUser, getAuthorThumbs} from '../store/actions'
import {useServerData} from '../config/api'

class App extends Component {
  componentDidMount() {
    this.props.getAuthorThumbs(this.props.allAuthors)
    if (useServerData) {
      this.props.fetchQuotes()
      this.props.checkUser()
    }
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

const mapStateToProps = ({allAuthors}) => ({allAuthors})
const mapDispatchToProps = {fetchQuotes, checkUser, getAuthorThumbs}

export default connect(mapStateToProps, mapDispatchToProps)(App)
