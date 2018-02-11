import React from 'react'
import './Filters.css'
import translate from '../../shared/translate'

const Filters = ({ setPhrase, setAuthor, findAuthor }) => (
  <div className="filters">
    <h3>{translate('SEARCH_TEXT')}</h3>
    <input onChange={setPhrase} />

    <h3>{translate('CHOOSE_AUTHOR')}</h3>
    <input placeholder={translate('SEARCH_FOR_AUTORS')} onChange={(e) => findAuthor(e.target.value)} /> 
    <button className="btn-authors" onClick={() => findAuthor('')}>
      {translate('ALL_AUTHORS')}
    </button>
  </div>
)

export default Filters
