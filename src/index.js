import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

// import {basename} from './config/router'
import App from './components/App'
import './index.css'

render(
  <Router basename={''}>
    <App />
  </Router>, document.getElementById('root'))

registerServiceWorker()
