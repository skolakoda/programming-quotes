import React from 'react'
import {connect} from 'react-redux'

import {setPhrase} from '../../store/actions'
import './Filters.css'
import translate from '../../shared/translate'

const Filters = ({ setPhrase, filterAuthors }) => (
  <div className="filters">
    <h3>{translate('SEARCH_QUOTES')}</h3>
    <input onChange={e => setPhrase(e.target.value)} />

    <h3>{translate('SEARCH_AUTHORS')}</h3>
    <input onChange={e => filterAuthors(e.target.value)} />
  </div>
)

const mapStateToProps = ({language}) => ({language})  // zbog rendera kad se promeni jezik
const mapDispatchToProps = { setPhrase }

export default connect(mapStateToProps, mapDispatchToProps)(Filters)