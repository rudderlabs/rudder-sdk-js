## [3.35.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js@3.34.3...@rudderstack/analytics-js@3.35.0) (2026-10-12)

### Dependency Updates

* `@rudderstack/analytics-js-cookies` updated to version `0.5.17`
* `@rudderstack/analytics-js-common` updated to version `3.30.2`
* `@rudderstack/analytics-js-plugins` updated to version `3.18.4`

### Features

* add device-mode e2e harness skill ([#3218](https://github.com/rudderlabs/rudder-sdk-js/issues/3218)) ([8b8757a](https://github.com/rudderlabs/rudder-sdk-js/commit/8b8757ae433f6fb15263dcb0b59962925c214a20))


### Bug Fixes

* **analytics-js:** drop corrupt store entries on parse failure ([#3236](https://github.com/rudderlabs/rudder-sdk-js/issues/3236)) ([bacb581](https://github.com/rudderlabs/rudder-sdk-js/commit/bacb58169b8ef8393c2e8ebbdcdda28332408f71))
* **analytics-js:** group remote plugin failures ([#3232](https://github.com/rudderlabs/rudder-sdk-js/issues/3232)) ([0d6a81e](https://github.com/rudderlabs/rudder-sdk-js/commit/0d6a81e78e6ef938af5ec049ed70b2c766b6dc59))
* **analytics-js:** skip polyfill detection and loading in the modern build ([#3265](https://github.com/rudderlabs/rudder-sdk-js/issues/3265)) ([1ccc2c5](https://github.com/rudderlabs/rudder-sdk-js/commit/1ccc2c58701c44e5b25042267bc855326977cfde))
* **analytics-js:** stop using Array.prototype.at in the error handler ([#3263](https://github.com/rudderlabs/rudder-sdk-js/issues/3263)) ([1f6a0f7](https://github.com/rudderlabs/rudder-sdk-js/commit/1f6a0f7a02be4e7deb3267ad9d8a62b2aaa162f7))
* **monorepo:** avoid String.prototype.replaceAll ([#3228](https://github.com/rudderlabs/rudder-sdk-js/issues/3228)) ([e985e82](https://github.com/rudderlabs/rudder-sdk-js/commit/e985e8276c240aab370d9863be661a49da749262))
* **monorepo:** deliver polyfills to every user agent ([#3229](https://github.com/rudderlabs/rudder-sdk-js/issues/3229)) ([711036d](https://github.com/rudderlabs/rudder-sdk-js/commit/711036df308503243d80ec5264c7034423bbbc41))
* **monorepo:** lower the modern browserslist floor ([#3231](https://github.com/rudderlabs/rudder-sdk-js/issues/3231)) ([3555bb5](https://github.com/rudderlabs/rudder-sdk-js/commit/3555bb55b3a2bed4e8157399e21aa24ec64a7552))


### Performance Improvements

* **analytics-js:** compile the CDN modern core for the snippet's floor ([#3264](https://github.com/rudderlabs/rudder-sdk-js/issues/3264)) ([ce0b4ac](https://github.com/rudderlabs/rudder-sdk-js/commit/ce0b4acce5bcfdc67f829965e42821d8566b40e1))

