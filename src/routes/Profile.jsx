import React, {Component} from 'react'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'

export default class Profile extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      voted: [],
      admin: false,
      createdAt: new Date()
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
        const {name, email, admin, createdAt, voted} = data.user
        this.setState({name, email, admin, createdAt, voted})
      })
  }

  logout = e => {
    this.props.setUser('')
    localStorage.setItem(LS.token, '')
  }

  render() {
    return (
      <main>
        <h1>{translate('PROFILE')}</h1>
        {localStorage.getItem(LS.token) ?
          <div>
            <p>name: {this.state.name}</p>
            <p>member since: {new Date(this.state.createdAt).toISOString().slice(0, 10)}</p>
            <p>quotes voted: {this.state.voted.length}</p>
            <p>admin: {this.state.admin ? 'yes' : 'no'}</p>
            <button onClick={this.logout}>{translate('LOGOUT')}</button>
          </div>
          : <p>You have been successfully logged out.</p>
        }
      </main>
    )
  }
}
