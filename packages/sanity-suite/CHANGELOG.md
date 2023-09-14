# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## 0.1.0 (2023-09-14)


### Features

* add batching support to xhr plugin ([#1301](https://github.com/rudderlabs/rudder-sdk-js/issues/1301)) ([0421663](https://github.com/rudderlabs/rudder-sdk-js/commit/04216637a00dc5339cf466a586137415b46b6b49))
* add callback for polyfill load ([#1335](https://github.com/rudderlabs/rudder-sdk-js/issues/1335)) ([6ba9329](https://github.com/rudderlabs/rudder-sdk-js/commit/6ba932918dd03c110c92cd5837a2f8ca0f9cf192))
* **analytics-js-plugins:** new beacon queue plugin ([#1173](https://github.com/rudderlabs/rudder-sdk-js/issues/1173)) ([9e4602b](https://github.com/rudderlabs/rudder-sdk-js/commit/9e4602b67c7ce1345023388e09c3701820f71091))
* configurable storage type ([#1258](https://github.com/rudderlabs/rudder-sdk-js/issues/1258)) ([08e3616](https://github.com/rudderlabs/rudder-sdk-js/commit/08e3616bece2ad3df1c533833b344a9c811e70fe))
* create bundling and packaging for v3 ([#1098](https://github.com/rudderlabs/rudder-sdk-js/issues/1098)) ([3f14bbe](https://github.com/rudderlabs/rudder-sdk-js/commit/3f14bbe8d9d6af62d4366873c59c9c21df704675))
* dataplane events queue ([#1088](https://github.com/rudderlabs/rudder-sdk-js/issues/1088)) ([17f45bc](https://github.com/rudderlabs/rudder-sdk-js/commit/17f45bc1a57f37edee56808aa1f337deef208528))
* events repository ([#1063](https://github.com/rudderlabs/rudder-sdk-js/issues/1063)) ([8a92dcb](https://github.com/rudderlabs/rudder-sdk-js/commit/8a92dcb14311b3537d391375fc0ed34433b5afe7))
* events service ([#1000](https://github.com/rudderlabs/rudder-sdk-js/issues/1000)) ([7bb3025](https://github.com/rudderlabs/rudder-sdk-js/commit/7bb30251f4e5bfb169e69aca377e7e57df8ac58a))
* plugins manager & capabilities manager ([#1062](https://github.com/rudderlabs/rudder-sdk-js/issues/1062)) ([9d03bbd](https://github.com/rudderlabs/rudder-sdk-js/commit/9d03bbdea3bf2658f56580aa9bb8df2af9baf9a0))
* refactor apis ([#1240](https://github.com/rudderlabs/rudder-sdk-js/issues/1240)) ([4f25a03](https://github.com/rudderlabs/rudder-sdk-js/commit/4f25a0377ef438a4e4b5dcad6f2504ec5da5f7a3))
* rename sdk file name ([#1190](https://github.com/rudderlabs/rudder-sdk-js/issues/1190)) ([0167e38](https://github.com/rudderlabs/rudder-sdk-js/commit/0167e384a05e1fa33b3da3b940f3952ee06ef21e))


### Bug Fixes

* **analytics-js:** fix issue with proxy dataplane url with trailing slash ([ef992a6](https://github.com/rudderlabs/rudder-sdk-js/commit/ef992a664171e58bc60628221cbfad73f2830e2c))
* **analytics-js:** fix issues with tracking methods overloads ([#1164](https://github.com/rudderlabs/rudder-sdk-js/issues/1164)) ([718f9a9](https://github.com/rudderlabs/rudder-sdk-js/commit/718f9a9bf9e24fa203cfe9cec835528c91ed955f))
* **analytics-js:** fix type issues & broken unit tests ([dd198bc](https://github.com/rudderlabs/rudder-sdk-js/commit/dd198bc737f23d666dff15501a530b65c5b674f3))
* **analytics-js:** support imports in SSR & reduce shared bundles code ([#1135](https://github.com/rudderlabs/rudder-sdk-js/issues/1135)) ([29d1d75](https://github.com/rudderlabs/rudder-sdk-js/commit/29d1d75325c732d62b9926d3848c0b1b2e566c85))
* **analytics-js:** update context page details in every event creation ([#1317](https://github.com/rudderlabs/rudder-sdk-js/issues/1317)) ([45c2300](https://github.com/rudderlabs/rudder-sdk-js/commit/45c230094aceb8176d92e7958fcb6910ebc61248))
* error reporting ([#1285](https://github.com/rudderlabs/rudder-sdk-js/issues/1285)) ([1b9324e](https://github.com/rudderlabs/rudder-sdk-js/commit/1b9324e0be38eecbc25cb08be7650d8c1e474d35))
* issues post sanity checks, tidy up code structure, add uaCH, npm packaging ([#1132](https://github.com/rudderlabs/rudder-sdk-js/issues/1132)) ([0fa64c1](https://github.com/rudderlabs/rudder-sdk-js/commit/0fa64c1bb277cbd20b0d7c984347e5fe52e4d4fe))

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
