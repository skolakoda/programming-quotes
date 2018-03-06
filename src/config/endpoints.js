const domain = (process.env.NODE_ENV === 'development')
  ? 'http://localhost:5000'
  : 'https://baza-podataka.herokuapp.com'

export const API = {
  create: `${domain}/dodaj-citat/`,
  read: `${domain}/citati/`,
  update: `${domain}/azuriraj-citat/`,
  delete: `${domain}/obrisi-citat/`,
  rate: `${domain}/oceni-citat/`
}
