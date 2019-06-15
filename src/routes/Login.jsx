import React from 'react'
import translate from '../shared/translate'
import {domain} from '../config/api'

const Login = () => (
  <main>
    <h1>{translate('LOGIN')}</h1>
    <p><a href={`${domain}/auth/github`} referrerPolicy="unsafe-url">Github login</a></p>
    <p><a href={`${domain}/auth/google`} referrerPolicy="unsafe-url">Gmail login</a></p>
  </main>
)

export default Login
