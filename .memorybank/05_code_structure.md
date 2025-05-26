# Code Structure

This monorepo contains multiple packages, each serving a distinct role in the RudderStack JavaScript SDK ecosystem. Below is an overview of the main packages and their responsibilities.

---

## Monorepo Layout

```
packages/
  analytics-js/                # Main JavaScript SDK for browsers
  analytics-js-service-worker/ # SDK for service worker and serverless environments
  analytics-js-plugins/        # Optional plugins for the JS SDK (dynamic or bundled)
  analytics-js-integrations/   # Device mode integrations for third-party destinations
  analytics-js-cookies/        # Cookie utilities for browser and Node.js
  analytics-js-common/         # Shared code and utilities for SDK packages
  sanity-suite/                # Sanity suite for manual and automated testing
  loading-scripts/             # Loading script snippets for SDK initialization
  analytics-v1.1/              # Deprecated legacy SDK (for migration only)
```

---

## Package Descriptions

### `analytics-js`

- **Purpose:** The main JavaScript SDK for tracking events in browsers.
- **Exports:** Modern, bundled, and legacy builds for different browser environments.
- **Usage:** For websites, SPAs, and Chrome Extensions (content scripts).
- **Build Output:** `dist/` folder with CDN and NPM builds.

### `analytics-js-service-worker`

- **Purpose:** SDK for use in service workers, browser extensions (background scripts), and serverless runtimes.
- **Exports:** Service worker-compatible analytics client.
- **Usage:** Chrome Extensions (background), Cloudflare Workers, Vercel Edge, etc.

### `analytics-js-plugins`

- **Purpose:** Optional plugins for the JS SDK, loaded dynamically or bundled.
- **Usage:** Extend SDK features on demand (see [plugin docs](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#plugins)).

### `analytics-js-integrations`

- **Purpose:** Device mode integrations for third-party destinations.
- **Usage:** Bundled or loaded as needed to support direct client-side integrations.

### `analytics-js-cookies`

- **Purpose:** Cookie utilities for browser and Node.js environments.
- **Exports:** Functions for reading/decrypting RudderStack cookies, with support for both browser and Node.js.

### `analytics-js-common`

- **Purpose:** Shared code and utilities used by other SDK packages (analytics, plugins, integrations, service worker).

### `sanity-suite`

- **Purpose:** Sanity suite for manual and automated testing of the SDK.
- **Usage:** Used with the RudderStack client-side test framework.

### `loading-scripts`

- **Purpose:** Loading script snippets for initializing the SDK in various environments.

### `analytics-v1.1`

- **Purpose:** Deprecated legacy SDK. Only present for migration and backward compatibility.
- **Note:** New projects should use `analytics-js`.

---

## Notes

- All packages are written in TypeScript except for `analytics-v1.1` and `analytics-js-integrations`.
- Builds are output to each package's `dist/` directory.
- Shared utilities are factored into `analytics-js-common` to avoid duplication.
- The monorepo is managed with Nx (see `nx.json` in the root).
- For more details on each package, see the respective `README.md` in each package directory.
