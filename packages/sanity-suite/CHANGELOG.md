# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.0.0-beta.15](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.14...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.15) (2023-10-27)


### Features

* consent api ([#1458](https://github.com/rudderlabs/rudder-sdk-js/issues/1458)) ([216b405](https://github.com/rudderlabs/rudder-sdk-js/commit/216b405f7c319d5ff2d799d2e3a5efe2ee4a03af))
* remove preload buffer for segment AnonymousId TC ([#1450](https://github.com/rudderlabs/rudder-sdk-js/issues/1450)) ([4ed8aff](https://github.com/rudderlabs/rudder-sdk-js/commit/4ed8afff1a155c9a37223202ccfcd213ef9c0d9a))


### Bug Fixes

* **analytics-js:** correct declared global extended type ([#1460](https://github.com/rudderlabs/rudder-sdk-js/issues/1460)) ([3f15290](https://github.com/rudderlabs/rudder-sdk-js/commit/3f1529037ba0541391b5f8033e37f867fdd7931c))
* **analytics-js:** fix remote import error when npm package is bundled with webpack ([#1466](https://github.com/rudderlabs/rudder-sdk-js/issues/1466)) ([3a818ac](https://github.com/rudderlabs/rudder-sdk-js/commit/3a818accd24e6b3667c75a6b60fb12aba36bdf7e))
* **monorepo:** update vulnerable dependencies ([#1457](https://github.com/rudderlabs/rudder-sdk-js/issues/1457)) ([7a4bc4c](https://github.com/rudderlabs/rudder-sdk-js/commit/7a4bc4cc641e4fff2a8f561ce6fd67d16c0cd5a0))
* upgrade vulnerable cryptoJS dependency, rolup to v4 & NX to v17 ([#1471](https://github.com/rudderlabs/rudder-sdk-js/issues/1471)) ([b2bb21c](https://github.com/rudderlabs/rudder-sdk-js/commit/b2bb21cb3f618f6c86f593d1706abe9e6349066d))

## [3.0.0-beta.14](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.13...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.14) (2023-10-16)


### Features

* **analytics-js-service-worker:** deprecate service worker export of rudder-sdk-js package  in favor of the new standalone package([#1437](https://github.com/rudderlabs/rudder-sdk-js/issues/1437)) ([1797d3e](https://github.com/rudderlabs/rudder-sdk-js/commit/1797d3ef356e947a528c2de9abcfde245cc28178))


### Bug Fixes

* **analytics-js-loading-scripts:** add globalThis polyfill for safari ([#1446](https://github.com/rudderlabs/rudder-sdk-js/issues/1446)) ([bf111f8](https://github.com/rudderlabs/rudder-sdk-js/commit/bf111f8fc24fe75d183ea4924423e3c560ce457d))
* **analytics-js-sanity-suite:** ignore more properties in API checks ([09eba42](https://github.com/rudderlabs/rudder-sdk-js/commit/09eba42f73e09a0f6a30526bb2682f863aecaad9))
* **analytics-js-sanity-suite:** remove the sticky header ([093bd5f](https://github.com/rudderlabs/rudder-sdk-js/commit/093bd5f56614a9de43245fa1dd6162c94fc09c34))
* **analytics-js:** add global definitions extended window type ([#1445](https://github.com/rudderlabs/rudder-sdk-js/issues/1445)) ([b995635](https://github.com/rudderlabs/rudder-sdk-js/commit/b995635a7a3979173d35b34fa32b41b4429b166f))

## [3.0.0-beta.13](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.12...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.13) (2023-10-02)

## [3.0.0-beta.12](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.11...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.12) (2023-09-26)

## [3.0.0-beta.11](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.10...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.11) (2023-09-26)

## [3.0.0-beta.10](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.9...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.10) (2023-09-20)

## [3.0.0-beta.9](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.8...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.9) (2023-09-19)

## [3.0.0-beta.8](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.7...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.8) (2023-09-18)

## [3.0.0-beta.7](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.6...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.7) (2023-09-14)

# [3.0.0-beta.6](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.5...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.6) (2023-08-30)


### Features

* add batching support to xhr plugin ([#1301](https://github.com/rudderlabs/rudder-sdk-js/issues/1301)) ([0421663](https://github.com/rudderlabs/rudder-sdk-js/commit/04216637a00dc5339cf466a586137415b46b6b49))
* add callback for polyfill load ([#1335](https://github.com/rudderlabs/rudder-sdk-js/issues/1335)) ([6ba9329](https://github.com/rudderlabs/rudder-sdk-js/commit/6ba932918dd03c110c92cd5837a2f8ca0f9cf192))





# [3.0.0-beta.5](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.4...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.5) (2023-08-21)


### Bug Fixes

* **analytics-js:** update context page details in every event creation ([#1317](https://github.com/rudderlabs/rudder-sdk-js/issues/1317)) ([45c2300](https://github.com/rudderlabs/rudder-sdk-js/commit/45c230094aceb8176d92e7958fcb6910ebc61248))





# [3.0.0-beta.4](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.3...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.4) (2023-08-17)

**Note:** Version bump only for package @rudderstack/analytics-js-sanity-suite





# [3.0.0-beta.3](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-sanity-suite@3.0.0-beta.2...@rudderstack/analytics-js-sanity-suite@3.0.0-beta.3) (2023-08-10)

**Note:** Version bump only for package @rudderstack/analytics-js-sanity-suite





# 3.0.0-beta.2 (2023-08-09)
