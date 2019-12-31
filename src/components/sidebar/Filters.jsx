import React from 'react'
import {useDispatch} from 'react-redux'

import {setPhrase, useTranslate} from '../../store/actions'
import './Filters.css'

const Filters = ({ filterAuthors }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()

  return (
    <div className="filters">
      <h3><label htmlFor="izreke">{translate('SEARCH_QUOTES')}</label></h3>
      <input id="izreke" placeholder="latin input" onChange={e => dispatch(setPhrase(e.target.value))} />

      <h3><label htmlFor="avtori">{translate('SEARCH_AUTHORS')}</label></h3>
      <input id="avtori" onChange={e => filterAuthors(e.target.value)} />
    </div>
  )}

export default Filters