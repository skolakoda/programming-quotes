import React, { Component } from 'react';
import Citat from './components/Citat'
import ucitaj from './helpers/ucitaj'
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = {
      citati: []
    }
  }

  componentDidMount() {
    ucitaj(odgovor =>
      this.setState( () => ({citati: odgovor}) )
    )
  }

  render() {
    const jsxCitati = this.state.citati.map((citat, i) =>
      <Citat key={i} tekst={citat.tekst} autor={citat.autor} />
    )
    return (
      <div className="App">
        <h1>Programerske mudrosti</h1>
        {jsxCitati}
      </div>
    );
  }
}

export default App;
