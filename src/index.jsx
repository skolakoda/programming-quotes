import React from 'react'
import {createRoot} from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import {store} from './store'
import App from './components/App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
)
