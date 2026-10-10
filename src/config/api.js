export const useServerData = process.env.REACT_APP_DATA_MODE === 'server'

const defaultDomain = process.env.REACT_APP_ENV === 'development'
  ? 'http://localhost:5000'
  : 'https://programming-quotes-api.herokuapp.com'

export const domain = (process.env.REACT_APP_API_URL || defaultDomain).replace(/\/+$/, '')

export const API = {
  create: `${domain}/quotes/`,
  read: `${domain}/quotes/`,
  update: `${domain}/quotes/`,
  delete: `${domain}/quotes/`,
  vote: `${domain}/quotes/vote/`,
}
