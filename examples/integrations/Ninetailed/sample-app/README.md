# RudderStack + Ninetailed (Vite + React + TypeScript)

This sample app sends RudderStack events to the Ninetailed device-mode destination. It initializes [`@ninetailed/experience.js`](https://www.npmjs.com/package/@ninetailed/experience.js) in `src/ninetailed.ts`, which registers `window.ninetailed` for the destination to forward `page`, `track` and `identify` calls to.

It has two entry pages:

- `index.html` loads the SDK from npm (`@rudderstack/analytics-js`) through `src/useRudderAnalytics.ts`. This is the recommended setup for production.
- `cdn.html` loads the SDK from the CDN with the loading snippet and calls `load` in `src/cdn.tsx`.

Enable the Ninetailed destination in device mode on the source whose write key you use.

## Getting Started

From the repository root, set the write key, data plane URL and config server host in `.env` and generate this app's `.env`:

```bash
./scripts/setup-examples-env.sh
```

Then install dependencies and start the development server:

```bash
npm run setup
npm start
```

Open [http://localhost:5173](http://localhost:5173) for the npm variant or [http://localhost:5173/cdn.html](http://localhost:5173/cdn.html) for the CDN variant, and use the buttons to send events.

## Available Scripts

- `npm start` / `npm run dev` - start the Vite development server
- `npm run build` - type-check and build both pages to `dist`
- `npm run lint` - run ESLint
- `npm run verify` - start the app against the mock control and data plane servers in `examples/utils/mock-servers`
