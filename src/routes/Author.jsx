import React, {Component} from 'react'
import Quotes from '../components/main/Quotes'
import AuthorBox from '../components/main/AuthorBox'
import translate from '../shared/translate'
import preloader from '../assets/images/preloader.gif'

class Author extends Component {
  render() {
    const author = this.props.match.params.name
    const { language, allQuotes, password, phrase } = this.props
    const currentQuotes = allQuotes
      .filter(q => q.autor === author)
      .filter(quote => quote[language] && quote[language].toLowerCase().includes(phrase.toLowerCase()))

    return (
      <main>
        <h1>{author}</h1>
        <AuthorBox author={author} />
        {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
        {allQuotes.length
          ? <Quotes language={language} currentQuotes={currentQuotes} password={password} />
          : <img src={preloader} alt="loading..." />
        }
      </main>
    )
  }
}

export default Author
