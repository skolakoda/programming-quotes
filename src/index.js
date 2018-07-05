import React from 'react'
import { render } from 'react-dom'
// import { HashRouter as Router } from 'react-router-dom'
import {createStore} from 'redux'
import { Provider } from 'react-redux'

import {reducer} from './store'
import App from './components/App'
import './index.css'

const store = createStore(reducer)
// console.log(store)

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
)
