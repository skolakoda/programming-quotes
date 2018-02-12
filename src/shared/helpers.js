export function findProp(obj, prop) {
  for (const property in obj) {
    if (property === prop) return obj[property]
    if (typeof obj[property] === 'object')
      return findProp(obj[property], prop)
  }
}

export function fetchImage(title, size, callback) {
  fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=${size}&origin=*`)
    .then(response => response.json())
    .then(obj => {
      const imgSrc = findProp(obj, 'source') || 'images/unknown.jpg'
      callback(imgSrc)
    })
}

export function vote(id, ocena) {
  const data = {
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
      } else {
        return 'NOTOK'
      }
    })
}
