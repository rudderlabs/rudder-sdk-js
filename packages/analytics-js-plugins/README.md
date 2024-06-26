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

# @rudderstack/analytics-js-plugins

RudderStack JavaScript SDK plugins code that is used within the related analytics package, bundles for the legacy packaging or as separate bundle chunks for dynamic imports.

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).

## Table of Contents

- [**List of plugins**](#list-of-plugins)
- [**How to build the plugins**](#how-to-build-the-plugins)

## List of plugins

Plugins are JavaScript SDK v3 features that you can optionally load on demand. A full list of available plugins can be explored [here](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#plugins).

## How to build the plugins

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser:modern`: This outputs the **dist/cdn** folder that contains the CDN package contents.
  - `npm run build:npm`: This outputs the **dist/npm** folder that contains the NPM package contents.

## License

This project is licensed under the terms of the Elastic License 2.0. Please see the [LICENSE.md](LICENSE.md) file for license rights and limitations. We recommend that you review the license terms to understand the permissions and restrictions that apply.

If you have any questions about licensing, please [contact us](#contact-us) or refer to the [official Elastic licensing](https://www.elastic.co/licensing/elastic-license) page.

## Contribute

We would love to see you contribute to this project. Get more information on how to contribute [**here**](../../CONTRIBUTING.md).

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
