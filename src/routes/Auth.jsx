import React from 'react'
import {domain} from '../config/api'

const Auth = (props) => {
  const servis = props.match.params.servis
  const token = props.match.params.token
  localStorage.setItem(`${servis}Token`, token)
  const googleAuthLink = `${domain}/auth/${servis}/${token}`

  return (
    <main>
      <h1>Ulogovani ste preko {servis} naloga</h1>
      <p>Token je {token}</p>
      <a href={googleAuthLink}>Proveri token</a>
    </main>
  )
}

export default Auth
