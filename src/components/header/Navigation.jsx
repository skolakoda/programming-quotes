import React from 'react'
import { connect } from 'react-redux'

import {setLanguage} from '../../store/actions'
import Github from './Github'
import {Link} from 'react-router-dom'
import translate from '../../shared/translate'
import './Navigation.css'

const Navigation = ({language, token, admin, setLanguage}) => {

  return (
    <header>
      <Github repoUrl="https://github.com/mudroljub/svetemisli" />
      <nav>
        <Link to="/" replace={true}>{translate('HOME')}</Link>
        <Link to="/all-quotes">{translate('ALL_QUOTES')}</Link>
        {admin && <Link to="/add-quote">{translate('ADD_QUOTE')}</Link>}
        {token
          ? <Link to="/profile">{translate('PROFILE')}</Link>
          : <Link to="/login">{translate('LOGIN')}</Link>
        }
      </nav>
    </header>
  )}

const mapStateToProps = ({language, token, admin}) => ({language, token, admin})
const mapDispatchToProps = {setLanguage}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
