import React from 'react'
import {connect} from 'react-redux'

import {setPhrase, useTranslate} from '../../store/actions'
import './Filters.css'

const Filters = ({ setPhrase, filterAuthors }) => {
  const translate = useTranslate()
  return (
    <div className="filters">
      <h3><label htmlFor="izreke">{translate('SEARCH_QUOTES')}</label></h3>
      <input id="izreke" placeholder="latin input" onChange={e => setPhrase(e.target.value)} />

      <h3><label htmlFor="avtori">{translate('SEARCH_AUTHORS')}</label></h3>
      <input id="avtori" onChange={e => filterAuthors(e.target.value)} />
    </div>
  )}

const mapStateToProps = ({lang}) => ({lang})  // zbog rendera kad se promeni jezik
const mapDispatchToProps = { setPhrase }

export default connect(mapStateToProps, mapDispatchToProps)(Filters)