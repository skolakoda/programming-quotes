import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Stars from './Stars'
import MessagePopup from './MessagePopup'
import translate from '../../shared/translate'
import {API} from '../../config/endpoints'
import './Quote.css'

export default class Quote extends Component {
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
      body: JSON.stringify({_id: this.props.id, password: this.props.password})
    })
      .then(response => response.text())
      .then(response => this.setState({response: translate(response)}))
  }

  closePopup = () => {
    this.setState({ response: '' })
    window.location.reload() // TODO: remove quote from allQuotes
  }

  render() {
    const {author, content, rating, id, password} = this.props
    const quoteLink = `/quote/${id}`
    const editLink = `/edit-quote/${id}`
    const authorLink = `/author/${author}`
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(author)}`
    const deleteStyle = `pointer ${this.state.shouldDelete ? 'red' : ''}`

    return (
      <blockquote>
        <Link to={quoteLink} className="no-link"><i>{content}</i></Link>&nbsp;
        { password &&
          <span className="admin-actions">
            <Link to={editLink}><span className="edit-icon">&#9998;</span></Link>&nbsp;
            <span onClick={this.tryDelete} className={deleteStyle}>&#10005;</span>
          </span>
        }
        <br/>

        <small> — <Link to={authorLink}>{author}</Link> <small>(<a href={wikiUrl} target="_blank">wiki</a>)</small> </small>
        <Stars rating={rating} id={id} />

        {this.state.response && <MessagePopup message={this.state.response} closePopup={this.closePopup} />}
      </blockquote>
    )
  }
}
