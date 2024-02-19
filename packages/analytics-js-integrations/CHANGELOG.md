# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.0.0-beta.24](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.23...@rudderstack/analytics-js-integrations@3.0.0-beta.24) (2024-02-16)


### Features

* onboard new destination commandbar ([#1610](https://github.com/rudderlabs/rudder-sdk-js/issues/1610)) ([a034c21](https://github.com/rudderlabs/rudder-sdk-js/commit/a034c21929bd1d7bdc8c6d27d3f92b2d3c421ae3))


### Bug Fixes

* replace lodash.pick with ramda to avoid vulnerabilities ([#1615](https://github.com/rudderlabs/rudder-sdk-js/issues/1615)) ([af9fc16](https://github.com/rudderlabs/rudder-sdk-js/commit/af9fc164612ab9c18656b016a32cc83bf43d9f8f))

## [3.0.0-beta.23](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.22...@rudderstack/analytics-js-integrations@3.0.0-beta.23) (2024-02-08)


### Bug Fixes

* reddit pixel isLoaded ([#1607](https://github.com/rudderlabs/rudder-sdk-js/issues/1607)) ([da40a76](https://github.com/rudderlabs/rudder-sdk-js/commit/da40a76758d7c36b88018afd13dc99ebea359e19))

## [3.0.0-beta.22](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.21...@rudderstack/analytics-js-integrations@3.0.0-beta.22) (2024-02-02)


### Bug Fixes

* appcues to support flattening obj/array for identify ([#1598](https://github.com/rudderlabs/rudder-sdk-js/issues/1598)) ([25b4924](https://github.com/rudderlabs/rudder-sdk-js/commit/25b492436d4de5d6364507b0e728722a340591d4))
* integrations bugsnag alerts ([#1596](https://github.com/rudderlabs/rudder-sdk-js/issues/1596)) ([a5a1c0b](https://github.com/rudderlabs/rudder-sdk-js/commit/a5a1c0bf155e91062fec6b2b77131d066cb961c2))

## [3.0.0-beta.21](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.20...@rudderstack/analytics-js-integrations@3.0.0-beta.21) (2024-01-19)


### Features

* adding proxy server url for amplitude ([#1590](https://github.com/rudderlabs/rudder-sdk-js/issues/1590)) ([988a146](https://github.com/rudderlabs/rudder-sdk-js/commit/988a146037e9929259acf94000951edd546df91e))
* onboard new destination spotify pixel ([#1567](https://github.com/rudderlabs/rudder-sdk-js/issues/1567)) ([92de4e0](https://github.com/rudderlabs/rudder-sdk-js/commit/92de4e01b6da989126061844c3f8f8ebe05caaf8))


### Bug Fixes

* bugsnag alert for google ads ([#1576](https://github.com/rudderlabs/rudder-sdk-js/issues/1576)) ([42e9fd3](https://github.com/rudderlabs/rudder-sdk-js/commit/42e9fd32e33fe7331e83bfbebb050d090315dae2))
* ga4 page call mappings ([#1579](https://github.com/rudderlabs/rudder-sdk-js/issues/1579)) ([6deb94c](https://github.com/rudderlabs/rudder-sdk-js/commit/6deb94ce2e367750ed8406732f979a6f5082e24e))
* **googleads:** added validation to discard event if event name is no event name is present ([#1570](https://github.com/rudderlabs/rudder-sdk-js/issues/1570)) ([3bd4eb6](https://github.com/rudderlabs/rudder-sdk-js/commit/3bd4eb65016c72ddd9f84a0d56363dd7df2ca8d9))

## [3.0.0-beta.20](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.19...@rudderstack/analytics-js-integrations@3.0.0-beta.20) (2024-01-08)


### Features

* amplitude add support for unset ([#1562](https://github.com/rudderlabs/rudder-sdk-js/issues/1562)) ([22b79cd](https://github.com/rudderlabs/rudder-sdk-js/commit/22b79cd51e5c17c8eb26c5bdfd9f06e1decf18bd))


### Bug Fixes

* **analytics-js-integrations:** remove updating user_properties as part of loadScript call for ga4 ([#1527](https://github.com/rudderlabs/rudder-sdk-js/issues/1527)) ([8667d17](https://github.com/rudderlabs/rudder-sdk-js/commit/8667d1789b56852d332bd54af2489b7d7e5909ff))
* **analytics-js-integrations:** resolved tech debt items ([#1523](https://github.com/rudderlabs/rudder-sdk-js/issues/1523)) ([6924f6c](https://github.com/rudderlabs/rudder-sdk-js/commit/6924f6c1e49336e6b8dbc604bfd8cf5d9322944a))
* **clevertap:** region undefined issue ([#1557](https://github.com/rudderlabs/rudder-sdk-js/issues/1557)) ([9f1fc0d](https://github.com/rudderlabs/rudder-sdk-js/commit/9f1fc0d1939e4abc439c8d02dd790745f1efe519))
* infinite recursion error by tracking visited nodes ([#1541](https://github.com/rudderlabs/rudder-sdk-js/issues/1541)) ([d006eb7](https://github.com/rudderlabs/rudder-sdk-js/commit/d006eb708b7bacfdb2571bbb4841a0f1f2e67bc3))
* tiktok add missing field brand ([#1561](https://github.com/rudderlabs/rudder-sdk-js/issues/1561)) ([dd08664](https://github.com/rudderlabs/rudder-sdk-js/commit/dd086640a05da480d579b1580aad110b14c6165d))
* tiktok remove lowercasing for custom events ([#1558](https://github.com/rudderlabs/rudder-sdk-js/issues/1558)) ([09e00f6](https://github.com/rudderlabs/rudder-sdk-js/commit/09e00f668240a9443115a24f86d3f68f91efb95c))


### Reverts

* Revert "fix: tiktok add missing field brand" (#1571) ([5d11ebb](https://github.com/rudderlabs/rudder-sdk-js/commit/5d11ebbd44b50839b727a6ae028ae5b6f95bd2d1)), closes [#1571](https://github.com/rudderlabs/rudder-sdk-js/issues/1571) [#1561](https://github.com/rudderlabs/rudder-sdk-js/issues/1561)

## [3.0.0-beta.19](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.18...@rudderstack/analytics-js-integrations@3.0.0-beta.19) (2023-12-14)


### Bug Fixes

* **bing_ads:** name and display name import ([#1553](https://github.com/rudderlabs/rudder-sdk-js/issues/1553)) ([371e4b4](https://github.com/rudderlabs/rudder-sdk-js/commit/371e4b419c306d79cec728dd3533c2aaec7f2bed))

## [3.0.0-beta.18](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.17...@rudderstack/analytics-js-integrations@3.0.0-beta.18) (2023-12-13)


### Features

* tiktok_ads: add support for custom events ([#1542](https://github.com/rudderlabs/rudder-sdk-js/issues/1542)) ([98bcdf7](https://github.com/rudderlabs/rudder-sdk-js/commit/98bcdf7aaaec1ed4512352d8fb8982312c1fcef3))
* updated logger utility across all integrations ([#1434](https://github.com/rudderlabs/rudder-sdk-js/issues/1434)) ([1e23c30](https://github.com/rudderlabs/rudder-sdk-js/commit/1e23c30e219108ac7671f85913dab5ce6f33ed56))


### Bug Fixes

* add check to disallow track events without event name ([#1538](https://github.com/rudderlabs/rudder-sdk-js/issues/1538)) ([c9c128a](https://github.com/rudderlabs/rudder-sdk-js/commit/c9c128a9eb45070d0e5dcd41594b8aea0ffadd90))

## [3.0.0-beta.17](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.16...@rudderstack/analytics-js-integrations@3.0.0-beta.17) (2023-12-01)


### Features

* adding set_once feature for Mixpanel ([#1497](https://github.com/rudderlabs/rudder-sdk-js/issues/1497)) ([60f9f6f](https://github.com/rudderlabs/rudder-sdk-js/commit/60f9f6f657121131e8eab4cbdcafefa00c11cc9a))
* **analytics-js-loading-scripts:** add loading snippet version in event context ([#1483](https://github.com/rudderlabs/rudder-sdk-js/issues/1483)) ([4873cbc](https://github.com/rudderlabs/rudder-sdk-js/commit/4873cbc183879c0c1825cf939a53b6cf570cdf4e))

## [3.0.0-beta.16](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.15...@rudderstack/analytics-js-integrations@3.0.0-beta.16) (2023-11-13)


### Features

* add support for EU residency server for Amplitude web device mode ([#1490](https://github.com/rudderlabs/rudder-sdk-js/issues/1490)) ([8e844bd](https://github.com/rudderlabs/rudder-sdk-js/commit/8e844bdf9f7a8ea971c4c86453b4ca2261a7ed7e))
* **analytics-js-integrations:** add in-app message in customerIo ([#1476](https://github.com/rudderlabs/rudder-sdk-js/issues/1476)) ([812542e](https://github.com/rudderlabs/rudder-sdk-js/commit/812542e5e5f0438f9a452cd5b913917fad14c889))
* braze upgrade v5 ([#1481](https://github.com/rudderlabs/rudder-sdk-js/issues/1481)) ([c81544e](https://github.com/rudderlabs/rudder-sdk-js/commit/c81544e75eaf5d2590aab019485b39b42dc677df))
* hybrid mode braze ([#1480](https://github.com/rudderlabs/rudder-sdk-js/issues/1480)) ([8b9ab0c](https://github.com/rudderlabs/rudder-sdk-js/commit/8b9ab0c3dd2411903418c35e76e1bfb1a735545c))
* onboard sprig destination ([#1491](https://github.com/rudderlabs/rudder-sdk-js/issues/1491)) ([2fb7d5c](https://github.com/rudderlabs/rudder-sdk-js/commit/2fb7d5c98cb7a73d692b1d56bd55dd4e6cc08b2b))
* update tests and send delivery_category as part of contents for Purchase event ([#1503](https://github.com/rudderlabs/rudder-sdk-js/issues/1503)) ([028ac3c](https://github.com/rudderlabs/rudder-sdk-js/commit/028ac3cdff2276e2e7f041af37e28f436c9b7460))
* vwo integration update ([#1472](https://github.com/rudderlabs/rudder-sdk-js/issues/1472)) ([068e6f6](https://github.com/rudderlabs/rudder-sdk-js/commit/068e6f63e1f453113cd1fa43a10410023b7d05d0))


### Bug Fixes

* remove unused newCustomer config ([#1482](https://github.com/rudderlabs/rudder-sdk-js/issues/1482)) ([39ded6e](https://github.com/rudderlabs/rudder-sdk-js/commit/39ded6efa3516eec1d3fe6a2aba430336baed47c))

## [3.0.0-beta.15](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.14...@rudderstack/analytics-js-integrations@3.0.0-beta.15) (2023-10-27)


### Features

* matomo: support premise version ([#1461](https://github.com/rudderlabs/rudder-sdk-js/issues/1461)) ([29ab5f7](https://github.com/rudderlabs/rudder-sdk-js/commit/29ab5f70d30d0ed11b3d5fbe519c624ce21787c9))


### Bug Fixes

* amplitude: configs not reffered ([#1470](https://github.com/rudderlabs/rudder-sdk-js/issues/1470)) ([7e456f0](https://github.com/rudderlabs/rudder-sdk-js/commit/7e456f0a8466d5bb4af950439581adccccb00153))
* **monorepo:** update vulnerable dependencies ([#1457](https://github.com/rudderlabs/rudder-sdk-js/issues/1457)) ([7a4bc4c](https://github.com/rudderlabs/rudder-sdk-js/commit/7a4bc4cc641e4fff2a8f561ce6fd67d16c0cd5a0))
* upgrade vulnerable cryptoJS dependency, rolup to v4 & NX to v17 ([#1471](https://github.com/rudderlabs/rudder-sdk-js/issues/1471)) ([b2bb21c](https://github.com/rudderlabs/rudder-sdk-js/commit/b2bb21cb3f618f6c86f593d1706abe9e6349066d))

## [3.0.0-beta.14](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.13...@rudderstack/analytics-js-integrations@3.0.0-beta.14) (2023-10-16)


### Features

* add new customer acquisition reporting to google ads ([#1432](https://github.com/rudderlabs/rudder-sdk-js/issues/1432)) ([5bf9eed](https://github.com/rudderlabs/rudder-sdk-js/commit/5bf9eed34e3709255411de09c319da4074ae9535))
* **analytics-js-service-worker:** deprecate service worker export of rudder-sdk-js package  in favor of the new standalone package([#1437](https://github.com/rudderlabs/rudder-sdk-js/issues/1437)) ([1797d3e](https://github.com/rudderlabs/rudder-sdk-js/commit/1797d3ef356e947a528c2de9abcfde245cc28178))


### Bug Fixes

* gracefully handling state property for pages where optimizely is not loaded ([#1441](https://github.com/rudderlabs/rudder-sdk-js/issues/1441)) ([8725cc6](https://github.com/rudderlabs/rudder-sdk-js/commit/8725cc60c35c80803eaf08df562c413bcdb21882))


### Reverts

* Revert "chore: remove duplicate config named eventWhiteList" (#1452) ([80f397f](https://github.com/rudderlabs/rudder-sdk-js/commit/80f397fe6b5dc1668b7e8e1b04df1ae1f7b5febf)), closes [#1452](https://github.com/rudderlabs/rudder-sdk-js/issues/1452) [#1430](https://github.com/rudderlabs/rudder-sdk-js/issues/1430)

## [3.0.0-beta.13](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.12...@rudderstack/analytics-js-integrations@3.0.0-beta.13) (2023-10-02)


### Features

* **Amplitude:** update amplitude SDK  ([#1413](https://github.com/rudderlabs/rudder-sdk-js/issues/1413)) ([6636770](https://github.com/rudderlabs/rudder-sdk-js/commit/6636770be8d1406f6d8d5f6621f81d97056a3852)), closes [#1228](https://github.com/rudderlabs/rudder-sdk-js/issues/1228)


### Bug Fixes

* **ga4:** override pii property values to null ([#1420](https://github.com/rudderlabs/rudder-sdk-js/issues/1420)) ([3697f6d](https://github.com/rudderlabs/rudder-sdk-js/commit/3697f6d145ad7670ab2123c7e7ad863f741d8116))
* **ga4:** remove sendUserTraitsAsPartOfInIt field ([#1419](https://github.com/rudderlabs/rudder-sdk-js/issues/1419)) ([033efeb](https://github.com/rudderlabs/rudder-sdk-js/commit/033efebf3d50e75883349612048bed7d8d4f854b))

## [3.0.0-beta.12](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.11...@rudderstack/analytics-js-integrations@3.0.0-beta.12) (2023-09-29)


### Features

* **analytics-js-integrations:** ga4 enhancements ([#1417](https://github.com/rudderlabs/rudder-sdk-js/issues/1417)) ([1012bd7](https://github.com/rudderlabs/rudder-sdk-js/commit/1012bd72611b6c3c329baa324d4b42192dc447e9))

## [3.0.0-beta.11](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.10...@rudderstack/analytics-js-integrations@3.0.0-beta.11) (2023-09-26)


### Features

* **analytics-js-integrations:** add support of ignore_dnt to mixpanel ([#1390](https://github.com/rudderlabs/rudder-sdk-js/issues/1390)) ([9050b43](https://github.com/rudderlabs/rudder-sdk-js/commit/9050b43e0623a66727d40f71f8dd87ac026ab2ce))

## [3.0.0-beta.10](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.9...@rudderstack/analytics-js-integrations@3.0.0-beta.10) (2023-09-20)


### Bug Fixes

* **analytics-js-integrations:** path to moengage name import ([25b9ec7](https://github.com/rudderlabs/rudder-sdk-js/commit/25b9ec73331b57d41b97a6a760419b8cf9e822e7))

## [3.0.0-beta.9](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.8...@rudderstack/analytics-js-integrations@3.0.0-beta.9) (2023-09-20)


### Bug Fixes

* **analytics-js-integrations:** make wishlistevent not required ([e9aaebc](https://github.com/rudderlabs/rudder-sdk-js/commit/e9aaebc425ece021746d7bb2ce7e71d6524edd12))

## [3.0.0-beta.8](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.7...@rudderstack/analytics-js-integrations@3.0.0-beta.8) (2023-09-18)


### Features

* deprecate support of common names for integrations ([#1374](https://github.com/rudderlabs/rudder-sdk-js/issues/1374)) ([f1d097d](https://github.com/rudderlabs/rudder-sdk-js/commit/f1d097d9976f6c9d2ad0f1d81d469148f8c7c197))

## [3.0.0-beta.7](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.6...@rudderstack/analytics-js-integrations@3.0.0-beta.7) (2023-09-14)

# [3.0.0-beta.6](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.5...@rudderstack/analytics-js-integrations@3.0.0-beta.6) (2023-08-30)


### Bug Fixes

* use utility to determine destination specific integration options ([#1330](https://github.com/rudderlabs/rudder-sdk-js/issues/1330)) ([e4fce0d](https://github.com/rudderlabs/rudder-sdk-js/commit/e4fce0dd4b77c5b15459594bab3c9874a5549010))





# [3.0.0-beta.5](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.4...@rudderstack/analytics-js-integrations@3.0.0-beta.5) (2023-08-21)

**Note:** Version bump only for package @rudderstack/analytics-js-integrations





# [3.0.0-beta.4](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.3...@rudderstack/analytics-js-integrations@3.0.0-beta.4) (2023-08-17)


### Bug Fixes

* **analytics-js-integrations:** fix rollup alias config ([e8960dc](https://github.com/rudderlabs/rudder-sdk-js/commit/e8960dc65bc29f70e5d04c3ed89bce3fb4b6f369))





# [3.0.0-beta.3](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-integrations@3.0.0-beta.2...@rudderstack/analytics-js-integrations@3.0.0-beta.3) (2023-08-10)

**Note:** Version bump only for package @rudderstack/analytics-js-integrations





# 3.0.0-beta.2 (2023-08-09)


### Bug Fixes

* config url deduction ([#1282](https://github.com/rudderlabs/rudder-sdk-js/issues/1282)) ([658dc24](https://github.com/rudderlabs/rudder-sdk-js/commit/658dc24e077035898871888bfd4c72e88f16deb2))
* use destination display name throughout the app ([#1269](https://github.com/rudderlabs/rudder-sdk-js/issues/1269)) ([6e6a18c](https://github.com/rudderlabs/rudder-sdk-js/commit/6e6a18c5248654963130e24d94191350292a5f58))
