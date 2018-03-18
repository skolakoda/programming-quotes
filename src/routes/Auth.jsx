import React, {Component} from 'react'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'
import translate from '../shared/translate'

class Auth extends Component {
  componentDidMount() {
    const {service, token} = this.props.match.params
    localStorage.setItem(LS.service, service)
    localStorage.setItem(LS.token, token)
    fetch(`${domain}/auth/${service}/${token}`)
      .then(response => response.json())
      .then(response => this.props.setUser(token, response.user.admin))
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
