import {useId, useState} from 'react'
import {LS} from '../../config/localstorage'
import translate from '../../shared/translate'
import './Stars.css'

function Rating({value, onChange}) {
  const name = useId()
  const [preview, setPreview] = useState(null)
  const rating = Number.isFinite(Number(value)) ? Math.max(0, Math.min(5, Number(value))) : 0
  const displayed = preview ?? rating
  const label = `${translate('RATING')}: ${rating} / 5`

  return (
    <div className="rating" role="radiogroup" aria-label={label}
      onMouseLeave={() => setPreview(null)}>
      {[1, 2, 3, 4, 5].map(star => (
        <span className="rating-star" key={star}>
          <span aria-hidden="true">★</span>
          <span className="rating-fill" aria-hidden="true"
            style={{width: `${Math.max(0, Math.min(1, displayed - star + 1)) * 100}%`}}>★</span>
          {[star - 0.5, star].map(score => (
            <input key={score} type="radio" name={name} value={score}
              aria-label={`${score} / 5`} checked={Math.round(rating * 2) / 2 === score}
              className={score === star ? 'rating-right' : 'rating-left'}
              onChange={() => {}}
              onClick={() => { setPreview(null); onChange(score) }}
              onMouseEnter={() => setPreview(score)}
              onFocus={() => setPreview(score)} onBlur={() => setPreview(null)} />
          ))}
        </span>
      ))}
    </div>
  )
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
  const ratings = readLocalRatings()
  const saved = Object.hasOwn(ratings, id) ? ratings[id] : undefined
  return typeof saved === 'number' && saved >= 0.5 && saved <= 5 && Number.isInteger(saved * 2)
    ? saved : Number(rating)
}

function VotingStars({id, initialRating}) {
  const [state, setState] = useState(() => ({rating: initialValue(id, initialRating), error: ''}))

  const vote = newVote => {
    try {
      localStorage.setItem(LS.localRatings, JSON.stringify({...readLocalRatings(), [id]: newVote}))
      setState({rating: newVote, error: ''})
    } catch {
      setState(previous => ({...previous, error: translate('STORAGE_PROBLEM')}))
    }
  }

  return (
    <div>
      <Rating value={state.rating} onChange={vote} />
      {state.error && <p className="vote-error" role="alert">{state.error}</p>}
    </div>
  )
}

export default function Stars({id, rating}) {
  return <VotingStars key={JSON.stringify([id, rating])} id={id} initialRating={rating} />
}
