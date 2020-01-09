import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch} from 'react-redux'

import {checkUser, useTranslate} from '../store/actions'
import {LS} from '../config/localstorage'

const Auth = ({match}) => {
  const dispatch = useDispatch()
  const translate = useTranslate()

  useEffect(() => {
    const {service, token} = match.params
    localStorage.setItem(LS.service, service)
    localStorage.setItem(LS.token, token)
    dispatch(checkUser())
  }, [dispatch, match.params])

  return (
    <main>
      <h1>Auth</h1>
      <p>{translate('SUCCESSFULLY_LOGIN')}</p>
      <code>goto</code> <Link to="/moj-profil">{translate('PROFILE')}</Link>
    </main>
  )
}

export default Auth
