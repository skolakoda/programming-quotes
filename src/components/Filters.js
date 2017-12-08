import React from 'react';

const Filters = props => {
  const filteri = {
    autor: '',
    tekst: ''
  }

  const handleChange = event => {
    filteri[event.target.name] = event.target.value
    props.filtriraj(filteri)
  }

  const sortirano = [...props.autori].sort((a, b) => a > b ? 1 : (b > a ? -1 : 0))
  const options = sortirano.map((autor, i) =>
    <option key={i} value={autor}>{autor}</option>
  )

  return (
    <div>
      <input name="tekst" onChange={handleChange} />
      <select name="autor" onChange={handleChange}>
        <option value=''>Svi autori</option>
        {options}
      </select>
    </div>
  )
}

export default Filters
