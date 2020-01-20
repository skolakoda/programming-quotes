import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {LS} from '../config/localstorage'
import {fetchQuotes, checkUser, checkCountry} from '../store/actions'
import Header from './header/Header'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import Footer from './header/Footer'
import './App.css'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchQuotes())
    if (!localStorage.getItem(LS.lang) && !localStorage.getItem(LS.script))
      dispatch(checkCountry())
    dispatch(checkUser())

    if ('serviceWorker' in navigator)
      navigator.serviceWorker.register('service-worker.js')
  }, [dispatch])

  return (
    <div className="App">
      <section className="main-section">
        <Header />
        <Router />
        <Footer />
      </section>
      <Sidebar/>
    </div>
  )
}

export default App
