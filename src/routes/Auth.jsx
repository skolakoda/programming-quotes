import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'

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
    const {service} = this.props.match.params
    return (
      <main>
        <h1>Auth</h1>
        <p>Uspešno ste ulogovani ste preko {service} naloga</p>
        <Link to="/">Goto homepage</Link>
      </main>
    )
  }
}

export default Auth
