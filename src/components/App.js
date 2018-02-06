import React, {Component} from 'react'
import Quote from './Quote'
import Filters from './Filters'
import Picture from './Picture'
import {findProp} from '../shared/helpers'
import './App.css'

const url = "https://baza-podataka.herokuapp.com/citati/"

class App extends Component {
  constructor() {
    super()
    this.state = {
      quotes: [],
      authors: new Set(),
      filtered: [],
      authorImages: new Map(),
      language: 'sr',
      chosenAuthor: '',
      phrase: '',
      mainImage:''
    }
  }

  componentDidMount() {
    fetch(url)
    .then(response => response.json())
    .then(response => {
      const quotes = response.sort(() => .5 - Math.random())
      const filtered = quotes.filter(x => Math.random() > .9)
      const authors = new Set(quotes.map(quote => quote.autor))
      this.setState(() => ({quotes, filtered, authors}))

      for (const author of authors) {
        fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${author}&prop=pageimages&format=json&pithumbsize=50&origin=*`)
        .then(response => response.json())
        .then(obj => {
          const imgSrc = findProp(obj, 'source') || ''
          const authorImages = new Map(this.state.authorImages).set(author, imgSrc)
          this.setState(() => ({authorImages}))
        })
      }
    })
  }

  setPhrase = event => {
    this.setState({phrase:event.target.value}, this.filterQuotes)
  }

  setAuthor = chosenAuthor => {
    // TODO: separate getImage
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${chosenAuthor}&prop=pageimages&format=json&pithumbsize=250&origin=*`)
      .then(response => response.json())
      .then(obj => {
        const mainImage = findProp(obj,'source') || '';
        this.setState({mainImage});
      })
    this.setState({chosenAuthor}, this.filterQuotes);
  }

  filterQuotes = () => {
    const language = this.state.language
    const filtered = this.state.quotes.filter(quote =>
      (quote.autor === this.state.chosenAuthor || this.state.chosenAuthor === '')
      && quote[language]
      && quote[language].toLowerCase().includes(this.state.phrase.toLowerCase())
    )
    this.setState(() => ({filtered}))
  }

  changeLang = (lang) => {
    this.setState({
      language: lang
    })
  }

  render() {
    const quotes = this.state.filtered.map((q, i) => q[this.state.language]
      ? <Quote key={q._id} content={q[this.state.language]} author={q.autor} />
      : ''
    )
    return (
      <div className="App">
       <Filters
          authors={this.state.authors}
          authorImages={this.state.authorImages}
          setAuthor={this.setAuthor}
          setPhrase={this.setPhrase}
          language={this.state.language}
        />

        <main>
          <button onClick={() => this.changeLang('sr')} className="lang-btn">SRB</button>
          <button onClick={() => this.changeLang('en')} className="lang-btn">ENG</button>
          <Picture
            imgSrc={this.state.mainImage}
            author={this.state.chosenAuthor}
          />
          <h1>{this.state.language === 'en' ? 'Programming quotes' : 'Programerski citati'}</h1>
          {quotes}
        </main>
      </div>
    )
  }
}

export default App
