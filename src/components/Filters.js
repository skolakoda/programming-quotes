import React from 'react';
import './Filters.css'

const Filters = props => {

  const sortirano = [...props.autori].sort((a, b) => a > b ? 1 : (b > a ? -1 : 0))
  const autori = sortirano.map((autor, i) =>
    <div key={i} onClick={() =>props.izaberiAutora(autor)}>
      {props.slikeAutora.get(autor) ? <img src={props.slikeAutora.get(autor)} alt={autor} /> : ''}
      {autor}
    </div>
  )

  return (
    <aside className="filters">
      <div className="filters-inner">
        <h3>{props.engleski ? 'Search text' : 'Pretraži tekst'}</h3>
        <input name="tekst" onChange={props.handleChange} />
        <h3>{props.engleski ? 'Choose the author' : 'Izaberi autora'}</h3>
        <button className="svi-autori" onClick={() =>props.izaberiAutora('')}>{props.engleski ? 'All authors' : 'Svi autori'}</button>
        {autori}
      </div>
    </aside>
  )
}

export default Filters
