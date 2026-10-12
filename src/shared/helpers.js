// Author keys are Wikipedia titles, which may end with a disambiguation such as "(programmer)".
export function displayName(author) {
  return author.replace(/ \([^)]*\)$/, '')
}

export function findValue(object, searchKey) {
  let value
  for (const key in object) {
    if (key === searchKey) return object[key]
    if (typeof object[key] === 'object') value = findValue(object[key], searchKey)
  }
  return value
}

export function fetchImage(title, size, callback) {
  return fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=${size}&origin=*&pilicense=any&redirects=1`)
    .then(response => {
      if (!response.ok) throw new Error(`Unable to load author image: ${response.status}`)
      return response.json()
    })
    .then(obj => {
      if (!obj.query || !obj.query.pages) throw new Error('Missing author image results')
      const page = Object.values(obj.query.pages).find(page => page.thumbnail)
      const imgSrc = page && page.thumbnail.source
      if (callback) callback(imgSrc)
      return imgSrc
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
