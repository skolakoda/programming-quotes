import React from 'react'
import { connect } from 'react-redux'

import {setLanguage} from '../../store/actions'
import Github from './Github'
import {Link} from 'react-router'
import translate from '../../shared/translate'
import './Navigation.css'

const Navigation = ({language, setLanguage}) => {

  return (
    <header>
      <Github repoUrl="https://github.com/skolakoda/programming-quotes" />
      <nav>
        <Link to="/" replace={true}>{translate('DAILY_QUOTE')}</Link>
        <Link to="/all-quotes">{translate('ALL_QUOTES')}</Link>
        <Link to="/statistics">{translate('STATISTICS')}</Link>
        <div className="language-switcher">
          <button
            onClick={() => setLanguage('en')}
            lang="en"
            className={language === 'en' ? 'active' : ''}>English</button>
          <button
            onClick={() => setLanguage('sr')}
            lang="sr"
            className={language === 'sr' ? 'active' : ''}>Srpski</button>
          <button
            onClick={() => setLanguage('stsl')}
            lang="cu"
            aria-pressed={language === 'stsl'}
            className={language === 'stsl' ? 'active' : ''}>Словѣньскъ</button>
        </div>
      </nav>
    </header>
)}

const mapStateToProps = ({language}) => ({language})
const mapDispatchToProps = {setLanguage}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
