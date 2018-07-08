import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {setUser} from '../store/actions'
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
        <code>goto</code> <Link to="/profile">{translate('PROFILE')}</Link>
      </main>
    )
  }
}

const mapDispatchToProps = {setUser}

export default connect(null, mapDispatchToProps)(Auth)
