import React from 'react'
import translate from '../shared/translate'
import {domain} from '../config/api'

const Login = () => (
  <main>
    <h1>{translate('LOGIN')}</h1>
    <a href={`${domain}/auth/google`}>Google login</a>
  </main>
)

export default Login
