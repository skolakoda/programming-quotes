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

Use Node.js 22.22.2+, 24.15.0+, or 26+; then clone the repo and run:

```
npm install
npm start

```

The app runs at `http://localhost:3000`. Vite handles development and production builds; `npm test` runs the regression tests with Vitest, and `npm run test:watch` keeps them running while you work. `npm run build` still writes to `build/` with the GitHub Pages path `/programming-quotes/`.

## Refreshing local data and publishing

Run `npm run save` to replace `src/data/quotes.json` with quotes from the configured server. It reads `REACT_APP_API_URL` from the environment or Vite's server-mode env files (including `.env.local`), defaulting to `http://localhost:5000`. You can also pass a complete endpoint: `npm run save -- https://your-server.example/quotes/`.

The download must succeed and return a non-empty list of valid quotes before the local file is replaced. HTTP errors, invalid JSON, and invalid quote data leave the existing file intact. Review the data changes before committing them.

`npm run deploy` builds the application and publishes `build/` to the `gh-pages` branch of the repository's `origin` remote. It requires Git and permission to push to that repository.

The publishing wrapper stores its Git cache in the system temporary directory to avoid long Windows paths. `gh-pages` is kept on the 6.1 patch line because the newer 6.2/6.3 releases currently bring in vulnerable dependencies.

## How to contribute

See: [Contributing](CONTRIBUTING.md)

See also: [Documentation](https://github.com/skolakoda/programming-quotes/wiki)
