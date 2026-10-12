import cachedQuotes from '../data/quotes.json'

const initialState = {
  allQuotes: cachedQuotes,
  allAuthors: new Set(cachedQuotes.map(quote => quote.author).sort()),
  allImages: new Map(),
  phrase: '',
  language: 'en',
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
    default:
      return state
  }
}
