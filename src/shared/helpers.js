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
  return fetch('https://baza-podataka.herokuapp.com/oceni-citat/', {
    method: 'POST',
    body: JSON.stringify({
      _id: id,
      novaOcena: ocena
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(response => response.status < 400 ? 'OK' : 'NOTOK')
    // response vraca novi prosek
}
