import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {checkUser, setUser} from '../store/actions'
import {LS} from '../config/localstorage'
import translate from '../shared/translate'

class Auth extends Component {
  componentDidMount() {
    const {service, token} = this.props.match.params
    localStorage.setItem(LS.service, service)
    localStorage.setItem(LS.token, token)
    this.props.checkUser()
  }

  render() {
    return (
      <main>
        <h1>Auth</h1>
        <p>{translate('SUCCESSFULLY_LOGIN')}</p>
        <code>goto</code> <Link to="/profile">{translate('PROFILE')}</Link>
      </main>
    )
  }
}

const mapDispatchToProps = {checkUser, setUser}

export default connect(null, mapDispatchToProps)(Auth)
