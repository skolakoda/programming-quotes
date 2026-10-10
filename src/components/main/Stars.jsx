import {useEffect, useId, useRef, useState} from 'react'
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

function readLocalRatings() {
  try {
    const ratings = JSON.parse(localStorage.getItem(LS.localRatings))
    return ratings && typeof ratings === 'object' && !Array.isArray(ratings) ? ratings : {}
  } catch {
    return {}
  }
}

function initialValue(id, rating) {
  if (useServerData) return Number(rating)
  const ratings = readLocalRatings()
  const saved = Object.hasOwn(ratings, id) ? ratings[id] : undefined
  return typeof saved === 'number' && saved >= 0.5 && saved <= 5 && Number.isInteger(saved * 2)
    ? saved : Number(rating)
}

function VotingStars({id, initialRating}) {
  const [state, setState] = useState(() => ({rating: initialValue(id, initialRating), error: '', pending: false}))
  const requestId = useRef(0)
  const pending = useRef(false)
  useEffect(() => () => { requestId.current++ }, [])

  const vote = async newVote => {
    if (!useServerData) {
      try {
        localStorage.setItem(LS.localRatings, JSON.stringify({...readLocalRatings(), [id]: newVote}))
        setState(previous => ({...previous, rating: newVote, error: ''}))
      } catch {
        setState(previous => ({...previous, error: translate('STORAGE_PROBLEM')}))
      }
      return
    }
    if (pending.current) return
    const localVotes = readVotes()
    if (localVotes.includes(id))
      return setState(previous => ({...previous, error: translate('CAN_VOTE_ONCE')}))

    const currentRequest = ++requestId.current
    pending.current = true
    setState(previous => ({...previous, pending: true, error: ''}))
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
      if (currentRequest === requestId.current) {
        pending.current = false
        setState(previous => ({...previous, rating, pending: false}))
      }
    } catch {
      if (currentRequest === requestId.current) {
        pending.current = false
        setState(previous => ({...previous, error: translate('NETWORK_PROBLEM'), pending: false}))
      }
    }
  }

  return (
    <div>
      <Rating value={state.rating} editable
        disabled={state.pending} onChange={vote} />
      {state.error && <p className="vote-error" role="alert">{state.error}</p>}
    </div>
  )
}

export default function Stars({id, rating}) {
  return <VotingStars key={JSON.stringify([id, rating])} id={id} initialRating={rating} />
}
