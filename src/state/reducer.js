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
  switch (action.type) {
  case 'SET_QUOTES':
    return {...state, allQuotes: action.allQuotes}
  case 'SET_AUTHORS':
    return {...state, allAuthors: action.allAuthors}
  case 'SET_IMAGES':
    return {...state, allImages: action.allImages}
  case 'SET_PHASE':
    return {...state, phrase: action.phrase}
  case 'SET_LANGUAGE':
    return {...state, language: action.language}
  case 'SET_ADMIN':
    return {...state, admin: action.admin}
  default:
    return state
  }
}

export const store = createStore(reducer)
