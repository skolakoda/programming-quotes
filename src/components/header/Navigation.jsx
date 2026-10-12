import React from 'react'
import { connect } from 'react-redux'

import {setLanguage} from '../../store/actions'
import Github from './Github'
import {Link} from 'react-router'
import {useTranslate} from '../../shared/translate'
import {languages} from '../../shared/languages'
import './Navigation.css'

const Navigation = ({language, setLanguage}) => {
  const translate = useTranslate()

  return (
    <header>
      <Github repoUrl="https://github.com/skolakoda/programming-quotes" />
      <nav>
        <Link to="/" replace={true}>{translate('DAILY_QUOTE')}</Link>
        <Link to="/all-quotes">{translate('ALL_QUOTES')}</Link>
        <Link to="/tags">{translate('TOPICS')}</Link>
        <Link to="/statistics">{translate('STATISTICS')}</Link>
        <div className="language-switcher">
          {languages.map(({code, lang, name}) =>
            <button
              key={code}
              onClick={() => setLanguage(code)}
              lang={lang}
              aria-pressed={language === code}
              className={language === code ? 'active' : ''}>{name}</button>
          )}
        </div>
      </nav>
    </header>
)}

const mapStateToProps = ({language}) => ({language})
const mapDispatchToProps = {setLanguage}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
