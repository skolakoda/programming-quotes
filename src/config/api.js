// 'http://localhost:5000'
export const domain = 'https://baza-podataka.herokuapp.com'

export const API = {
  create: `${domain}/quotes/create/`,
  read: `${domain}/quotes/`,
  update: `${domain}/quotes/update/`,
  delete: `${domain}/quotes/delete/`,
  rate: `${domain}/quotes/rate/`,
  updateUserVotes: `${domain}/users/update-votes/`
}
