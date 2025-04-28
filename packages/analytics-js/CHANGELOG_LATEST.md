## [3.17.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js@3.16.1...@rudderstack/analytics-js@3.17.0) (2025-04-25)

### Dependency Updates

* `@rudderstack/analytics-js-cookies` updated to version `0.4.24`
* `@rudderstack/analytics-js-common` updated to version `3.18.0`
* `@rudderstack/analytics-js-plugins` updated to version `3.8.1`

### Features

* pre-consent event buffering works now for anonymousId pre-consent storage strategy ([#2100](https://github.com/rudderlabs/rudder-sdk-js/issues/2100)) ([6336925](https://github.com/rudderlabs/rudder-sdk-js/commit/6336925ccfdf66623ca98c4a44b7bf0a13ef54dc))
* remove page loaded event ([#2088](https://github.com/rudderlabs/rudder-sdk-js/issues/2088)) ([ec1d604](https://github.com/rudderlabs/rudder-sdk-js/commit/ec1d604f70d4e476a751f5207df09eef69220be2))


### Bug Fixes

* consent api race condition to load integrations ([#2178](https://github.com/rudderlabs/rudder-sdk-js/issues/2178)) ([30149ad](https://github.com/rudderlabs/rudder-sdk-js/commit/30149adff3eddd628022f511374e9072d087db89))
* consider local page urls as dev release stage in error reporting ([#2174](https://github.com/rudderlabs/rudder-sdk-js/issues/2174)) ([ae53449](https://github.com/rudderlabs/rudder-sdk-js/commit/ae53449af2289113182c602971340afdad39d13d))
* recursively migrate persisted entries ([#2187](https://github.com/rudderlabs/rudder-sdk-js/issues/2187)) ([3dd07ea](https://github.com/rudderlabs/rudder-sdk-js/commit/3dd07ea1bde4655124fc02850a022bcb550b8c07))
* rename view id to visit id ([#2086](https://github.com/rudderlabs/rudder-sdk-js/issues/2086)) ([51c8dd9](https://github.com/rudderlabs/rudder-sdk-js/commit/51c8dd94b2e25f42a116cb72d209d41729c165c0))
* rename visit duration to time on page ([#2087](https://github.com/rudderlabs/rudder-sdk-js/issues/2087)) ([569846d](https://github.com/rudderlabs/rudder-sdk-js/commit/569846d992fd01105e880e67ca004d1e9f52688a))

