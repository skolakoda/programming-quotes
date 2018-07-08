import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import {createStore} from 'redux'
import { Provider } from 'react-redux'

import {reducer} from './store/reducer'
import App from './components/App'
import './index.css'

const store = createStore(reducer)

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>, document.getElementById('root')
)
