import React, {Component} from 'react';
import Quote from './components/Quote'
import Filters from './components/Filters'
import './App.css';

const url = "https://raw.githubusercontent.com/skolakoda/skolakoda.github.io/master/_data/quotes.json"

class App extends Component {

  constructor() {
    super()
    this.state = {
      citati: [],
      autori: [],
      filtrirano: []
    }
  }

  componentDidMount() {
    fetch(url)
    .then(odgovor => odgovor.json())
    .then(citati => {
      this.setState(() => ({citati, filtrirano: citati}))
      const autori = new Set(citati.map(citat => citat.autor))
      this.setState(() => ({autori}))
    })
  }

  filtriraj = filteri => {
    const filtrirano = this.state.citati.filter(citat =>
      (citat.autor === filteri.autor || filteri.autor === '')
      && citat.tekst.toLowerCase().includes(filteri.tekst.toLowerCase())
    )
    this.setState(() => ({filtrirano}))
  }

  render() {
    const citati = this.state.filtrirano.map((citat, i) =>
      <Quote key={i} tekst={citat.tekst} autor={citat.autor}/>
    )
    return (
      <div className="App">
        <Filters autori={this.state.autori} filtriraj={this.filtriraj}/>
        <h1>Programerske mudrosti</h1>
        {citati}
      </div>
    )
  }
}

export default App;
