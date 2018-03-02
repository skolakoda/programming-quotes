import React from 'react'
import translate from '../shared/translate'

const Login = ({ setPassword }) => (
  <main>
    <h1>{translate('LOGIN')}</h1>
    <form onSubmit={setPassword}>
      <p>Admin password:</p>
      <input name="password" type="password" defaultValue={localStorage.programerskiCitatiPassword}></input>
      <button type="submit">Login</button>
    </form>
  </main>
)

export default Login
