import {getallImages} from '../shared/helpers'

export const setAllQuotes = allQuotes => ({type: 'SET_ALL_QUOTES', allQuotes})

export const setAllAuthors = allAuthors => ({type: 'SET_ALL_AUTHORS', allAuthors})

export const setAllImages = allImages => ({type: 'SET_ALL_IMAGES', allImages})

export const setPhrase = phrase => ({type: 'SET_PHRASE', phrase})

export const setLanguage = language => ({type: 'SET_LANGUAGE', language})

/* THUNK */

export const getAuthorThumbs = allAuthors => dispatch => {
  const wikiApiLimit = 50
  const authors = [...allAuthors]
  const promises = []
  for (let i = 0; i < authors.length; i += wikiApiLimit)
    promises.push(getallImages(authors.slice(i, i + wikiApiLimit))
      .catch(() => new Map()))
  return Promise.all(promises)
    .then(data =>
      dispatch(setAllImages(data.reduce((a, b) => new Map([...a, ...b]), new Map())))
    )
}
