const fs = require('fs')
const quotes = require('./quotes.json')

const results = quotes.map(quote => {
  if (quote.sr.includes(' u '))
    quote.sr.replace('/ u /g', ' v ')
  return quote
})

fs.writeFileSync('quotes2.json', JSON.stringify(results, null, 2))
