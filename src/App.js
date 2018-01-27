import React, {Component} from 'react'
import Quote from './components/Quote'
import Filters from './components/Filters'
import Picture from './components/Picture'
import {findProp} from './shared/helpers'
import './App.css'

const url = "https://baza-podataka.herokuapp.com/citati/"

class App extends Component {
  constructor() {
    super()
    this.state = {
      citati: [],
      autori: new Set(),
      filtrirano: [],
      slikeAutora: new Map(),
      jezik: 'sr',
      autor: '',
      fraza: '',
      velikaSlika:''
    }
    this.setPhrase=this.setPhrase.bind(this);
    this.izaberiAutora=this.izaberiAutora.bind(this);
  }
  
  setPhrase(event){
    this.setState({fraza:event.target.value}, this.filtriraj)
  }

  izaberiAutora(autor){
    // TODO: move fetch to Picture component
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${autor}&prop=pageimages&format=json&pithumbsize=250&origin=*`)
      .then(response => response.json())
      .then(obj => {
        const velikaSlika = findProp(obj,'source') || '';
        this.setState({velikaSlika});
      })
    this.setState({autor}, this.filtriraj);
  }

  componentDidMount() {
    fetch(url)
    .then(odgovor => odgovor.json())
    .then(odgovor => {
      const citati = odgovor.sort(() => .5 - Math.random())
      const filtrirano = citati.filter(x => Math.random() > .9)
      const autori = new Set(citati.map(citat => citat.autor))
      this.setState(() => ({citati, filtrirano, autori}))

      for (const autor of autori) {
        fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${autor}&prop=pageimages&format=json&pithumbsize=50&origin=*`)
        .then(odgovor => odgovor.json())
        .then(obj => {
          const slika = findProp(obj, 'source') || ''
          const slikeAutora = new Map(this.state.slikeAutora).set(autor, slika)
          this.setState(() => ({slikeAutora}))
        })
      }
    })
  }

  filtriraj =()=> {
    const jezik = this.state.jezik
    const filtrirano = this.state.citati.filter(citat =>
      (citat.autor === this.state.autor || this.state.autor === '')
      && citat[jezik]
      && citat[jezik].toLowerCase().includes(this.state.fraza.toLowerCase())
    )
    this.setState(() => ({filtrirano}))
  }

  changeLang = (lang) => {
    this.setState({
      jezik: lang
    })
  }

  render() {
    const citati = this.state.filtrirano.map((citat, i) => {
      const tekst = citat[this.state.jezik]
      return tekst ? 
        <Quote className="not" key={i} tekst={tekst} autor={citat.autor} /> 
        : ''
    })
    return (
      <div className="App">
        <Filters 
          autori={this.state.autori}
          slikeAutora={this.state.slikeAutora}
          izaberiAutora={this.izaberiAutora}
          setPhrase={this.setPhrase}
          jezik={this.state.jezik} 
        />

        <main>
          <Picture 
            slika={this.state.velikaSlika}
            autor={this.state.autor}
          />
          <button onClick={() => this.changeLang('sr')} className="langBtn">SRB</button>
          <button onClick={() => this.changeLang('en')} className="langBtn">ENG</button>
          <h1>{this.state.jezik === 'en' ? 'Programming quotes' : 'Programerski citati'}</h1>
          {citati}
        </main>
      </div>
    )
  }
}

export default App
