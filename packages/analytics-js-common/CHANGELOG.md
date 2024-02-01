# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.0.0-beta.16](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.15...@rudderstack/analytics-js-common@3.0.0-beta.16) (2024-01-19)


### Features

* attach global error listeners ([#1586](https://github.com/rudderlabs/rudder-sdk-js/issues/1586)) ([b416897](https://github.com/rudderlabs/rudder-sdk-js/commit/b416897445c0e27b13853af44ed203daefd3f720))
* onboard new destination spotify pixel ([#1567](https://github.com/rudderlabs/rudder-sdk-js/issues/1567)) ([92de4e0](https://github.com/rudderlabs/rudder-sdk-js/commit/92de4e01b6da989126061844c3f8f8ebe05caaf8))

## [3.0.0-beta.15](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.14...@rudderstack/analytics-js-common@3.0.0-beta.15) (2024-01-08)


### Features

* remove support for category names in onetrust plugin ([#1556](https://github.com/rudderlabs/rudder-sdk-js/issues/1556)) ([2977c19](https://github.com/rudderlabs/rudder-sdk-js/commit/2977c194ec6ef877547687f3f48a161c69dace3c))


### Bug Fixes

* localstorage retry patch and upgrade packages ([#1573](https://github.com/rudderlabs/rudder-sdk-js/issues/1573)) ([b14d027](https://github.com/rudderlabs/rudder-sdk-js/commit/b14d0276cc7dedf87062530eab404f7a924fecf7))

## [3.0.0-beta.14](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.13...@rudderstack/analytics-js-common@3.0.0-beta.14) (2023-12-01)


### Features

* **analytics-js-loading-scripts:** add loading snippet version in event context ([#1483](https://github.com/rudderlabs/rudder-sdk-js/issues/1483)) ([4873cbc](https://github.com/rudderlabs/rudder-sdk-js/commit/4873cbc183879c0c1825cf939a53b6cf570cdf4e))


### Bug Fixes

* cloud mode event delivery for event with circular dependency ([#1528](https://github.com/rudderlabs/rudder-sdk-js/issues/1528)) ([1708b76](https://github.com/rudderlabs/rudder-sdk-js/commit/1708b76d45c6a1c5e6d8f95f145e8331228679b6))
* initialisation of bugsnag in chrome extension ([#1516](https://github.com/rudderlabs/rudder-sdk-js/issues/1516)) ([af970c9](https://github.com/rudderlabs/rudder-sdk-js/commit/af970c94ad45c50fcbbca0d0e7597fdefa08b154))
* multiple onReady invocation ([#1522](https://github.com/rudderlabs/rudder-sdk-js/issues/1522)) ([bf3b09b](https://github.com/rudderlabs/rudder-sdk-js/commit/bf3b09bef82eaf13f34bd538a080fd9f5e557e78))
* replace stringify with stringifyWithoutCircular ([#1525](https://github.com/rudderlabs/rudder-sdk-js/issues/1525)) ([828ecce](https://github.com/rudderlabs/rudder-sdk-js/commit/828ecce8c65e5b12007d63e9a7ddaa1a7d699da1))
* **rudder-sdk-js:** catch errors thrown by storage availability  checks ([#1521](https://github.com/rudderlabs/rudder-sdk-js/issues/1521)) ([276ebfa](https://github.com/rudderlabs/rudder-sdk-js/commit/276ebfa76b5e8e28a0a82111dee247172a8bdcd3))

## [3.0.0-beta.13](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.12...@rudderstack/analytics-js-common@3.0.0-beta.13) (2023-11-13)


### Features

* consent api wrap up ([#1477](https://github.com/rudderlabs/rudder-sdk-js/issues/1477)) ([edc78ac](https://github.com/rudderlabs/rudder-sdk-js/commit/edc78ac54235aabfc8d1d78f961fbd650a3b7c73))
* onboard sprig destination ([#1491](https://github.com/rudderlabs/rudder-sdk-js/issues/1491)) ([2fb7d5c](https://github.com/rudderlabs/rudder-sdk-js/commit/2fb7d5c98cb7a73d692b1d56bd55dd4e6cc08b2b))
* reinitialize persistent data from consent options ([#1465](https://github.com/rudderlabs/rudder-sdk-js/issues/1465)) ([43f30b7](https://github.com/rudderlabs/rudder-sdk-js/commit/43f30b7296ae9a0862810fd0b3c520e8bddf614c))

## [3.0.0-beta.12](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.11...@rudderstack/analytics-js-common@3.0.0-beta.12) (2023-10-27)


### Features

* alter life cycle for pre consent ([#1411](https://github.com/rudderlabs/rudder-sdk-js/issues/1411)) ([60ec092](https://github.com/rudderlabs/rudder-sdk-js/commit/60ec0924a1229678fb16d76a34a494c40a622a11))
* auto capture timezone as a part of context ([#1464](https://github.com/rudderlabs/rudder-sdk-js/issues/1464)) ([8e66069](https://github.com/rudderlabs/rudder-sdk-js/commit/8e660693d75727d2131a57ca57859e6d0b920e84))
* configure cookie to be fetched from exact domain ([#1468](https://github.com/rudderlabs/rudder-sdk-js/issues/1468)) ([4db1b10](https://github.com/rudderlabs/rudder-sdk-js/commit/4db1b10b45b4ffcd652aec6bd684943ca35c6c08))
* consent api ([#1458](https://github.com/rudderlabs/rudder-sdk-js/issues/1458)) ([216b405](https://github.com/rudderlabs/rudder-sdk-js/commit/216b405f7c319d5ff2d799d2e3a5efe2ee4a03af))


### Bug Fixes

* **analytics-js:** correct declared global extended type ([#1460](https://github.com/rudderlabs/rudder-sdk-js/issues/1460)) ([3f15290](https://github.com/rudderlabs/rudder-sdk-js/commit/3f1529037ba0541391b5f8033e37f867fdd7931c))
* **monorepo:** update vulnerable dependencies ([#1457](https://github.com/rudderlabs/rudder-sdk-js/issues/1457)) ([7a4bc4c](https://github.com/rudderlabs/rudder-sdk-js/commit/7a4bc4cc641e4fff2a8f561ce6fd67d16c0cd5a0))
* upgrade vulnerable cryptoJS dependency, rolup to v4 & NX to v17 ([#1471](https://github.com/rudderlabs/rudder-sdk-js/issues/1471)) ([b2bb21c](https://github.com/rudderlabs/rudder-sdk-js/commit/b2bb21cb3f618f6c86f593d1706abe9e6349066d))

## [3.0.0-beta.11](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.10...@rudderstack/analytics-js-common@3.0.0-beta.11) (2023-10-16)


### Features

* add support for session storage ([#1440](https://github.com/rudderlabs/rudder-sdk-js/issues/1440)) ([7e3106b](https://github.com/rudderlabs/rudder-sdk-js/commit/7e3106b5317af05ad28a9c0c22a50638dbaebdc2))
* **analytics-js-service-worker:** deprecate service worker export of rudder-sdk-js package  in favor of the new standalone package([#1437](https://github.com/rudderlabs/rudder-sdk-js/issues/1437)) ([1797d3e](https://github.com/rudderlabs/rudder-sdk-js/commit/1797d3ef356e947a528c2de9abcfde245cc28178))
* dmt plugin for v3 ([#1412](https://github.com/rudderlabs/rudder-sdk-js/issues/1412)) ([97ee68a](https://github.com/rudderlabs/rudder-sdk-js/commit/97ee68a27daa5ce8c3a098cdc84c4ee7981f1149))


### Bug Fixes

* identify traits type ([#1427](https://github.com/rudderlabs/rudder-sdk-js/issues/1427)) ([a58c919](https://github.com/rudderlabs/rudder-sdk-js/commit/a58c919ca36fc4e14d134455a08fe0e35f3e66ce))

## [3.0.0-beta.10](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.9...@rudderstack/analytics-js-common@3.0.0-beta.10) (2023-09-26)


### Features

* optimize plugin chunks ([#1379](https://github.com/rudderlabs/rudder-sdk-js/issues/1379)) ([5acfa4d](https://github.com/rudderlabs/rudder-sdk-js/commit/5acfa4d61d85e01c44252749074021d0a782b59e))

## [3.0.0-beta.9](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.8...@rudderstack/analytics-js-common@3.0.0-beta.9) (2023-09-20)

## [3.0.0-beta.8](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.7...@rudderstack/analytics-js-common@3.0.0-beta.8) (2023-09-18)


### Features

* deprecate support of common names for integrations ([#1374](https://github.com/rudderlabs/rudder-sdk-js/issues/1374)) ([f1d097d](https://github.com/rudderlabs/rudder-sdk-js/commit/f1d097d9976f6c9d2ad0f1d81d469148f8c7c197))

## [3.0.0-beta.7](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.6...@rudderstack/analytics-js-common@3.0.0-beta.7) (2023-09-14)


### Features

* granular control of persisted data storing with auto migration ([#1329](https://github.com/rudderlabs/rudder-sdk-js/issues/1329)) ([b709edc](https://github.com/rudderlabs/rudder-sdk-js/commit/b709edcbf9314d26fb9cd0af5fa8790330853d9c))
* new load options for pre-consent configuration ([#1363](https://github.com/rudderlabs/rudder-sdk-js/issues/1363)) ([363a524](https://github.com/rudderlabs/rudder-sdk-js/commit/363a5242b607ed7bcb21f2847d15c6b399d0b6a9))

# [3.0.0-beta.6](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.5...@rudderstack/analytics-js-common@3.0.0-beta.6) (2023-08-30)


### Features

* add batching support to xhr plugin ([#1301](https://github.com/rudderlabs/rudder-sdk-js/issues/1301)) ([0421663](https://github.com/rudderlabs/rudder-sdk-js/commit/04216637a00dc5339cf466a586137415b46b6b49))
* add resize event handler to update screen info ([#1336](https://github.com/rudderlabs/rudder-sdk-js/issues/1336)) ([be05226](https://github.com/rudderlabs/rudder-sdk-js/commit/be0522668f44667d7d3a8082db89a7e4cad316c8))





# [3.0.0-beta.5](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.4...@rudderstack/analytics-js-common@3.0.0-beta.5) (2023-08-21)


### Bug Fixes

* **analytics-js:** update context page details in every event creation ([#1317](https://github.com/rudderlabs/rudder-sdk-js/issues/1317)) ([45c2300](https://github.com/rudderlabs/rudder-sdk-js/commit/45c230094aceb8176d92e7958fcb6910ebc61248))





# [3.0.0-beta.4](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.3...@rudderstack/analytics-js-common@3.0.0-beta.4) (2023-08-17)

**Note:** Version bump only for package @rudderstack/analytics-js-common





# [3.0.0-beta.3](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.2...@rudderstack/analytics-js-common@3.0.0-beta.3) (2023-08-10)


### Bug Fixes

* **analytics-js:** change default cdn paths to the beta ones ([8d4bbe4](https://github.com/rudderlabs/rudder-sdk-js/commit/8d4bbe4bbf8be60dbdf0d07244a11da8f1948e5f))





# 3.0.0-beta.2 (2023-08-09)


### Bug Fixes

* add missing load option to buffer data plane events ([#1265](https://github.com/rudderlabs/rudder-sdk-js/issues/1265)) ([8bca1b2](https://github.com/rudderlabs/rudder-sdk-js/commit/8bca1b253dd3be90a2e7e6c258847c417c578850))
* config url deduction ([#1282](https://github.com/rudderlabs/rudder-sdk-js/issues/1282)) ([658dc24](https://github.com/rudderlabs/rudder-sdk-js/commit/658dc24e077035898871888bfd4c72e88f16deb2))
* cookie storage options ([#1232](https://github.com/rudderlabs/rudder-sdk-js/issues/1232)) ([23970bc](https://github.com/rudderlabs/rudder-sdk-js/commit/23970bc88965b8a8631f406cd0c47b6bb949e0ea))
* ie11 incompatibility issues ([#1279](https://github.com/rudderlabs/rudder-sdk-js/issues/1279)) ([80c59ae](https://github.com/rudderlabs/rudder-sdk-js/commit/80c59ae6b1b5908087e36d39956becab5523027e))
* use destination display name throughout the app ([#1269](https://github.com/rudderlabs/rudder-sdk-js/issues/1269)) ([6e6a18c](https://github.com/rudderlabs/rudder-sdk-js/commit/6e6a18c5248654963130e24d94191350292a5f58))


### Features

* configurable storage type ([#1258](https://github.com/rudderlabs/rudder-sdk-js/issues/1258)) ([08e3616](https://github.com/rudderlabs/rudder-sdk-js/commit/08e3616bece2ad3df1c533833b344a9c811e70fe))
* refactor apis ([#1240](https://github.com/rudderlabs/rudder-sdk-js/issues/1240)) ([4f25a03](https://github.com/rudderlabs/rudder-sdk-js/commit/4f25a0377ef438a4e4b5dcad6f2504ec5da5f7a3))
* storage service improvements ([#1233](https://github.com/rudderlabs/rudder-sdk-js/issues/1233)) ([441fd60](https://github.com/rudderlabs/rudder-sdk-js/commit/441fd600c2e72e990518e45c972e43ce33567e7f))
