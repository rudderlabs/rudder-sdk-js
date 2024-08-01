## [![Release](https://img.shields.io/npm/v/%40rudderstack/analytics-js-service-worker)](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/%40rudderstack/analytics-js-service-worker) ![npm](https://img.shields.io/npm/dw/%40rudderstack/analytics-js-service-worker)

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

# @rudderstack/analytics-js-service-worker

RudderStack JavaScript SDK service worker that can be used in browser extensions and serverless runtimes.
It exposes the same interface and features as the [Node.js SDK](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-node-sdk/).

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).

## Table of Contents

- [**Installing the package**](#installing-the-package)
- [**Usage in Chrome Extensions**](#usage-in-chrome-extensions)
- [**Usage in Serverless Runtimes**](#usage-in-serverless-runtimes)
- [**How to build the SDK**](#how-to-build-the-sdk)

## Installing the package

To install the package via NPM, run the following command:

```bash
npm install @rudderstack/analytics-js-service-worker --save
```

```js
import { Analytics } from '@rudderstack/analytics-js-service-worker';

const rudderClient = new Analytics('<WRITE_KEY>', '<DATA_PLANE_URL>');
```

| Note that this NPM module is only meant to be used for a service worker usage. If you want to integrate RudderStack with your Node.js application, refer to the [**RudderStack Node.js repository**](https://github.com/rudderlabs/rudder-sdk-node). |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Usage in Chrome Extensions

RudderStack JS SDK can be used in Chrome Extensions with manifest v3, both as a content script (via the JavaScript SDK package) or as a background script service worker (via the [service worker package](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker)).

For more details, see [Chrome Extensions Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/chrome-extension/USAGE.md).

## Usage in Serverless runtimes

RudderStack JS SDK [service worker](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker) can be used in serverless runtimes like Cloudflare Workers or Vercel Edge functions.

For more details, see:

- [Vercel Edge Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)
- [Cloudflare Worker Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)

## How to build the SDK

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:package`: This command outputs the **dist/npm** folder that contains the NPM package contents.

## License

This project is licensed under the Elastic License 2.0. See the [LICENSE.md](LICENSE.md) file for details. Review the license terms to understand your permissions and restrictions.

If you have any questions about licensing, please [contact us](#contact-us) or refer to the [official Elastic licensing](https://www.elastic.co/licensing/elastic-license) page.

## Contribute

We invite you to contribute to this project. For more information on how to contribute, please see [**here**](../../CONTRIBUTING.md).

## Contact us

For more information on any of the sections covered in this readme, you can [**contact us**](mailto:%20docs@rudderstack.com) or start a conversation on our [**Slack**](https://resources.rudderstack.com/join-rudderstack-slack) channel.

## Follow Us

- [RudderStack Blog][rudderstack-blog]
- [Slack][slack]
- [Twitter][twitter]
- [LinkedIn][linkedin]
- [dev.to][devto]
- [Medium][medium]
- [YouTube][youtube]
- [HackerNews][hackernews]
- [Product Hunt][producthunt]

## :clap: Our Supporters

[![Stargazers repo roster for @rudderlabs/rudder-sdk-js](https://reporoster.com/stars/rudderlabs/rudder-sdk-js)](https://github.com/rudderlabs/rudder-sdk-js/stargazers)

[![Forkers repo roster for @rudderlabs/rudder-sdk-js](https://reporoster.com/forks/rudderlabs/rudder-sdk-js)](https://github.com/rudderlabs/rudder-sdk-js/network/members)

<!----variables---->

[rudderstack-blog]: https://rudderstack.com/blog/
[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[twitter]: https://twitter.com/rudderstack
[linkedin]: https://www.linkedin.com/company/rudderlabs/
[devto]: https://dev.to/rudderstack
[medium]: https://rudderstack.medium.com/
[youtube]: https://www.youtube.com/channel/UCgV-B77bV_-LOmKYHw8jvBw
[hackernews]: https://news.ycombinator.com/item?id=21081756
[producthunt]: https://www.producthunt.com/posts/rudderstack
