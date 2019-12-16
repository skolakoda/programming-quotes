const citati = require('./filtrirano.json')
console.log(citati)

citati.forEach(citat => {
  const { ms } = citat
  if (!ms) return
  if (!ms.includes(':')) citat.ms = 'Ješua rěče: \n' + ms
  console.log(citat)
})
