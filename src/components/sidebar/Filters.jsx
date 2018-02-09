import React from 'react'
import './Filters.css'
import translate from '../../shared/translate'

const Filters = ({ setPhrase, setAuthor }) => (
  <div className="filters">
    <h3>{translate('SEARCH_TEXT')}</h3>
    <input onChange={setPhrase} />

    <h3>{translate('CHOOSE_AUTHOR')}</h3>
    <button className="btn-authors" onClick={() => setAuthor('')}>
      {translate('ALL_AUTHORS')}
    </button>
  </div>
)

export default Filters
