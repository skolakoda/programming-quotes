import cachedQuotes from '../data/quotes.json'
import {LS} from '../config/localstorage'

const initialState = {
  isFetching: false,
  allQuotes: cachedQuotes,
  allAuthors: new Set(cachedQuotes.map(quote => quote.author).sort()),
  allImages: new Map(),
  phrase: '',
  language: 'en',
  // user
  token: localStorage.getItem(LS.token),
  admin: false,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_QUOTES_REQUEST':
      return {...state, isFetching: true }
    case 'FETCH_QUOTES_FAILURE':
      return {...state, isFetching: false, error: action.error }
    case 'FETCH_QUOTES_SUCCESS':
      return {...state, isFetching: false }
    case 'SET_ALL_QUOTES':
      return {...state, allQuotes: action.allQuotes }
    case 'SET_ALL_AUTHORS':
      return {...state, allAuthors: action.allAuthors }
    case 'SET_ALL_IMAGES':
      return {...state, allImages: action.allImages }
    case 'SET_PHRASE':
      return {...state, phrase: action.phrase }
    case 'SET_LANGUAGE':
      return {...state, language: action.language }
    case 'SET_TOKEN':
      return {...state, token: action.token }
    case 'SET_ADMIN':
      return {...state, admin: action.admin }
    default:
      return state
  }
}
