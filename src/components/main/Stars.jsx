import React, {Component} from 'react'
import ReactStars from 'react-stars'
import {API} from '../../config/api'
import {LS} from '../../config/localstorage'
import translate from '../../shared/translate'
import './Stars.css'

export default class Stars extends Component {
  constructor(props) {
    super()
    this.state = {
      rating: Number(props.rating),
      error: ''
    }
  }

  updateLocalVotes(votes) {
    localStorage.setItem(LS.ratings, JSON.stringify(votes))
  }

  alreadyVoted(localVotes) {
    return Array.isArray(localVotes) && localVotes.includes(this.props.id)
  }

  vote = newVote => {
    const localVotes = JSON.parse(localStorage.getItem(LS.ratings))
    if (this.alreadyVoted(localVotes))
      return this.setState({ error: translate('CAN_VOTE_ONCE') })
    const newStorage = localVotes ? [...localVotes, this.props.id] : [this.props.id]
    fetch(API.vote, {
      method: 'POST',
      body: JSON.stringify({
        quoteId: this.props.id,
        token: localStorage.getItem(LS.token),
        newVote
      }),
      headers: {'content-type': 'application/json'}
    })
      .then(response => response.json())
      .then(response => this.setNewVote(newStorage, response.quote.rating))
      .catch(e => this.setState({ error: translate('NETWORK_PROBLEM') }))
  }

  setNewVote(newStorage, rating) {
    this.updateLocalVotes(newStorage)
    this.setState({ rating })
  }

  render() {
    return (
      <div>
        <ReactStars size={20} value={this.state.rating} onChange={this.vote} />
        {this.state.error && <p className="vote-error">{this.state.error}</p>}
      </div>
    )
  }
}
