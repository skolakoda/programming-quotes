import React from 'react'
import { connect } from 'react-redux'

import {setLanguage} from '../../store/actions'
import Github from './Github'
import {Link} from 'react-router'
import translate from '../../shared/translate'
import {useServerData} from '../../config/api'
import './Navigation.css'

const Navigation = ({language, token, admin, setLanguage}) => {

  return (
    <header>
      <Github repoUrl="https://github.com/skolakoda/programming-quotes" />
      <nav>
        <Link to="/" replace={true}>{translate('DAILY_QUOTE')}</Link>
        <Link to="/all-quotes">{translate('ALL_QUOTES')}</Link>
        {useServerData && admin && <Link to="/add-quote">{translate('ADD_QUOTE')}</Link>}
        {useServerData && (token
          ? <Link to="/profile">{translate('PROFILE')}</Link>
          : <Link to="/login">{translate('LOGIN')}</Link>
        )}
        <div>
          <button
            onClick={() => setLanguage('en')}
            className={language === 'en' ? 'active' : ''}>ENG</button>
          <button
            onClick={() => setLanguage('sr')}
            className={language === 'sr' ? 'active' : ''}>SRB</button>
        </div>
      </nav>
    </header>
)}

const mapStateToProps = ({language, token, admin}) => ({language, token, admin})
const mapDispatchToProps = {setLanguage}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
