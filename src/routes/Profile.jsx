import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'

import {setUser, logout, useTranslate} from '../store/actions'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'

const Profile = () =>  {
  const {token, admin} = useSelector(state => state)
  const translate = useTranslate()
  const dispatch = useDispatch()
  const [memberSince, setMemberSince] = useState(null)
  const [name, setName] = useState(null)

  useEffect(() => {
    if (!token) return
    const service = localStorage.getItem(LS.service)
    const authLink = `${domain}/auth/${service}/${token}`
    fetch(authLink)
      .then(data => data.json())
      .then(data => {
        const { name, admin, memberSince } = data.user
        setMemberSince(memberSince)
        setName(name)
        dispatch(setUser(token, admin))
      })
  }, [dispatch, token])

  const exit = () => {
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

export default Profile
