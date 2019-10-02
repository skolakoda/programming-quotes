import React, {Component} from 'react'
import {connect} from 'react-redux'

import {setUser, logout} from '../store/actions'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'

class Profile extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      memberSince: null,
      name: '',
    }
  }

  componentDidMount() {
    const token = localStorage.getItem(LS.token)
    if (!token) return
    const service = localStorage.getItem(LS.service)
    const googleAuthLink = `${domain}/auth/${service}/${token}`
    fetch(googleAuthLink)
      .then(data => data.json())
      .then(data => {
        const {name, admin, memberSince} = data.user
        this.setState({memberSince, name})
        this.props.setUser(token, admin)
      })
  }

  logout = e => {
    this.props.logout()
    localStorage.setItem(LS.token, '')
  }

  render() {
    return (
      <main>
        <h1>{translate('PROFILE')}</h1>
        {this.props.token ?
          <div>
            <p>name: {this.state.name}</p>
            <p>member since: {new Date(this.state.memberSince).toISOString().slice(0, 10)}</p>
            <p>admin: {this.props.admin ? 'yes' : 'no'}</p>
            <button onClick={this.logout}>{translate('LOGOUT')}</button>
          </div>
          : <p>{translate('SUCCESSFULLY_LOGOUT')}</p>
        }
      </main>
    )
  }
}

const mapStateToProps = ({token, admin}) => ({token, admin})
const mapDispatchToProps = {setUser, logout}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
