import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {fetchQuotes, checkUser} from '../store/actions'
import Header from './header/Header'
import Sidebar from './sidebar/Sidebar'
import Router from './Router'
import './App.css'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchQuotes())
    dispatch(checkUser())
    if ('serviceWorker' in navigator)
      navigator.serviceWorker.register('service-worker.js')
  }, [dispatch])

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

export default App