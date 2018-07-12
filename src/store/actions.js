import {getallImages} from '../shared/helpers'
import {LS} from '../config/localstorage'
import {API, domain} from '../config/api'

export const fetchQuotesRequest = () => ({type: 'FETCH_QUOTES_REQUEST'})

export const fetchQuotesFailure = error => ({type: 'FETCH_QUOTES_FAILURE', error})

export const fetchQuotesSuccess = () => ({type: 'FETCH_QUOTES_SUCCESS'})

export const setAllQuotes = allQuotes => ({type: 'SET_ALL_QUOTES', allQuotes})

export const setAllAuthors = allAuthors => ({type: 'SET_ALL_AUTHORS', allAuthors})

export const setAllImages = allImages => ({type: 'SET_ALL_IMAGES', allImages})

export const setPhrase = phrase => ({type: 'SET_PHRASE', phrase})

export const setLanguage = language => ({type: 'SET_LANGUAGE', language})

export const setToken = token => ({type: 'SET_TOKEN', token})

export const setAdmin = admin => ({type: 'SET_ADMIN', admin})

export const setName = name => ({type: 'SET_NAME', name})

/* THUNK */

export const setUser = (token, admin = false, name = '') => dispatch => {
  dispatch(setToken(token))
  dispatch(setAdmin(admin))
  dispatch(setName(name))
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

export const fetchQuotes = () => dispatch => {
  dispatch(fetchQuotesRequest(API.read))
  return fetch(API.read)
    .then(response => response.json(), error => fetchQuotesFailure(error))
    .then(json => {
      dispatch(fetchQuotesSuccess())
      dispatch(initState(json))
    })
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
