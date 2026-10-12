import React, {useEffect, useRef} from 'react'
import {connect} from 'react-redux'

import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import './App.css'

import {getAuthorThumbs} from '../store/actions'
import {findLanguage, saveLanguage} from '../shared/languages'

function App({allAuthors, language, getAuthorThumbs}) {
  const initialAuthors = useRef(allAuthors)
  useEffect(() => {
    getAuthorThumbs(initialAuthors.current)
  }, [getAuthorThumbs])
  useEffect(() => {
    saveLanguage(language)
    document.documentElement.lang = findLanguage(language).ui
  }, [language])

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

const mapStateToProps = ({allAuthors, language}) => ({allAuthors, language})
const mapDispatchToProps = {getAuthorThumbs}

export default connect(mapStateToProps, mapDispatchToProps)(App)
