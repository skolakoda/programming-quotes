import {Component, useId, useState} from 'react'
import {API, useServerData} from '../../config/api'
import {LS} from '../../config/localstorage'
import translate from '../../shared/translate'
import './Stars.css'

function Rating({value, editable, disabled, onChange}) {
  const name = useId()
  const [preview, setPreview] = useState(null)
  const rating = Number.isFinite(Number(value)) ? Math.max(0, Math.min(5, Number(value))) : 0
  const displayed = disabled ? rating : preview ?? rating
  const label = `${translate('RATING')}: ${rating} / 5`

  return (
    <div className="rating" role={editable ? 'radiogroup' : 'img'} aria-label={label}
      onMouseLeave={() => setPreview(null)}>
      {[1, 2, 3, 4, 5].map(star => (
        <span className="rating-star" key={star}>
          <span aria-hidden="true">★</span>
          <span className="rating-fill" aria-hidden="true"
            style={{width: `${Math.max(0, Math.min(1, displayed - star + 1)) * 100}%`}}>★</span>
          {editable && [star - 0.5, star].map(score => (
            <input key={score} type="radio" name={name} value={score}
              aria-label={`${score} / 5`} checked={Math.round(rating * 2) / 2 === score}
              disabled={disabled} className={score === star ? 'rating-right' : 'rating-left'}
              onChange={() => {}}
              onClick={() => { setPreview(null); onChange(score) }}
              onMouseEnter={() => { if (!disabled) setPreview(score) }}
              onFocus={() => setPreview(score)} onBlur={() => setPreview(null)} />
          ))}
        </span>
      ))}
    </div>
  )
}

function readVotes() {
  try {
    const votes = JSON.parse(localStorage.getItem(LS.ratings))
    return Array.isArray(votes) ? votes : []
  } catch {
    return []
  }
}

export default class Stars extends Component {
  constructor(props) {
    super(props)
    this.state = {rating: Number(props.rating), error: '', pending: false}
    this.requestId = 0
  }

  componentDidUpdate(previous) {
    if (previous.id !== this.props.id || previous.rating !== this.props.rating) {
      this.requestId++
      this.setState({rating: Number(this.props.rating), error: '', pending: false})
    }
  }

  componentWillUnmount() {
    this.requestId++
  }

  vote = async newVote => {
    if (!useServerData || this.state.pending) return
    const localVotes = readVotes()
    if (localVotes.includes(this.props.id))
      return this.setState({error: translate('CAN_VOTE_ONCE')})

    const id = this.props.id
    const requestId = ++this.requestId
    this.setState({pending: true, error: ''})
    try {
      const response = await fetch(API.vote, {
        method: 'POST',
        body: JSON.stringify({quoteId: id, token: localStorage.getItem(LS.token), newVote}),
        headers: {'content-type': 'application/json'}
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      const returnedRating = result.quote?.rating
      const rating = Number(returnedRating)
      if (returnedRating == null || returnedRating === '' || !Number.isFinite(rating) || rating < 0 || rating > 5)
        throw new Error('Invalid rating')
      localStorage.setItem(LS.ratings, JSON.stringify([...new Set([...readVotes(), id])]))
      if (requestId === this.requestId) this.setState({rating, pending: false})
    } catch {
      if (requestId === this.requestId)
        this.setState({error: translate('NETWORK_PROBLEM'), pending: false})
    }
  }

  render() {
    return (
      <div>
        <Rating value={this.state.rating} editable={useServerData}
          disabled={this.state.pending} onChange={this.vote} />
        {this.state.error && <p className="vote-error" role="alert">{this.state.error}</p>}
      </div>
    )
  }
}
