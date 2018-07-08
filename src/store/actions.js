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
