import React from 'react'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'

const Login = ({ setPassword }) => {
  const password = localStorage.getItem(LS.password)

  const login = e => {
    e.preventDefault()
    const password = e.target.elements.password.value
    setPassword(password)
  }

  const logout = e => {
    setPassword('')
  }

  return (
    <main>
      <h1>{translate(!password ? 'LOGIN' : 'LOGOUT')}</h1>
      { !password ?
        <form onSubmit={login}>
          <p>Admin password:</p>
          <input name="password" type="password" defaultValue={password}></input>
          <button type="submit">{translate('LOGIN')}</button>
        </form>
        :
        <button onClick={logout}>{translate('LOGOUT')}</button>
      }
    </main>
  )
}

export default Login
