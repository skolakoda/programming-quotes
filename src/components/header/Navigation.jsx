import React from 'react'
import { connect, useDispatch } from 'react-redux'

import { toggleSidebar } from '../../store/actions'
import Github from './Github'
import { Link } from 'react-router-dom'
import translate from '../../shared/translate'
import './Navigation.css'

const Navigation = ({ language, token, admin }) => {
  const dispatch = useDispatch()

  return (
    <header>
      <button onClick={() => dispatch(toggleSidebar())}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" d="M4 7h22M4 15h22M4 23h22"></path></svg>
      </button>
      <nav>
        <Link to="/" replace={true}>{translate('HOME')}</Link>
        <Link to="/all-quotes">{translate('ALL_QUOTES')}</Link>
        {admin && <Link to="/add-quote">{translate('ADD_QUOTE')}</Link>}
        {token
          ? <Link to="/profile">{translate('PROFILE')}</Link>
          : <Link to="/login">{translate('LOGIN')}</Link>
        }
      </nav>
      <Github repoUrl="https://github.com/mudroljub/svetemisli" />
    </header>
  )
}

const mapStateToProps = ({ language, token, admin }) => ({ language, token, admin })

export default connect(mapStateToProps)(Navigation)
