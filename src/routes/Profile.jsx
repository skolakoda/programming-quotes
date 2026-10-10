import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'

import {setUser, logout} from '../store/actions'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'
import {domain, useServerData} from '../config/api'

function Profile({token, admin, setUser, logout}) {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(false)
  const service = localStorage.getItem(LS.service)
  useEffect(() => {
    if (!useServerData || !token) return
    let active = true
    setProfile(null)
    setError(false)
    fetch(`${domain}/auth/${service}/${token}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then(data => {
        if (!active) return
        if (!data.user) throw new Error('Missing user profile')
        const {name, admin, memberSince} = data.user
        setProfile({token, name, memberSince})
        setUser(token, admin)
      })
      .catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [token, service, setUser])

  const handleLogout = () => {
    logout()
    localStorage.setItem(LS.token, '')
  }
  const current = profile?.token === token ? profile : null
  const date = current?.memberSince ? new Date(current.memberSince) : null
  const memberSince = date && Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : ''

  return (
    <main>
      <h1>{translate('PROFILE')}</h1>
      {token ?
        <div>
          <p>name: {current?.name || ''}</p>
          <p>member since: {memberSince}</p>
          <p>admin: {admin ? 'yes' : 'no'}</p>
          {error && <p>{translate('NETWORK_PROBLEM')}</p>}
          <button onClick={handleLogout}>{translate('LOGOUT')}</button>
        </div>
        : <p>{translate('SUCCESSFULLY_LOGOUT')}</p>
      }
    </main>
  )
}

const mapStateToProps = ({token, admin}) => ({token, admin})
const mapDispatchToProps = {setUser, logout}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
