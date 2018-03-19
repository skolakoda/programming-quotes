export const domain = (process.env.REACT_APP_NODE_ENV === 'local')
  ? 'http://localhost:5000'
  : 'https://baza-podataka.herokuapp.com'

export const API = {
  create: `${domain}/quotes/create/`,
  read: `${domain}/quotes/`,
  update: `${domain}/quotes/update/`,
  delete: `${domain}/quotes/delete/`,
  rate: `${domain}/quotes/rate/`,
  updateUserVotes: `${domain}/users/update-votes/`
}
