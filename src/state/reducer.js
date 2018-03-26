import { createStore } from 'redux'
import translate from '../shared/translate'
import {LS} from '../config/localstorage'

const intialState = {
  allQuotes: [],
  allAuthors: new Set(),
  allImages: new Map(),
  phrase: '',
  language: translate.currentLanguage,
  token: localStorage.getItem(LS.token),
  admin: false
}

const reducer = (state = intialState, action) => {
  if (action.type === 'SET_QUOTES') return {...state, allQuotes: action.allQuotes}
  if (action.type === 'SET_AUTHORS') return {...state, allAuthors: action.allAuthors}
  if (action.type === 'SET_IMAGES') return {...state, allImages: action.allImages}
  if (action.type === 'SET_PHASE') return {...state, phrase: action.phrase}
  if (action.type === 'SET_LANGUAGE') return {...state, language: action.language}
  if (action.type === 'SET_ADMIN') return {...state, admin: action.admin}
  return state
}

export const store = createStore(reducer)
