import {LS} from '../config/localstorage'
import {includes} from '../shared/helpers'

const initialState = {
  lang: localStorage.getItem(LS.lang) || 'sr',
  script: localStorage.getItem(LS.script) || 'lat',
  allQuotes: [],
  filteredQuotes: [],
  allAuthors: new Set(),
  thumbnails: new Map(),
  token: localStorage.getItem(LS.token),
  admin: false,
  phrase: '',
  authorPhrase: '',
  filteredAuthors: [],
  sidebarOpen: false,
  isFetching: false,
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
      return {...state, allQuotes: action.allQuotes, filteredQuotes: action.allQuotes }
    case 'SET_ALL_AUTHORS':
      return {...state, allAuthors: action.allAuthors, filteredAuthors: [...action.allAuthors] }
    case 'SET_THUMBNAILS':
      return {...state, thumbnails: action.thumbnails }
    case 'SET_LANGUAGE':
      return {...state, lang: action.lang }
    case 'SET_SCRIPT':
      return {...state, script: action.script }
    case 'SET_TOKEN':
      return {...state, token: action.token }
    case 'SET_ADMIN':
      return {...state, admin: action.admin }
    case 'ADD_QUOTE':
      return {...state, allQuotes: [...state.allQuotes, action.quote]}
    case 'UPDATE_QUOTE': {
      const allQuotes = state.allQuotes.map(q =>
        q._id === action.quote._id ? action.quote : q
      )
      return {...state, allQuotes}
    }
    case 'DELETE_QUOTE': {
      const allQuotes = state.allQuotes.filter(q => q._id !== action._id)
      return {...state, allQuotes}
    }
    case 'FILTER_AUTHORS': {
      const filteredAuthors = [...state.allAuthors].filter(name => includes(name, action.phrase))
      return {...state, filteredAuthors, authorPhrase: action.phrase }
    }
    case 'FILTER_QUOTES': {
      const filteredQuotes = state.allQuotes.filter(quote => includes(quote[state.lang], action.phrase))
      return {...state, filteredQuotes, phrase: action.phrase }
    }
    default:
      return state
  }
}
