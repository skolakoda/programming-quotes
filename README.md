# Programming Quotes

**The Programming Quotes, an open source React app.**

See: [skolakoda.github.io/programming-quotes](https://skolakoda.github.io/programming-quotes/)

## Development

Use Node.js 22.22.2+, 24.15.0+, or 26+; then clone the repo and run:

```
npm install
npm start

```

The app runs at `http://localhost:3000`. 

## TODO

- statistika se ne prevodi pri promeni jezika (`translate()` čita globalni store, a komponenta se ne renderuje ponovo); rešenje: hook `useTranslate()` preko `useSelector`
- živi sajt i dalje prikazuje staru CRA verziju; trenutni Vite kod nije objavljen (`npm run deploy`)
- tekstovi koji zaobilaze prevod: „Gimme more!“, „View source on Github“, alt „loading...“
- izabrani jezik se gubi posle osvežavanja, a `<html lang>` i `lang` na tekstu citata se ne menjaju
- pretraga citata ne radi na početnoj strani i statistici; filter se primeni tek kad se ode na „All quotes“
- na mobilnom su pretraga i spisak autora ispod glavnog sadržaja
- straničenje: dugmad počinju od 0, 50 dugmadi bez oznake trenutne strane, strana se ne vraća na vrh
- pristupačnost: polja pretrage bez labela, svih 156 slika ima `alt="author"`
- greška u srpskom prevodu: „Pretraži authore“
- nema poruke „nije pronađeno“ za nepostojeću stranu, citat ili autora
- mrtav kod i zastarela podešavanja: `.eslintrc` bez eslinta, `browserslist`, `homepage`, `findValue`
- naslov strane se ne menja po ruti, nema `og:` opisa, manifest nema ikone za instalaciju

