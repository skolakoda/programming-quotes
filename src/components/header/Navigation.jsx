import React, {Component} from 'react'
import Github from './Github'
import {Link} from 'react-router-dom'
import {store} from '../../state/reducer'
import {setLanguage} from '../../state/actions'
import translate from '../../shared/translate'
import './Navigation.css'

class Navigation extends Component {
  constructor() {
    super()
    store.subscribe(this.render.bind(this))
  }

  render() {
    // trenutno css klasa ne reaguje na promenu!
    const {language, token, admin} = store.getState()
    const srStyle = language === 'sr' ? 'active' : ''
    console.log(language, language === 'sr', srStyle)

    return (
      <header>
        <Github repoUrl="https://github.com/skolakoda/programming-quotes" />
        <nav>
          <Link to="/" replace={true}>{translate('DAILY_QUOTE')}</Link>
          <Link to="/all-quotes">{translate('ALL_QUOTES')}</Link>
          {admin && <Link to="/add-quote">{translate('ADD_QUOTE')}</Link>}
          {token
            ? <Link to="/profile">{translate('PROFILE')}</Link>
            : <Link to="/login">{translate('LOGIN')}</Link>
          }
          <div>
            <button
              onClick={() => store.dispatch(setLanguage('en'))}
              className={language === 'en' ? 'active' : ''}>ENG</button>
            <button
              onClick={() => store.dispatch(setLanguage('sr'))}
              className={srStyle}>SRB</button>
          </div>
        </nav>
      </header>
    )
  }
}

export default Navigation
