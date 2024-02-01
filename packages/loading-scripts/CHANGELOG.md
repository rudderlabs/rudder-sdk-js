# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.0.0-beta.18](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.17...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.18) (2024-01-19)

## [3.0.0-beta.17](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.16...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.17) (2024-01-08)

## [3.0.0-beta.16](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.15...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.16) (2023-12-13)

## [3.0.0-beta.15](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.14...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.15) (2023-12-06)

## [3.0.0-beta.14](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.13...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.14) (2023-12-01)


### Features

* **analytics-js-loading-scripts:** add loading snippet version in event context ([#1483](https://github.com/rudderlabs/rudder-sdk-js/issues/1483)) ([4873cbc](https://github.com/rudderlabs/rudder-sdk-js/commit/4873cbc183879c0c1825cf939a53b6cf570cdf4e))

## [3.0.0-beta.13](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.12...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.13) (2023-11-13)

## [3.0.0-beta.12](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.11...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.12) (2023-10-27)


### Features

* consent api ([#1458](https://github.com/rudderlabs/rudder-sdk-js/issues/1458)) ([216b405](https://github.com/rudderlabs/rudder-sdk-js/commit/216b405f7c319d5ff2d799d2e3a5efe2ee4a03af))


### Bug Fixes

* **analytics-js:** correct declared global extended type ([#1460](https://github.com/rudderlabs/rudder-sdk-js/issues/1460)) ([3f15290](https://github.com/rudderlabs/rudder-sdk-js/commit/3f1529037ba0541391b5f8033e37f867fdd7931c))
* upgrade vulnerable cryptoJS dependency, rolup to v4 & NX to v17 ([#1471](https://github.com/rudderlabs/rudder-sdk-js/issues/1471)) ([b2bb21c](https://github.com/rudderlabs/rudder-sdk-js/commit/b2bb21cb3f618f6c86f593d1706abe9e6349066d))

## [3.0.0-beta.11](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.10...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.11) (2023-10-16)


### Features

* **analytics-js-service-worker:** deprecate service worker export of rudder-sdk-js package  in favor of the new standalone package([#1437](https://github.com/rudderlabs/rudder-sdk-js/issues/1437)) ([1797d3e](https://github.com/rudderlabs/rudder-sdk-js/commit/1797d3ef356e947a528c2de9abcfde245cc28178))


### Bug Fixes

* **analytics-js-loading-scripts:** add globalThis polyfill for safari ([#1446](https://github.com/rudderlabs/rudder-sdk-js/issues/1446)) ([bf111f8](https://github.com/rudderlabs/rudder-sdk-js/commit/bf111f8fc24fe75d183ea4924423e3c560ce457d))

## [3.0.0-beta.10](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.9...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.10) (2023-09-26)

## [3.0.0-beta.9](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.8...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.9) (2023-09-20)

## [3.0.0-beta.8](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-scripts@3.0.0-beta.7...@rudderstack/analytics-js-loading-scripts@3.0.0-beta.8) (2023-09-18)


### Features

* deprecate support of common names for integrations ([#1374](https://github.com/rudderlabs/rudder-sdk-js/issues/1374)) ([f1d097d](https://github.com/rudderlabs/rudder-sdk-js/commit/f1d097d9976f6c9d2ad0f1d81d469148f8c7c197))

## 3.0.0-beta.7 (2023-09-14)


### Features

* add batching support to xhr plugin ([#1301](https://github.com/rudderlabs/rudder-sdk-js/issues/1301)) ([0421663](https://github.com/rudderlabs/rudder-sdk-js/commit/04216637a00dc5339cf466a586137415b46b6b49))
* add callback for polyfill load ([#1335](https://github.com/rudderlabs/rudder-sdk-js/issues/1335)) ([6ba9329](https://github.com/rudderlabs/rudder-sdk-js/commit/6ba932918dd03c110c92cd5837a2f8ca0f9cf192))
* **analytics-js-plugins:** new beacon queue plugin ([#1173](https://github.com/rudderlabs/rudder-sdk-js/issues/1173)) ([9e4602b](https://github.com/rudderlabs/rudder-sdk-js/commit/9e4602b67c7ce1345023388e09c3701820f71091))
* loading snippet ([#1149](https://github.com/rudderlabs/rudder-sdk-js/issues/1149)) ([e0320fe](https://github.com/rudderlabs/rudder-sdk-js/commit/e0320feb090c826b2eeb920538bae6c97cd30e61))
* refactor apis ([#1240](https://github.com/rudderlabs/rudder-sdk-js/issues/1240)) ([4f25a03](https://github.com/rudderlabs/rudder-sdk-js/commit/4f25a0377ef438a4e4b5dcad6f2504ec5da5f7a3))
* rename sdk file name ([#1190](https://github.com/rudderlabs/rudder-sdk-js/issues/1190)) ([0167e38](https://github.com/rudderlabs/rudder-sdk-js/commit/0167e384a05e1fa33b3da3b940f3952ee06ef21e))


### Bug Fixes

* **analytics-js:** fix issues with tracking methods overloads ([#1164](https://github.com/rudderlabs/rudder-sdk-js/issues/1164)) ([718f9a9](https://github.com/rudderlabs/rudder-sdk-js/commit/718f9a9bf9e24fa203cfe9cec835528c91ed955f))
* error reporting ([#1285](https://github.com/rudderlabs/rudder-sdk-js/issues/1285)) ([1b9324e](https://github.com/rudderlabs/rudder-sdk-js/commit/1b9324e0be38eecbc25cb08be7650d8c1e474d35))

# [3.0.0-beta.6](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-script@3.0.0-beta.5...@rudderstack/analytics-js-loading-script@3.0.0-beta.6) (2023-08-30)


### Features

* add batching support to xhr plugin ([#1301](https://github.com/rudderlabs/rudder-sdk-js/issues/1301)) ([0421663](https://github.com/rudderlabs/rudder-sdk-js/commit/04216637a00dc5339cf466a586137415b46b6b49))
* add callback for polyfill load ([#1335](https://github.com/rudderlabs/rudder-sdk-js/issues/1335)) ([6ba9329](https://github.com/rudderlabs/rudder-sdk-js/commit/6ba932918dd03c110c92cd5837a2f8ca0f9cf192))





# [3.0.0-beta.5](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-script@3.0.0-beta.4...@rudderstack/analytics-js-loading-script@3.0.0-beta.5) (2023-08-21)

**Note:** Version bump only for package @rudderstack/analytics-js-loading-script





# [3.0.0-beta.4](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-script@3.0.0-beta.3...@rudderstack/analytics-js-loading-script@3.0.0-beta.4) (2023-08-17)

**Note:** Version bump only for package @rudderstack/analytics-js-loading-script





# [3.0.0-beta.3](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-loading-script@3.0.0-beta.2...@rudderstack/analytics-js-loading-script@3.0.0-beta.3) (2023-08-10)

**Note:** Version bump only for package @rudderstack/analytics-js-loading-script





# 3.0.0-beta.2 (2023-08-09)


### Bug Fixes

* **analytics-js:** fix issues with tracking methods overloads ([#1164](https://github.com/rudderlabs/rudder-sdk-js/issues/1164)) ([718f9a9](https://github.com/rudderlabs/rudder-sdk-js/commit/718f9a9bf9e24fa203cfe9cec835528c91ed955f))
* error reporting ([#1285](https://github.com/rudderlabs/rudder-sdk-js/issues/1285)) ([1b9324e](https://github.com/rudderlabs/rudder-sdk-js/commit/1b9324e0be38eecbc25cb08be7650d8c1e474d35))


### Features

* **analytics-js-plugins:** new beacon queue plugin ([#1173](https://github.com/rudderlabs/rudder-sdk-js/issues/1173)) ([9e4602b](https://github.com/rudderlabs/rudder-sdk-js/commit/9e4602b67c7ce1345023388e09c3701820f71091))
* loading snippet ([#1149](https://github.com/rudderlabs/rudder-sdk-js/issues/1149)) ([e0320fe](https://github.com/rudderlabs/rudder-sdk-js/commit/e0320feb090c826b2eeb920538bae6c97cd30e61))
* refactor apis ([#1240](https://github.com/rudderlabs/rudder-sdk-js/issues/1240)) ([4f25a03](https://github.com/rudderlabs/rudder-sdk-js/commit/4f25a0377ef438a4e4b5dcad6f2504ec5da5f7a3))
* rename sdk file name ([#1190](https://github.com/rudderlabs/rudder-sdk-js/issues/1190)) ([0167e38](https://github.com/rudderlabs/rudder-sdk-js/commit/0167e384a05e1fa33b3da3b940f3952ee06ef21e))
