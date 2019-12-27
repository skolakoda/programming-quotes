import React, {useState, useEffect} from 'react'
import { connect, useDispatch} from 'react-redux'

import {setUser, logout} from '../store/actions'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'

const Profile = ({ token, admin }) =>  {

  const [memberSince, setMemberSince] = useState(null)
  const [name, setName] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem(LS.token)
    if (!token) return
    const service = localStorage.getItem(LS.service)
    const googleAuthLink = `${domain}/auth/${service}/${token}`
    fetch(googleAuthLink)
      .then(data => data.json())
      .then(data => {
        const { name, admin, memberSince } = data.user
        setMemberSince(memberSince)
        setName(name)
        dispatch(setUser(token, admin))
      })
  }, [dispatch])

  const exit = e => {
    dispatch(logout())
    localStorage.setItem(LS.token, '')
  }

  return (
    <main>
      <h1>{translate('PROFILE')}</h1>
      {token ?
        <div>
          <p>name: {name}</p>
          <p>member since: {new Date(memberSince).toISOString().slice(0, 10)}</p>
          <p>admin: {admin ? 'yes' : 'no'}</p>
          <button onClick={exit}>{translate('LOGOUT')}</button>
        </div>
        : <p>{translate('SUCCESSFULLY_LOGOUT')}</p>
      }
    </main>
  )
}

const mapStateToProps = ({token, admin}) => ({token, admin})

export default connect(mapStateToProps)(Profile)
