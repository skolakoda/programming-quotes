export default function ucitaj(calback) {
  const http = new XMLHttpRequest()
  http.open("GET", "https://raw.githubusercontent.com/skolakoda/skolakoda.github.io/master/_data/quotes.json")
  http.send()
  http.onload = () => calback(JSON.parse(http.responseText))
}
