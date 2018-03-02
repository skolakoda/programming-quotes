import React from 'react'
import Github from './Github'
import {Link} from 'react-router-dom'
import translate from '../../shared/translate'
import './Navigation.css'

const Navigation = ({language, setLang, password}) => {
  return (
    <header>
      <Github repoUrl="https://github.com/skolakoda/programerski-citati" />
      <nav>
        <Link to="/">{translate('HOME')}</Link>
        {password && <Link to="/add-quote">{translate('ADD_QUOTE')}</Link>}
        <Link to="/login">{translate('LOGIN')}</Link>
        <div>
          <button
            onClick={() => setLang('en')}
            className={language === 'en' ? 'active' : ''}>ENG</button>
          <button
            onClick={() => setLang('sr')}
            className={language === 'sr' ? 'active' : ''}>SRB</button>
        </div>
      </nav>
    </header>
  )}

export default Navigation
