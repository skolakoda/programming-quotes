import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Quote extends Component {
  render() {
    const id = this.props.match.params.id
    const { language, allQuotes, password } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote) return null

    const author = quote.autor
    const editLink = `/edit-quote/${id}`
    const authorLink = `/author/${author}`
    const wikiUrl = `https://en.wikipedia.org/wiki/${author}`

    return (
      <main>
        <h1>
          {quote[language]} &nbsp;
          {password && <Link to={editLink}><span className="edit-icon">&#9998;</span></Link>}
        </h1>
        <small> — <Link to={authorLink}>{author}</Link> <small>(<a href={wikiUrl} target="_blank">wiki</a>)</small> </small>
      </main>
    )
  }
}

export default Quote
