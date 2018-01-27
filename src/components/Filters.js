import React from 'react';
import {sortirajAbecedno} from '../shared/helpers'
import './Filters.css'

const Filters = props => {

  const sortirano = [...props.autori].sort(sortirajAbecedno)

  const autori = sortirano.map((autor, i) =>
    <div key={i} onClick={() =>props.izaberiAutora(autor)}>
      {props.slikeAutora.get(autor) ? <img src={props.slikeAutora.get(autor)} alt={autor} /> : ''}
      {autor}
    </div>
  )

  return (
    <aside className="filters">
      <div className="filters-inner">

        <h3>{props.jezik === 'en' ? 'Search text' : 'Pretraži tekst'}</h3>
        <input name="tekst" onChange={props.setPhrase} />

        <h3>{props.jezik === 'en' ? 'Choose the author' : 'Izaberi autora'}</h3>
        <button className="svi-autori" onClick={() =>props.izaberiAutora('')}>{props.jezik === 'en' ? 'All authors' : 'Svi autori'}</button>
        {autori}

      </div>
    </aside>
  )
}

export default Filters
