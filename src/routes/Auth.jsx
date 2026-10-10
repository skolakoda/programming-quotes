import React, {useEffect} from 'react'
import {Link, useParams} from 'react-router'
import {connect} from 'react-redux'

import {checkUser, setUser} from '../store/actions'
import {LS} from '../config/localstorage'
import translate from '../shared/translate'

function Auth({checkUser, setUser}) {
  const {service, token} = useParams()
  useEffect(() => {
    localStorage.setItem(LS.service, service)
    localStorage.setItem(LS.token, token)
    setUser(token)
    checkUser()
  }, [service, token, setUser, checkUser])

  return (
    <main>
      <h1>Auth</h1>
      <p>{translate('SUCCESSFULLY_LOGIN')}</p>
      <code>goto</code> <Link to="/profile">{translate('PROFILE')}</Link>
    </main>
  )
}

const mapDispatchToProps = {checkUser, setUser}

export default connect(null, mapDispatchToProps)(Auth)
