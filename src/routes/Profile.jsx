import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom'

import {setUser, logout, useTranslate} from '../store/actions'
import {LS} from '../config/localstorage'
import {domain} from '../config/api'

const Profile = () =>  {
  const {token, admin, translateMode} = useSelector(state => state)
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

  const toggleTranslateMode = () => {
    dispatch({type: 'TOGGLE_TRANSLATE_MODE'})
    dispatch({type: 'INIT'})
  }

  return (
    <main>
      <h1>{translate('PROFILE')}</h1>
      {token ?
        <div>
          <p>name: {name}</p>
          <p>member since: {new Date(memberSince).toISOString().slice(0, 10)}</p>
          <p>admin: {admin ? 'yes' : 'no'}</p>
          <NavLink to="/neprevedeno" activeClassName="active">{translate('UNTRANSLATED').toLowerCase()}</NavLink>
          <p>translation mode:{' '}
            <label>
              <input
                type="radio"
                name="translation-mode"
                value="off"
                checked={!translateMode}
                onChange={toggleTranslateMode}
              /> off
            </label>
            <label>
              <input
                type="radio"
                name="translation-mode"
                value="on"
                checked={translateMode}
                onChange={toggleTranslateMode}
              /> on
            </label>
          </p>

          <p style={{ textAlign: 'center'}}><button onClick={exit}>{translate('LOGOUT')}</button></p>
        </div>
        : <p>{translate('SUCCESSFULLY_LOGOUT')}</p>
      }
    </main>
  )
}

export default Profile
