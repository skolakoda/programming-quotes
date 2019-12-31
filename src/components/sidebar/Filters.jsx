import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {setPhrase, setAuthorPhrase, useTranslate, setFilteredAuthors} from '../../store/actions'
import {includes} from '../../shared/helpers'
import './Filters.css'

const Filters = () => {
  const {allAuthors, phrase, authorPhrase} = useSelector(state => state)
  const translate = useTranslate()
  const dispatch = useDispatch()

  const changePhrase = e => dispatch(setPhrase(e.target.value))

  const filterAuthors = phrase => {
    dispatch(setAuthorPhrase(phrase))
    const filtered = [...allAuthors].filter(name => includes(name, phrase))
    dispatch(setFilteredAuthors(filtered))
  }

  return (
    <div className="filters">
      <h3><label htmlFor="izreke">{translate('SEARCH_QUOTES')}</label></h3>
      <input id="izreke" value={phrase} placeholder="latin input" onChange={changePhrase} />

      <h3><label htmlFor="avtori">{translate('SEARCH_AUTHORS')}</label></h3>
      <input id="avtori" value={authorPhrase} onChange={e => filterAuthors(e.target.value)} />
    </div>
  )}

export default Filters