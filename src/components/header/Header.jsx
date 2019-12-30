import React from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
import translate from '../../shared/translate'
import './Header.css'

const Header = ({ language, token, admin }) => {
  return (
    <header>
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
  )
}

const mapStateToProps = ({ language, token, admin }) => ({ language, token, admin })

export default connect(mapStateToProps)(Header)
