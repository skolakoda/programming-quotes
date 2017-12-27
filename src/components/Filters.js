import React from 'react';
import './Filters.css'

const Filters = props => {
  const filteri = {
    autor: '',
    tekst: ''
  }

  const handleChange = event => {
    filteri[event.target.name] = event.target.value
    props.filtriraj(filteri)
  }

  const izaberiAutora = (autor) => {
    filteri['autor'] = autor
    props.filtriraj(filteri)
  }

  const sortirano = [...props.autori].sort((a, b) => a > b ? 1 : (b > a ? -1 : 0))
  const autori = sortirano.map((autor, i) =>
    <div key={i} onClick={() => izaberiAutora(autor)}>
      {props.slikeAutora.get(autor) ? <img src={props.slikeAutora.get(autor)} alt={autor} /> : ''}
      {autor}
    </div>
  )

  return (
    <aside className="filters">
      <div className="filters-inner">
        <h3>{props.engleski ? 'Search quotes' : 'Pretraži citate'}</h3>
        <input name="tekst" onChange={handleChange} />
        <h3>{props.engleski ? 'Choose the author' : 'Izaberi autora'}</h3>
        <button className="svi-autori" onClick={() => izaberiAutora('')}>{props.engleski ? 'All authors' : 'Svi autori'}</button>
        {autori}
      </div>
    </aside>
  )
}

export default Filters
