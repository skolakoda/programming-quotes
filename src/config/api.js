// http://localhost:5000
// https://baza-podataka.herokuapp.com
export const domain = 'https://baza-podataka.herokuapp.com'

export const API = {
  create: `${domain}/thoughts/create/`,
  read: `${domain}/thoughts/`,
  update: `${domain}/thoughts/update/`,
  delete: `${domain}/thoughts/delete/`,
  rate: `${domain}/thoughts/rate/`,
  updateUserVotes: `${domain}/users/update-votes/`
}
