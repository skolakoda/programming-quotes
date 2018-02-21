import React, {Component} from 'react'
import Quotes from '../components/main/Quotes'
import Picture from '../components/main/Picture'

class Author extends Component {
  render() {
    const author = this.props.match.params.name
    const { language, allQuotes, password } = this.props
    const currentQuotes = allQuotes.filter(q => q.autor === author)

    return (
      <main>
        <h1>{author}</h1>
        <Picture author={author} />
        <Quotes language={language} currentQuotes={currentQuotes} password={password} />
      </main>
    )
  }
}

export default Author
