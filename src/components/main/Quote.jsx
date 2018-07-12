import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import Stars from './Stars'
import MessagePopup from './MessagePopup'
import translate from '../../shared/translate'
import {API} from '../../config/api'
import {deleteQuote} from '../../store/actions'
import './Quote.css'

class Quote extends Component {
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
    const _id = this.props.quote._id
    fetch(API.delete, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id, token: this.props.token})
    })
      .then(response => response.text())
      .then(response => {
        this.setState({response: translate(response)})  // ne otvara popup
        if (response === 'QUOTE_DELETED') this.props.deleteQuote(_id)
      })
  }

  closePopup = () => {
    this.setState({response: ''})
  }

  render() {
    const { quote, language, admin, cssClass } = this.props
    const author = quote.author
    const id = quote._id
    const authorLink = `/author/${author.replace(/ /g, '_')}`
    const deleteCss = `pointer ${this.state.shouldDelete ? 'red' : ''}`

    return quote[language] ? (
      <blockquote className={cssClass || 'small-quote'}>
        <p className="quote-text">
          <Link to={`/quote/${id}`} className="no-link">{quote[language]}</Link>&nbsp;
          { admin &&
            <span className="admin-actions">
              <Link to={`/edit-quote/${id}`}><span className="edit-icon">&#9998;</span></Link>&nbsp;
              <span onClick={this.tryDelete} className={deleteCss}>&#10005;</span>
            </span>
          }
        </p>
        <Stars rating={quote.rating} id={id} />
        <span className="quote-author"> — <Link to={authorLink}>{author}</Link></span>

        {this.state.response && <MessagePopup message={this.state.response} closePopup={this.closePopup} />}
      </blockquote>
    ) : translate('NO_TRANSLATION')
  }
}

const mapStateToProps = ({language, admin, token}) => ({language, admin, token})
const mapDispatchToProps = {deleteQuote}

export default connect(mapStateToProps, mapDispatchToProps)(Quote)