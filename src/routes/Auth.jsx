import React, {Component} from 'react'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'
import {checkToken} from '../shared/helpers'
import translate from '../shared/translate'

class Auth extends Component {
  componentDidMount() {
    const {service, token} = this.props.match.params
    localStorage.setItem(LS.service, service)
    localStorage.setItem(LS.token, token)
    checkToken(`${domain}/auth/${service}/${token}`, token, this.props.setUser)
  }

  render() {
    return (
      <main>
        <h1>Auth</h1>
        <p>{translate('SUCCESSFULLY_LOGIN')}</p>
      </main>
    )
  }
}

export default Auth
