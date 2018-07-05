import {LS} from '../config/localstorage'
import translate from '../shared/translate'

const initialState = {
  allQuotes: [],
  allAuthors: new Set(),
  allImages: new Map(),
  phrase: '',
  language: translate.currentLanguage,
  token: localStorage.getItem(LS.token),
  admin: false
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
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
    case 'SET_USER':
      return {...state, token: action.token, admin: action.admin }
    default:
      return state
  }
}

export const setAllQuotes = allQuotes => ({type: 'SET_ALL_QUOTES', allQuotes})

export const setAllAuthors = allAuthors => ({type: 'SET_ALL_AUTHORS', allAuthors})

export const setAllImages = allImages => ({type: 'SET_ALL_IMAGES', allImages})

export const setPhrase = phrase => ({type: 'SET_PHRASE', phrase})

export const setLanguage = language => ({type: 'SET_LANGUAGE', language})

export const setToken = token => ({type: 'SET_TOKEN', token})

export const setAdmin = admin => ({type: 'SET_ADMIN', admin})

export const setUser = (token, admin = false) => ({
  type: 'SET_USER',
  token,
  admin
})