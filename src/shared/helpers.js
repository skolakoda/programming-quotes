export function findValue(object, searchKey) {
  let value
  for (const key in object) {
    if (key === searchKey) return object[key]
    if (typeof object[key] === 'object') value = findValue(object[key], searchKey)
  }
  return value
}

export function fetchImage(title, size, callback) {
  fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=${size}&origin=*&pilicense=any`)
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
  const titles = encodeURIComponent(authors.join('|'))
  return fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${titles}&prop=pageimages&format=json&pithumbsize=50&origin=*&redirects=1&pilicense=any`)
    .then(res => {
      if (!res.ok) throw new Error(`Unable to load author images: ${res.status}`)
      return res.json()
    })
    .then(res => {
      if (!res.query || !res.query.pages) throw new Error('Missing author image results')
      const allImages = new Map()
      const imagesByTitle = new Map()
      for (const key in res.query.pages) {
        const obj = res.query.pages[key]
        if (!obj.thumbnail) continue
        imagesByTitle.set(obj.title, obj.thumbnail.source)
      }
      const normalized = new Map((res.query.normalized || []).map(({from, to}) => [from, to]))
      const redirects = new Map((res.query.redirects || []).map(({from, to}) => [from, to]))
      authors.forEach(author => {
        const title = normalized.get(author) || author
        const image = imagesByTitle.get(redirects.get(title) || title)
        if (image) allImages.set(author, image)
      })
      return allImages
    })
}
