import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import translate from '../../shared/translate'
import {setLanguage} from '../../store/actions'
import './Header.css'

const Header = ({ token, admin }) => {
  const dispatch = useDispatch()

  const changeLang = e => {
    dispatch(setLanguage(e.target.value))
  }

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
      <div>
        <label htmlFor="jezyk">Jezyk: </label>
        <select id="jezyk" onChange={changeLang}>
          <option value="ms">medžuslovjansky</option>
          <option value="sr">srbskohrvatsky</option>
        </select>
        <label htmlFor="pismo" style={{ marginLeft: '10px' }}>Pismo: </label>
        <select id="pismo">
          <option value="kir">kirilica</option>
          <option value="lat">latinica</option>
        </select>
      </div>
    </header>
  )}

const mapStateToProps = ({ token, admin }) => ({ token, admin })

export default connect(mapStateToProps)(Header)
