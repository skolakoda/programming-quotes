export function findProp(obj, prop) {
  for (var property in obj) {
    if (property === prop) return obj[property]
    if (typeof obj[property] === "object")
      return findProp(obj[property], prop)
  }
}

export function sortirajAbecedno(a, b) {
  return a > b ? 1 : (b > a ? -1 : 0)
}