import React from 'react';

const filteri = {
  autor: '',
  tekst: ''
}

export default class Filters extends React.Component {

  handleChange = event => {
    filteri[event.target.name] = event.target.value
    this.props.filtriraj(filteri)
  }

  render() {
    const sortirano = [...this.props.autori].sort((a, b) => a > b ? 1 : (b > a ? -1 : 0))
    const options = sortirano.map((autor, i) =>
      <option key={i} value={autor}>{autor}</option>
    )
    return (
      <div>
        <input name="tekst" onChange={this.handleChange} />
        <select name="autor" onChange={this.handleChange}>
          <option value=''>Svi autori</option>
          {options}
        </select>
      </div>
    )
  }
}
