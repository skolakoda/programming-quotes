import {LS} from '../config/localstorage'
import {includes, getName, compare, isLang} from '../utils/helpers'

const initialState = {
  lang: localStorage.getItem(LS.lang) || 'ms',
  script: localStorage.getItem(LS.script) || 'kir',
  allQuotes: [],
  filteredQuotes: [],
  allAuthors: new Set(),
  filteredAuthors: [], // shown in sidebar
  selectedAuthors: new Set(), // selected from sidebar
  token: localStorage.getItem(LS.token),
  admin: false,
  phrase: '',
  authorPhrase: '',
  isFetching: false,
  translateMode: false,
}

export const reducer = (state = initialState, action) => {
  const {allQuotes, allAuthors, selectedAuthors, lang, translateMode, phrase} = state
  const {quote} = action

  const ifLang = q => isLang(q, lang, translateMode)
  const sortAbc = (a, b) => compare(getName(a, lang), getName(b, lang))

  switch (action.type) {
    case 'FETCH_QUOTES_REQUEST':
      return {...state, isFetching: true }
    case 'FETCH_QUOTES_SUCCESS': {
      const allAuthors = new Set()
      action.quotes.forEach(q => allAuthors.add(q.author))
      return {
        ...state,
        isFetching: false,
        allQuotes: action.quotes.sort(() => 0.5 - Math.random()),
        allAuthors: new Set([...allAuthors].sort(sortAbc)),
      }
    }
    case 'INIT': {
      const filteredQuotes = allQuotes.filter(q => ifLang(q))
      const filteredAuthors = new Set()
      filteredQuotes.forEach(q => filteredAuthors.add(q.author))
      return {
        ...state,
        filteredQuotes,
        filteredAuthors: [...filteredAuthors].sort(sortAbc)
      }
    }
    case 'FILTER_QUOTES': {
      const filteredQuotes = allQuotes.filter(q =>
        ifLang(q) &&
        (phrase ? includes(q[lang], phrase) : true) &&
        (selectedAuthors.size ? selectedAuthors.has(q.author) : true)
      )
      return {
        ...state,
        filteredQuotes
      }
    }
    case 'SET_LANGUAGE':
      return {...state, lang: action.lang}
    case 'SET_SCRIPT':
      return {...state, script: action.script }
    case 'SET_TOKEN':
      return {...state, token: action.token }
    case 'SET_ADMIN':
      return {...state, admin: action.admin }
    case 'SET_PHRASE':
      return {...state, phrase: action.phrase }
    case 'TOGGLE_TRANSLATE_MODE':
      return {...state, translateMode: !state.translateMode }
    case 'ADD_QUOTE':
      return {
        ...state,
        allQuotes: [...allQuotes, quote],
        filteredQuotes: allQuotes.filter(q => ifLang(q)),
        allAuthors: allAuthors.add(quote.author)
      }
    case 'UPDATE_QUOTE': {
      const newQuotes = allQuotes.map(q => q._id === quote._id ? quote : q)
      return {
        ...state,
        allQuotes: newQuotes,
        filteredQuotes: newQuotes.filter(q => ifLang(q))
      }
    }
    case 'DELETE_QUOTE': {
      const newQuotes = allQuotes.filter(q => q._id !== action._id)
      return {
        ...state,
        allQuotes: newQuotes,
        filteredQuotes: newQuotes.filter(q => ifLang(q))
      }
    }
    case 'FILTER_AUTHORS': {
      const filteredAuthors = [...allAuthors]
        .filter(name => includes(name, phrase) || includes(getName(name, lang), phrase))
      return {
        ...state,
        filteredAuthors,
        authorPhrase: phrase
      }
    }
    case 'TOGGLE_SELECTED_AUTHORS': {
      const {shouldAdd, value} = action
      const authors = new Set([...selectedAuthors])
      if (shouldAdd) authors.add(value)
      else authors.delete(value)
      return {
        ...state,
        selectedAuthors: authors
      }
    }
    default:
      return state
  }
}
