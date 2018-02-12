import React, {Component} from 'react'
import Navigation from './header/Navigation'
import Content from './Content'
import Login from './header/Login'
import AddQuote from './AddQuote'
import translate from '../shared/translate'
import {findProp} from '../shared/helpers'
import {Route} from 'react-router-dom'
import './App.css'

const url = 'https://baza-podataka.herokuapp.com/citati/'

class App extends Component {
  constructor() {
    super()
    this.state = {
      allQuotes: [],
      currentQuotes: [],
      authors: new Set(),
      authorList: [],
      authorImages: new Map(),
      language: '',
      chosenAuthor: '',
      phrase: '',
      mainImage:''
    }
  }

  componentDidMount() {
    this.setState({language: translate.currentLanguage})
    fetch(url)
      .then(response => response.json())
      .then(response => {
        const allQuotes = response.sort(() => .5 - Math.random())
        const currentQuotes = allQuotes.filter(x => Math.random() > .9)
        const authors = new Set(allQuotes.map(quote => quote.autor))
        this.setState(() => ({allQuotes, currentQuotes, authors, authorList: [...authors]}))
        for (const author of authors) this.fetchImage(author)
      })
  }

  filterQuotes = () => {
    const language = this.state.language
    const currentQuotes = this.state.allQuotes.filter(quote =>
      (quote.autor === this.state.chosenAuthor || this.state.chosenAuthor === '')
      && quote[language]
      && quote[language].toLowerCase().includes(this.state.phrase.toLowerCase())
    )
    this.setState({currentQuotes})
  }

  fetchImage(author) {
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${author}&prop=pageimages&format=json&pithumbsize=50&origin=*`)
      .then(response => response.json())
      .then(obj => {
        const imgSrc = findProp(obj, 'source') || 'images/unknown.jpg'
        const authorImages = new Map(this.state.authorImages).set(author, imgSrc)
        this.setState({authorImages})
      })
  }

  fetchMainImage(author) {
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${author}&prop=pageimages&format=json&pithumbsize=250&origin=*`)
      .then(response => response.json())
      .then(obj => {
        const mainImage = findProp(obj, 'source') || 'images/unknown.jpg'
        this.setState({mainImage})
      })
  }

  setAuthor = chosenAuthor => {
    this.fetchMainImage(chosenAuthor)
    this.setState({chosenAuthor}, this.filterQuotes)
  }

  findAuthor = findFraze => {
    let re = new RegExp(findFraze,"gi");
    
    let filtered = [...this.state.authors].filter((item) => {
      return re.test(item)
    })
    this.setState({authorList: filtered})
  }

  setPhrase = event => {
    this.setState({phrase:event.target.value}, this.filterQuotes)
  }

  setLang = (language) => {
    this.setState({language})
    translate.setLanguage(language)
  }

  render() {
    return (
      <div>
        <Navigation
          language={this.state.language}
          changeLang={this.changeLang} />
        <Route exact path='/' component={()=>
        <Content
          authors={this.state.authors}
          authorImages={this.state.authorImages}
          setAuthor={this.setAuthor}
          setPhrase={this.setPhrase}
          language={this.state.language}
          mainImage={this.state.mainImage}
          chosenAuthor={this.state.chosenAuthor}
          currentQuotes={this.state.currentQuotes}
            />}/>
         <Route path='/Login' component={()=><Login/>}/>
         <Route path='/AddQuote' component={()=><AddQuote/>}/>
      </div>
    )
  }
}

export default App
