const fs = require('fs')
const citati = require('./citati.json')

const result = citati
  .map(citat => {
    const { ms, source } = citat
    if (!ms.includes(':')) citat.ms = 'Ješua rěče: \n' + ms
    citat.ms = source + '\n' + citat.ms + '\n'
    return citat.ms
  })
  .join('\n')

fs.writeFileSync('citati.txt', result)
