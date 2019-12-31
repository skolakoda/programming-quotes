import { useSelector } from 'react-redux'

import quotes from '../data/quotes.json'
import translations from '../data/translations'
import {getallImages} from '../shared/helpers'
import transliterate from '../shared/transliterate'
import {LS} from '../config/localstorage'
import {API, domain} from '../config/api'

export const fetchQuotesRequest = () => ({type: 'FETCH_QUOTES_REQUEST'})

export const fetchQuotesFailure = error => ({type: 'FETCH_QUOTES_FAILURE', error})

export const fetchQuotesSuccess = () => ({type: 'FETCH_QUOTES_SUCCESS'})

export const setAllQuotes = allQuotes => ({type: 'SET_ALL_QUOTES', allQuotes})

export const setAllAuthors = allAuthors => ({type: 'SET_ALL_AUTHORS', allAuthors})

export const setAllImages = allImages => ({type: 'SET_ALL_IMAGES', allImages})

export const setPhrase = phrase => ({type: 'SET_PHRASE', phrase})

export const setLang = lang => {
  localStorage.setItem(LS.lang, lang)
  return { type: 'SET_LANGUAGE', lang }
}

export const setScript = script => {
  localStorage.setItem(LS.script, script)
  return { type: 'SET_SCRIPT', script }
}

export const setToken = token => ({type: 'SET_TOKEN', token})

export const setAdmin = admin => ({type: 'SET_ADMIN', admin})

export const addQuote = quote => ({type: 'ADD_QUOTE', quote})

export const updateQuote = quote => ({type: 'UPDATE_QUOTE', quote})

export const deleteQuote = _id => ({type: 'DELETE_QUOTE', _id})

/* THUNK */

export const setUser = (token, admin = false) => dispatch => {
  dispatch(setToken(token))
  dispatch(setAdmin(admin))
}

export const logout = () => dispatch => {
  dispatch(setToken(''))
  dispatch(setAdmin(false))
}

export const getAuthorThumbs = allAuthors => dispatch => {
  const wikiApiLimit = 50
  const promises = []
  for (let i = 0; i < [...allAuthors].length; i += wikiApiLimit)
    promises.push(getallImages([...allAuthors].slice(i, i + wikiApiLimit)))
  Promise.all(promises)
    .then(data =>
      dispatch(setAllImages(data.reduce((a, b) => new Map([...a, ...b]))))
    )
}

export const initState = allQuotes => dispatch => {
  dispatch(setAllQuotes(allQuotes))
  const allAuthors = new Set(allQuotes.map(quote => quote.author).sort())
  dispatch(setAllAuthors(allAuthors))
  dispatch(getAuthorThumbs(allAuthors))
}

export const fetchQuotes = () => async dispatch => {
  dispatch(fetchQuotesRequest(API.read))
  try {
    const response = await fetch(API.read)
    const json = await response.json()
    dispatch(fetchQuotesSuccess())
    dispatch(initState(json))
  } catch (error) {
    console.log('nema interneta, ucitavam backup')
    dispatch(initState(quotes))
  }
}

export const checkUser = () => (dispatch, getState) => {
  const {token} = getState()
  if (!token) return
  const service = localStorage.getItem(LS.service)
  fetch(`${domain}/auth/${service}/${token}`)
    .then(response => response.json())
    .then(response => {
      dispatch(setUser(
        response.user ? token : '',
        response.user ? response.user.admin : false)
      )
    })
}

export const useTranslate = () => {
  const {lang, script} = useSelector(state => state)
  return key => (translations[lang][key])
    ? transliterate(translations[lang][key], script, lang)
    : key
}

export const useTransliterate = () => {
  const {lang, script} = useSelector(state => state)
  return text => transliterate(text, script, lang)
}
