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
      const imgSrc = findProp(obj, 'source')
      callback(imgSrc)
    })
}
