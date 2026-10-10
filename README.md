[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/skolakoda/programming-quotes/blob/master/LICENSE)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/skolakoda)

[![](screen.png)](https://skolakoda.github.io/programming-quotes/#/)

# Programming Quotes

**The Programming Quotes, an open source React app.**

See: [skolakoda.github.io/programming-quotes](https://skolakoda.github.io/programming-quotes/)

By default, quotes, author names, and ratings come directly from `src/data/quotes.json`. This local mode makes no requests to the quote server; ratings are read-only, and login and quote editing are hidden. Author images and biographies still load from English Wikipedia.

Server mode preserves login, voting, and quote editing using the [Programming Quotes API](https://github.com/skolakoda/programming-quotes-api). Start it with `npm run start:server` or build it with `npm run build:server`. It requires a running backend (by default `http://localhost:5000` in development). To use another server, set `REACT_APP_API_URL` in `.env.local`; the old production backend is no longer available. The mode can also be configured with `REACT_APP_DATA_MODE=local` or `REACT_APP_DATA_MODE=server` before starting or building.

## Development

Clone repo, then:

```
npm install
npm start

```

## How to contribute

See: [Contributing](CONTRIBUTING.md)

See also: [Documentation](https://github.com/skolakoda/programming-quotes/wiki)
