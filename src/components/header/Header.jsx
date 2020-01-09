import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import {setLang, setScript, useTranslate} from '../../store/actions'
import './Header.css'

const Header = () => {
  const {lang, token, admin, script} = useSelector(state => state)
  const dispatch = useDispatch()
  const translate = useTranslate()

  const changeLang = e => {
    dispatch(setLang(e.target.value))
  }

  const changeScript = e => {
    dispatch(setScript(e.target.value))
  }

  return (
    <header>
      <nav>
        <NavLink to="/" replace={true} activeClassName="active" exact>{translate('QUOTE_OF_THE_DAY')}</NavLink>
        <NavLink to="/all-quotes" activeClassName="active">{translate('ALL_QUOTES')}</NavLink>
        {admin && <NavLink to="/add-quote" activeClassName="active">{translate('ADD_QUOTE')}</NavLink>}
        <NavLink to="/add-translation" activeClassName="active">{translate('ADD_TRANSLATION')}</NavLink>
        {token
          ? <NavLink to="/profile" activeClassName="active">{translate('PROFILE')}</NavLink>
          : <NavLink to="/login" activeClassName="active">{translate('LOGIN')}</NavLink>
        }
      </nav>
      <div className="choose-lang">
        <label htmlFor="jezyk">{translate('LANGUAGE')}: </label>
        <select id="jezyk" onChange={changeLang} value={lang}>
          <option value="ms">{translate('INTERSLAVIC')}</option>
          <option value="sr">{translate('SERBOCROATIAN')}</option>
        </select>
        <label htmlFor="pismo">{translate('SCRIPT')}: </label>
        <select id="pismo" onChange={changeScript} value={script}>
          <option value="kir">кирилица</option>
          <option value="lat">latinica</option>
        </select>
      </div>
    </header>
  )}

export default Header
