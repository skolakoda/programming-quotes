import React, {useEffect, useRef} from 'react'
import {connect} from 'react-redux'

import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import './App.css'

import {fetchQuotes, checkUser, getAuthorThumbs} from '../store/actions'
import {useServerData} from '../config/api'

function App({allAuthors, getAuthorThumbs, fetchQuotes, checkUser}) {
  const initialAuthors = useRef(allAuthors)
  useEffect(() => {
    getAuthorThumbs(initialAuthors.current)
    if (useServerData) {
      fetchQuotes()
      checkUser()
    }
  }, [getAuthorThumbs, fetchQuotes, checkUser])

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

const mapStateToProps = ({allAuthors}) => ({allAuthors})
const mapDispatchToProps = {fetchQuotes, checkUser, getAuthorThumbs}

export default connect(mapStateToProps, mapDispatchToProps)(App)
