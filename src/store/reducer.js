import {LS} from '../config/localstorage'
import {includes, getName, compare} from '../utils/helpers'

const initialState = {
  lang: localStorage.getItem(LS.lang) || 'ms',
  script: localStorage.getItem(LS.script) || 'kir',
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
    case 'INIT': {
      const {lang} = state
      const allQuotes = action.quotes.sort(() => 0.5 - Math.random())

      let allAuthors = new Set()
      let filteredAuthors = new Set()
      const filteredQuotes = allQuotes.filter(q => {
        if (q[lang]) filteredAuthors.add(q.author)
        allAuthors.add(q.author)
        return q[lang]
      })
      allAuthors = [...allAuthors].sort((a, b) => compare(getName(a, lang), getName(b, lang)))
      filteredAuthors = [...filteredAuthors].sort((a, b) => compare(getName(a, lang), getName(b, lang)))

      return {
        ...state,
        allQuotes,
        filteredQuotes,
        allAuthors: new Set(allAuthors),
        filteredAuthors
      }
    }
    case 'SET_THUMBNAILS':
      return {...state, thumbnails: action.thumbnails }
    case 'SET_LANGUAGE':
      const {lang} = action
      const filteredAuthors = new Set()
      const filteredQuotes = state.allQuotes.filter(q => {
        if (q[lang]) filteredAuthors.add(q.author)
        return q[lang]
      })
      const sortedAuthors = [...filteredAuthors]
        .sort((a, b) => compare(getName(a, lang), getName(b, lang)))

      return {
        ...state,
        lang,
        filteredQuotes,
        filteredAuthors: sortedAuthors
      }
    case 'SET_SCRIPT':
      return {...state, script: action.script }
    case 'SET_TOKEN':
      return {...state, token: action.token }
    case 'SET_ADMIN':
      return {...state, admin: action.admin }
    case 'ADD_QUOTE':
      const allQuotes = [...state.allQuotes, action.quote]
      return {
        ...state,
        allQuotes,
        filteredQuotes: allQuotes.filter(q => q[state.lang]),
        allAuthors: state.allAuthors.add(action.quote.author)
      }
    case 'UPDATE_QUOTE': {
      const allQuotes = state.allQuotes.map(q =>
        q._id === action.quote._id ? action.quote : q
      )
      return {
        ...state,
        allQuotes,
        filteredQuotes: allQuotes.filter(q => q[state.lang])
      }
    }
    case 'DELETE_QUOTE': {
      const allQuotes = state.allQuotes.filter(q => q._id !== action._id)
      return {
        ...state,
        allQuotes,
        filteredQuotes: allQuotes.filter(q => q[state.lang])
      }
    }
    case 'FILTER_AUTHORS': {
      const filteredAuthors = [...state.allAuthors].filter(name => includes(name, action.phrase))
      return {
        ...state,
        filteredAuthors,
        authorPhrase: action.phrase
      }
    }
    case 'FILTER_QUOTES': {
      const filteredQuotes = state.allQuotes.filter(q => includes(q[state.lang], action.phrase))
      return {
        ...state,
        filteredQuotes,
        phrase: action.phrase
      }
    }
    default:
      return state
  }
}
