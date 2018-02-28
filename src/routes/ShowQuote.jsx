import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import SmartAuthorImage from '../components/main/SmartAuthorImage'
import './ShowQuote.css'

class ShowQuote extends Component {
  render() {
    const id = this.props.match.params.id
    const { language, allQuotes, password } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote || !quote[language]) return null

    const author = quote.autor
    const editLink = `/edit-quote/${id}`
    const authorLink = `/author/${author}`

    return (
      <main className="quote-box">
        <SmartAuthorImage author={author} />
        <article>
          <h1>
            {quote[language]} &nbsp;
            {password && <Link to={editLink}><span className="edit-icon">&#9998;</span></Link>}
          </h1>
          <h3> — <Link className="no-link" to={authorLink}>{author}</Link></h3>
        </article>
      </main>
    )
  }
}

export default ShowQuote
