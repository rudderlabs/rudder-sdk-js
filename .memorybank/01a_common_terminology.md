# Common Terminology

This document defines common terms used within the RudderStack ecosystem, JavaScript SDK and this repository.

## General RudderStack Terms

- **Source**: The origin of event data, e.g., a website, mobile app.
  - _In this repository_: The JavaScript SDK is a source.
- **Destination**: A third-party tool or platform where RudderStack sends event data, e.g., Google Analytics, Mixpanel, a data warehouse.
- **Event**: A single data record representing an action or occurrence, e.g., `page` view, `track` click, `identify` user.
- **Event Stream**: The flow of event data from a source to one or more destinations.
- **Data Plane URL**: The RudderStack backend endpoint where the SDK sends event data. This is unique to a RudderStack workspace.
- **Write Key**: A unique identifier for a specific source configuration in RudderStack. It authorizes the SDK to send data to your RudderStack backend.
- **Device Mode**: A method of sending data to destinations where the SDK loads the destination's native SDK directly on the client-side (browser).
- **Cloud Mode**: A method of sending data to destinations where the SDK sends data to the RudderStack backend, which then transforms and forwards it to the destination's API.
- **Connections**: The configured linkage between a source and a destination in the RudderStack dashboard, defining how data flows.

## SDK Specific Terms

- **`rudderanalytics` (or `rudderAnalytics`)**: The global object or imported module instance of the RudderStack JavaScript SDK.
- **`load()`**: The primary SDK method used to initialize and configure the SDK with a `Write Key` and `Data Plane URL`.
- **Event Calls**: Specific methods to send data:
  - **`page()`**: Tracks a page view. Can include page name, category, and properties.
  - **`track()`**: Tracks a custom user action or event. Includes an event name and optional properties.
  - **`identify()`**: Associates a user with their actions and records traits about them. Includes a `userId` and optional user traits.
  - **`group()`**: Associates a user with a group (e.g., company, organization). Includes a `groupId` and optional group traits.
  - **`alias()`**: Merges two user identities, typically an anonymous user with a newly identified user.
  - **`screen()`**: (Primarily for mobile) Tracks a screen view. While available in JS SDK, `page()` is more common for web.
- **Traits**: Attributes or characteristics of a user (e.g., `email`, `name`, `plan`) or a group.
- **Properties**: Attributes or characteristics associated with a `track` or `page` event.
- **`anonymousId`**: A unique identifier automatically assigned by the SDK to an anonymous (unidentified) user.
- **`userId`**: A unique identifier you assign to a user once they are known (e.g., after login).
- **Integrations**: Modules that transform RudderStack event data into a format that can be sent to a destination.
- **Plugins**: Optional SDK features that can extend the SDK's functionality based on the configuration and browser capabilities.
- **Consent Management**: An optional feature that allows you to manage user consent for event tracking, often related to privacy regulations like GDPR.
- **Polyfills**: Code used to provide modern functionality on older browsers that do not natively support it. The SDK can optionally load third-party polyfills.
- **Content Script**: In the context of Chrome Extensions, a script that runs in the context of a web page.
- **Background Script**: In the context of Chrome Extensions, a script that runs in the background, managing extension logic and state.

## Monorepo/Build Terms

- **NPM Package**: The distributable unit of code (`@rudderstack/analytics-js`).
- **CDN (Content Delivery Network)**: A common way to deliver the SDK artifacts to websites for faster loading.
- **CJS (CommonJS)**: A module format, often used in Node.js and for legacy browser bundles (e.g., `node_modules/@rudderstack/analytics-js/dist/npm/legacy/cjs/index.js`).
- **ESM (ECMAScript Modules)**: The standard module format for JavaScript, used for modern browser bundles (e.g., `node_modules/@rudderstack/analytics-js/dist/npm/modern/cjs/index.js` - note: the path might actually point to an ESM build despite `cjs` in the path for modern, need to verify exact modern paths).
- **Minified**: A version of the SDK script that has been processed to reduce its file size for faster downloads.
- **Legacy Bundle**: An SDK bundle targeted for older browsers that may not support modern JavaScript syntax.
- **Modern Bundle**: An SDK bundle targeted for newer browsers that support modern JavaScript syntax, like dynamic imports.
- **Nx**: A build system and monorepo management tool, likely used in this repository.
