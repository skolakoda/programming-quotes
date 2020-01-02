export const domain = process.env.REACT_APP_ENV === 'development'
  ? 'http://localhost:5000'
  : 'https://programming-quotes-api.herokuapp.com'

export const API = {
  create: `${domain}/svetemisli/`,
  read: `${domain}/svetemisli/`,
  update: `${domain}/svetemisli/`,
  delete: `${domain}/svetemisli/`,
  randomLang: `${domain}/svetemisli/random/lang/`, // + lang
}
