import React from 'react'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'

const Login = ({ setPassword }) => {
  const password = localStorage.getItem(LS.password)
  const googleAuthLink = `${domain}/auth/google`

  const login = e => {
    e.preventDefault()
    const password = e.target.elements.password.value
    setPassword(password)
  }

  const logout = e => setPassword('')

  return (
    <main>
      <h1>{translate(!password ? 'LOGIN' : 'LOGOUT')}</h1>
      {/* TODO: dodati config logiku za host */}
      <a href={googleAuthLink}>Google login</a>
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
