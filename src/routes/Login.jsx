import React from 'react'

const Login = ({ setPassword }) => (
  <main>
    <h1>Login</h1>
    <form onSubmit={setPassword}>
      <p>Admin password:</p>
      <input name="password" type="password" defaultValue={localStorage.programerskiCitatiPassword}></input>
      <button type="submit">Login</button>
    </form>
  </main>
)

export default Login
