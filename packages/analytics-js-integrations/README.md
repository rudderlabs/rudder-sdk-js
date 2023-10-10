## [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://rudderstack.com/">
    <img alt="RudderStack" width="512" src="https://raw.githubusercontent.com/rudderlabs/rudder-sdk-js/develop/assets/rs-logo-full-light.jpg">
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

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-integrations/README.md#@rudderstack-analytics-js-integrations)@rudderstack/analytics-js-integrations

RudderStack Javascript SDK integrations code that is used to support device mode integrations.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-integrations/README.md#how-to-build-the-sdk)How to build the plugins

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser`: This outputs **dist/cdn** folder that contains the cdn package contents.
