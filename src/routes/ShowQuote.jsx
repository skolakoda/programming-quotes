import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import SmartAuthorImage from '../components/main/SmartAuthorImage'
import Stars from './../components/main/Stars'
import MessagePopup from '../components/main/MessagePopup'
import translate from '../shared/translate'
import {API} from '../config/endpoints'
import './ShowQuote.css'

export default class ShowQuote extends Component {
  constructor() {
    super()
    this.state = {
      shouldDelete: false,
      response: ''
    }
  }

  tryDelete = () => {
    if (this.state.shouldDelete)
      this.deleteQuote()
    this.setState({shouldDelete: true})
  }

  deleteQuote = () => {
    fetch(API.del, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id: this.props.match.params.id, password: this.props.password})
    })
      .then(response => response.text())
      .then(response => this.setState({response: translate(response)}))
  }

  closePopup = () => {
    this.setState({ response: '' })
    window.location.reload() // TODO: remove quote from allQuotes
  }

  render() {
    const id = this.props.match.params.id
    const { language, allQuotes, password } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote || !quote[language]) return null

    const author = quote.autor
    const quoteLink = `/quote/${id}`
    const editLink = `/edit-quote/${id}`
    const authorLink = `/author/${author}`
    const deleteStyle = `pointer ${this.state.shouldDelete ? 'red' : ''}`

    return (
      <main className="quote-box">
        <SmartAuthorImage author={author} />
        <blockquote>
          <h1>
            <Link to={quoteLink} className="no-link">{quote[language]}</Link>&nbsp;
            { password &&
              <span className="admin-actions">
                <Link to={editLink}><span className="edit-icon">&#9998;</span></Link>&nbsp;
                <span onClick={this.tryDelete} className={deleteStyle}>&#10005;</span>
              </span>
            }
          </h1>
          <Stars rating={quote.ocena} id={id} />
          <h3> — <Link className="no-link" to={authorLink}>{author}</Link></h3>

          {this.state.response && <MessagePopup message={this.state.response} closePopup={this.closePopup} />}
        </blockquote>
      </main>
    )
  }
}
