import React, {Component} from 'react'
import {createStore} from 'redux'
import Quote from './components/Quote'
import Filters from './components/Filters'
import findProp from './helpers/findProp'
import './App.css'

// ucitati i dodati veliku sliku izabranog autora
console.log(createStore)

const url = "https://raw.githubusercontent.com/skolakoda/skolakoda.github.io/master/_data/quotes.json"

class App extends Component {

  constructor() {
    super()
    this.state = {
      citati: [], // niz objekata
      autori: new Set(),
      filtrirano: [],
      slikeAutora: new Map()
    }
  }

  componentDidMount() {
    fetch(url)
    .then(odgovor => odgovor.json())
    .then(citati => {
      this.setState(() => ({citati, filtrirano: citati.filter(x => Math.random() > .9)}))
      const autori = new Set(citati.map(citat => citat.autor))
      this.setState(() => ({autori}))

      for (const autor of autori) {
        fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${autor}&prop=pageimages&format=json&pithumbsize=50&origin=*`)
        .then(odgovor => odgovor.json())
        .then(obj => this.setState(() => ({slikeAutora: new Map(this.state.slikeAutora).set(autor, findProp(obj, 'source') || '')})
        ))
      }
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
      <Quote key={i} tekst={citat.tekst} autor={citat.autor} slika={this.state.slikeAutora.get(citat.autor)} />
    )
    return (
      <div className="App">
        <Filters autori={this.state.autori} slikeAutora={this.state.slikeAutora} filtriraj={this.filtriraj}/>
        <main>
          <h1>Programerski citati</h1>
          {citati}
        </main>
      </div>
    )
  }
}

export default App
