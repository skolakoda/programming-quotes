import React from 'react'

const Login = ({ setPassword }) => (
  <main>
    <h1>Login</h1>
    <form onSubmit={setPassword}>
      <p>Admin password:</p>
      <input name="password" type="password"></input>
      <button type="submit">Login</button>
    </form>
  </main>
)

export default Login
