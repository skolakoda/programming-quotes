import React, {Component} from 'react'
import Quote from './components/Quote'
import Filters from './components/Filters'
import Picture from './components/Picture'
import findProp from './helpers/findProp'
import './App.css'

const url = "https://raw.githubusercontent.com/skolakoda/skolakoda.github.io/master/_data/quotes.json"

class App extends Component {
  constructor() {
    super()
    this.state = {
      citati: [],
      autori: new Set(),
      filtrirano: [],
      slikeAutora: new Map(),
      engleski: false,
      autor: '',
      tekst: '',
      velikaSlika:''
    }
    this.handleChange=this.handleChange.bind(this);
    this.izaberiAutora=this.izaberiAutora.bind(this);

  }
handleChange(event){
      this.setState({tekst:event.target.value},this.filtriraj)
    }

izaberiAutora(autor){
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${autor}&prop=pageimages&format=json&pithumbsize=250&origin=*`)
      .then(response => response.json())
      .then(obj=>{
        const velikaSlika = findProp(obj,'source') || '';
        this.setState({velikaSlika});
        })
      this.setState({autor:autor},this.filtriraj);
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
    const jezik = this.state.engleski ? 'en' : 'tekst'
    const filtrirano = this.state.citati.filter(citat =>
      (citat.autor === this.state.autor || this.state.autor === '')
      && (jezik in citat)
      && citat[jezik].toLowerCase().includes(this.state.tekst.toLowerCase())
    )
    this.setState(() => ({filtrirano}))
  }

  changeToEng = () => {
    this.setState({
      engleski: true
    })
  }
  changeToSrb = () => {
    this.setState({
      engleski: false
    })
  }
  render() {
    const citati = this.state.filtrirano.map((citat, i) =>{
      let tekst;
      if(this.state.engleski && citat.en){
        tekst = citat.en
      }
      if(!this.state.engleski && citat.tekst){
        tekst = citat.tekst
      }
      return tekst ? <Quote className="not" key={i} tekst={tekst} autor={citat.autor} slika={this.state.slikeAutora.get(citat.autor)} /> : ''
    })
    return (
      <div className="App">
        <Filters autori={this.state.autori}
                 slikeAutora={this.state.slikeAutora}
                 filtriraj={this.filtriraj}
                 izaberiAutora={this.izaberiAutora}
                 handleChange={this.handleChange}
                 engleski={this.state.engleski} />
        <main>
          <Picture slika={this.state.velikaSlika}
                   autor={this.state.autor}/>
          <button onClick={this.changeToSrb} className="langBtn">SRB</button>
          <button onClick={this.changeToEng} className="langBtn">ENG</button>

          <h1>{this.state.engleski ? 'Programming quotes' : 'Programerski citati'}</h1>
          {citati}
        </main>
      </div>
    )
  }
}

export default App
