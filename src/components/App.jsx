import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import './App.css'

import {getAuthorThumbs, checkUser} from '../store/actions'

class App extends Component {
  componentDidMount() {
    this.props.getAuthorThumbs(this.props.allAuthors)
    // this.props.checkUser()
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
const mapDispatchToProps = {getAuthorThumbs, checkUser}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
