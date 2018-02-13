import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'
import Navigation from './header/Navigation'
import Sidebar from './sidebar/Sidebar'
import Main from '../routes/Main'
import AddQuote from '../routes/AddQuote'
import {fetchImage} from '../shared/helpers'
import translate from '../shared/translate'
import './App.css'

const url = 'https://baza-podataka.herokuapp.com/citati/'

class App extends Component {
  constructor() {
    super()
    this.state = {
      allQuotes: [],
      currentQuotes: [],
      allAuthors: new Set(),
      filteredAuthors: [],
      authorImages: new Map(),
      quoteLanguage: '',
      chosenAuthor: '',
      phrase: '',
      mainImage:''
    }
  }

  componentDidMount() {
    this.setState({quoteLanguage: translate.currentLanguage})

    fetch(url)
      .then(response => response.json())
      .then(response => {
        const allQuotes = response.sort(() => .5 - Math.random())
        const currentQuotes = allQuotes.filter(q => Math.random() > .9)
        const allAuthors = new Set(allQuotes.map(quote => quote.autor))
        this.setState(() => ({allQuotes, currentQuotes, allAuthors, filteredAuthors: [...allAuthors]}))
        for (const author of allAuthors) this.fetchThumbnail(author)
      })
  }

  filterQuotes = () => {
    const lang = this.state.quoteLanguage
    const currentQuotes = this.state.allQuotes.filter(quote =>
      (quote.autor === this.state.chosenAuthor || this.state.chosenAuthor === '')
      && quote[lang] && quote[lang].toLowerCase().includes(this.state.phrase.toLowerCase())
    )
    this.setState({currentQuotes})
  }

  fetchThumbnail(author) {
    fetchImage(author, '50', imgSrc => {
      const authorImages = this.state.authorImages.set(author, imgSrc)
      this.setState({authorImages})
    })
  }

  setAuthor = chosenAuthor => {
    this.setState({chosenAuthor, mainImage: ''}, this.filterQuotes)
    if (chosenAuthor)
      fetchImage(chosenAuthor, '250', imgSrc => this.setState({mainImage: imgSrc}))
  }

  filterAuthors = phrase => {
    const filteredAuthors = [...this.state.allAuthors].filter(
      name => name.toLowerCase().includes(phrase.toLowerCase())
    )
    this.setState({mainImage: '', filteredAuthors})
  }

  setPhrase = event => {
    this.setState({phrase:event.target.value}, this.filterQuotes)
  }

  setLang = language => {
    this.setState({quoteLanguage: language})
    translate.setLanguage(language)
  }

  render() {
    return (
      <div className="App">
        <Sidebar
          authors={this.state.filteredAuthors}
          authorImages={this.state.authorImages}
          setAuthor={this.setAuthor}
          setPhrase={this.setPhrase}
          filterAuthors={this.filterAuthors}
        />
        <section className="right-section">
          <Navigation setLang={this.setLang} />

          <Switch>
            <Route path='/add-quote' component={AddQuote}/>
            <Route path='/' render={(props) => (
              <Main {...props}
                language={this.state.quoteLanguage}
                mainImage={this.state.mainImage}
                chosenAuthor={this.state.chosenAuthor}
                currentQuotes={this.state.currentQuotes}
              />
            )} />
          </Switch>
        </section>
      </div>
    )
  }
}

export default App
