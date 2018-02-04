export function findProp(obj, prop) {
  for (var property in obj) {
    if (property === prop) return obj[property]
    if (typeof obj[property] === "object")
      return findProp(obj[property], prop)
  }
}

export function vote(id, ocena) {
  let data = {
      _id: id,
      novaOcena: ocena
  }
  return fetch('https://baza-podataka.herokuapp.com/oceni-citat/', {
      method: 'POST',
      body: JSON.stringify(data), 
      headers: new Headers({
        'Content-Type': 'application/json'
      })
  })
  .then(response => {
      if(response.status < 400) {
          return 'OK'
      }
  })
}
