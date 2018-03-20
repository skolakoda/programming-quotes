export function findValue(object, searchKey) {
  let value
  for (const key in object) {
    if (key === searchKey) return object[key]
    if (typeof object[key] === 'object') value = findValue(object[key], searchKey)
  }
  return value
}

export function fetchImage(title, size, callback) {
  fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=${size}&origin=*`)
    .then(response => response.json())
    .then(obj => {
      const imgSrc = findValue(obj, 'source')
      callback(imgSrc)
    })
}

/**
@param authors: array
@return Map(author name: image src)
*/
export function getallImages(authors) {
  return fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${authors.join('|')}&prop=pageimages&format=json&pithumbsize=50&origin=*`)
    .then(res => res.json())
    .then(res => {
      if (!res.query.pages) return
      const allImages = new Map()
      for (const key in res.query.pages) {
        const obj = res.query.pages[key]
        if (!obj.thumbnail) continue
        allImages.set(obj.title, obj.thumbnail.source)
      }
      return allImages
    })
}

export function checkToken(url, token, callback) {
  fetch(url)
    .then(response => response.json())
    .then(response => {
      if (response.user) callback(token, response.user.admin)
      else callback('', false)
    })
}
