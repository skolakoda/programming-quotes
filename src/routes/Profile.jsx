import React, {Component} from 'react'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'
import {API, domain} from '../config/api'

export default class Profile extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
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
        const {name, admin, createdAt, voted} = data.user
        this.setState({name, admin, createdAt})
        if (voted) this.syncVotes(token, voted)
      })
  }

  syncVotes(token, remoteVotes) {
    const localVotes = JSON.parse(localStorage.getItem(LS.ratings))
    const voted = [...new Set(localVotes, remoteVotes)]
    fetch(API.updateUserVotes, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token, voted})
    })
    this.updateLocalVotes(voted)
  }

  updateLocalVotes(voted) {
    this.setState({voted})
    localStorage.setItem(LS.ratings, JSON.stringify(voted))
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
          : <p>{translate('SUCCESSFULLY_LOGOUT')}</p>
        }
      </main>
    )
  }
}
