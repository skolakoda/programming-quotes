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
      createdAt: null,
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
        const {name, admin, createdAt, voted} = data.user
        this.setState({createdAt, name})
        this.props.setUser(token, admin)
        if (voted) this.updateLocalVotes(voted)
      })
  }

  updateLocalVotes(voted) {
    localStorage.setItem(LS.ratings, JSON.stringify(voted))
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
            <p>member since: {new Date(this.state.createdAt).toISOString().slice(0, 10)}</p>
            <p>quotes voted: {localStorage.getItem(LS.ratings).length}</p>
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