## [![Release](https://img.shields.io/npm/v/%40rudderstack/analytics-js-plugins)](https://www.npmjs.com/package/@rudderstack/analytics-js-plugins) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/%40rudderstack/analytics-js-plugins) ![npm](https://img.shields.io/npm/dw/%40rudderstack/analytics-js-plugins)

<p align="center">
  <a href="https://rudderstack.com/">
    <img src="https://user-images.githubusercontent.com/59817155/121357083-1c571300-c94f-11eb-8cc7-ce6df13855c9.png">
  </a>
  <br />
  <caption>The Customer Data Platform for Developers</caption>
</p>
<p align="center">
  <b>
    <a href="https://rudderstack.com">Website</a>
    ·
    <a href="https://rudderstack.com/docs/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk/">Documentation</a>
    ·
    <a href="https://rudderstack.com/join-rudderstack-slack-community">Community Slack</a>
  </b>
</p>

---

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-plugins/README.md#@rudderstack-analytics-js-plugins)@rudderstack/analytics-js-plugins

RudderStack Javascript SDK plugins code that is used within the related analytics package, bundles for the legacy packaging or as separate bundle chunks for dynamic imports.

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).

## Table of Contents

- [**Installing the package**](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-plugins/README.md#installing-the-package)
- [**List of plugins**](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-plugins/README.md#list-of-plugins)

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-plugins/README.md#installing-the-package)Installing the package

To install the package via npm, run the following command:

```bash
npm install @rudderstack/analytics-js-plugins --save
```

**Note that this NPM module is only meant to be used for a browser installation**. If you want to integrate RudderStack with your Node.js application, refer to the [**RudderStack Node.js repository**](https://github.com/rudderlabs/rudder-sdk-node).

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-plugins/README.md#list-of-plugins)List of plugins

1. **BeaconQueue**: This plugin uses browser’s **Beacon** utility to send a batch of events to the data plane instead of a single event per request. More info: [here](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/javascript-sdk-enhancements/#sending-events-using-beacon)
2. **ConsentManager**: This plugin acts as the manager of different consent providers such as OneTrust, Ketch, etc.
3. **DeviceModeDestinations**: A plugin to load configured device mode destinations.
4. **DeviceModeTransformation**: A plugin to transform events before sending them to device mode destinations. Only available for enterprise customers.
5. **ErrorReporting**: This plugin report errors (and metrics in the future) to Rudderstack (only enabled for the free tier at the moment). Currently, it utilizes Bugsnag Native SDK to capture errors.
6. **ExternalAnonymousId**: This plugin helps customers migrate their anonymous user Ids to Rudderstack’s anonymous Id. More info: [here](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#anonymousidoptions)
7. **GoogleLinker**: This plugin loads user session data and anonymousId with Google linker for AMP URL query params.
8. **NativeDestinationQueue**: This plugin stores incoming events in a queue and sends them to the device mode destination.
9. **StorageEncryption**: This plugin is a lightweight alternative to encrypt/decrypt data before storing it in cookies/local storage.
10. **StorageEncryptionLegacy**: This plugin is the existing way to encrypt/decrypt data before storing it in cookies/local storage.
11. **StorageMigrator**: This plugin helps stored data to migrate from one encryption type to another(StorageEncryption/StorageEncryptionLegacy).
12. **XhrQueue**: This plugin stores incoming events in a queue and sends requests to the data plane as **XMLHttpRequest** with a localstorage retry mechanism**.**
13. **OneTrust**: A plugin to integrate the OneTrust consent manager. More info: [here](https://www.rudderstack.com/docs/sources/event-streams/sdks/onetrust/javascript/)
14. **Bugsnag**: A plugin to integrate Bugsnag as an error reporting provider (only enabled for free tier at the moment).
15. **Ketch**: A plugin to integrate the Ketch consent manager.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-plugins/README.md#how-to-build-the-sdk)How to build the plugins

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser:modern`: This outputs **dist/cdn** folder that contains the cdn package contents.
  - `npm run build:npm`: This outputs **dist/npm** folder that contains the npm package contents.
