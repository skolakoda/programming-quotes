import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import App from './components/App'
import './index.css'

const basename = process.env.NODE_ENV === 'development' ? '' : 'programerski-citati'

render(
  <Router basename={basename}>
    <App />
  </Router>, document.getElementById('root'))

registerServiceWorker()