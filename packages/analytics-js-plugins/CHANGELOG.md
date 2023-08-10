# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-beta.3](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-plugins@3.0.0-beta.2...@rudderstack/analytics-js-plugins@3.0.0-beta.3) (2023-08-10)


### Bug Fixes

* integrations data override to match with v1.1 ([#1293](https://github.com/rudderlabs/rudder-sdk-js/issues/1293)) ([f68f138](https://github.com/rudderlabs/rudder-sdk-js/commit/f68f138513301d19f7be7bfff474ff8011a2935c))





# 3.0.0-beta.2 (2023-08-09)


### Bug Fixes

* **analytics-js:** add new flag in errorHandler, add state reset method ([#998](https://github.com/rudderlabs/rudder-sdk-js/issues/998)) ([4c76315](https://github.com/rudderlabs/rudder-sdk-js/commit/4c76315481793cd29ae4dc9b249a0684df2540d4))
* **analytics-js:** fix issue with proxy dataplane url with trailing slash ([ef992a6](https://github.com/rudderlabs/rudder-sdk-js/commit/ef992a664171e58bc60628221cbfad73f2830e2c))
* **analytics-js:** fix issues with tracking methods overloads ([#1164](https://github.com/rudderlabs/rudder-sdk-js/issues/1164)) ([718f9a9](https://github.com/rudderlabs/rudder-sdk-js/commit/718f9a9bf9e24fa203cfe9cec835528c91ed955f))
* **analytics-js:** support imports in SSR & reduce shared bundles code ([#1135](https://github.com/rudderlabs/rudder-sdk-js/issues/1135)) ([29d1d75](https://github.com/rudderlabs/rudder-sdk-js/commit/29d1d75325c732d62b9926d3848c0b1b2e566c85))
* config url deduction ([#1282](https://github.com/rudderlabs/rudder-sdk-js/issues/1282)) ([658dc24](https://github.com/rudderlabs/rudder-sdk-js/commit/658dc24e077035898871888bfd4c72e88f16deb2))
* error handler when destination ready check times out ([#1225](https://github.com/rudderlabs/rudder-sdk-js/issues/1225)) ([6056063](https://github.com/rudderlabs/rudder-sdk-js/commit/60560630522ee589539b52aec030cc9dbfda5988))
* error reporting ([#1285](https://github.com/rudderlabs/rudder-sdk-js/issues/1285)) ([1b9324e](https://github.com/rudderlabs/rudder-sdk-js/commit/1b9324e0be38eecbc25cb08be7650d8c1e474d35))
* event filtering for empty or non-string event names  ([#1156](https://github.com/rudderlabs/rudder-sdk-js/issues/1156)) ([4f71f08](https://github.com/rudderlabs/rudder-sdk-js/commit/4f71f088d265ceddb3a0dd73832918508cf58da1))
* issues post sanity checks, tidy up code structure, add uaCH, npm packaging ([#1132](https://github.com/rudderlabs/rudder-sdk-js/issues/1132)) ([0fa64c1](https://github.com/rudderlabs/rudder-sdk-js/commit/0fa64c1bb277cbd20b0d7c984347e5fe52e4d4fe))
* **monorepo:** expose one trust plugin in remores app ([0dd710a](https://github.com/rudderlabs/rudder-sdk-js/commit/0dd710a6cb47b9dd33f62e9eaaf0002ab131083e))
* native destinations queue options ([#1209](https://github.com/rudderlabs/rudder-sdk-js/issues/1209)) ([0341fc8](https://github.com/rudderlabs/rudder-sdk-js/commit/0341fc8a35433209a402f497cd92865bcec9f20f))
* normalize all error messages ([#1191](https://github.com/rudderlabs/rudder-sdk-js/issues/1191)) ([b45f3f3](https://github.com/rudderlabs/rudder-sdk-js/commit/b45f3f324afd2df6e806a586fe7d281392b03d79))
* use destination display name throughout the app ([#1269](https://github.com/rudderlabs/rudder-sdk-js/issues/1269)) ([6e6a18c](https://github.com/rudderlabs/rudder-sdk-js/commit/6e6a18c5248654963130e24d94191350292a5f58))
* use globalThis instead of global ([a4ba5dd](https://github.com/rudderlabs/rudder-sdk-js/commit/a4ba5dd894e4acbff690e5a9940c3e88b3bd7d8b))
* xhr queue plugin retry mechanism ([#1171](https://github.com/rudderlabs/rudder-sdk-js/issues/1171)) ([6d8d2b9](https://github.com/rudderlabs/rudder-sdk-js/commit/6d8d2b9db554459061995494de0b42c1f35b3bb6))


### Features

* add application state to bugsnag metadata ([#1168](https://github.com/rudderlabs/rudder-sdk-js/issues/1168)) ([7273e3a](https://github.com/rudderlabs/rudder-sdk-js/commit/7273e3af6683165c3c33265c64db6fb28a3ff5e5))
* add validations for load options ([#1277](https://github.com/rudderlabs/rudder-sdk-js/issues/1277)) ([1a276bf](https://github.com/rudderlabs/rudder-sdk-js/commit/1a276bf99471790080bc74f3e126e208cb416eaf))
* **analytics-js-plugins:** add google linker plugin, use new state ([b3d5cf3](https://github.com/rudderlabs/rudder-sdk-js/commit/b3d5cf388b39c9ca3777918ed0a0412bfb19321b))
* **analytics-js-plugins:** add store encrypt remote plugin ([0a2ec6c](https://github.com/rudderlabs/rudder-sdk-js/commit/0a2ec6c9861647d99b1a4ee1391826c285cd9865))
* **analytics-js-plugins:** new beacon queue plugin ([#1173](https://github.com/rudderlabs/rudder-sdk-js/issues/1173)) ([9e4602b](https://github.com/rudderlabs/rudder-sdk-js/commit/9e4602b67c7ce1345023388e09c3701820f71091))
* **analytics-js:** add external source loader, fix async tests, cleanup ([8ba7bdf](https://github.com/rudderlabs/rudder-sdk-js/commit/8ba7bdf260a6771bf4cfc154b9f84ab61846a622))
* **analytics-js:** add global state initial structure ([f636227](https://github.com/rudderlabs/rudder-sdk-js/commit/f636227e0094a4a3f0bfdc17d52c4731ab17e20c))
* **analytics-js:** add more state slices ([#973](https://github.com/rudderlabs/rudder-sdk-js/issues/973)) ([7c1e627](https://github.com/rudderlabs/rudder-sdk-js/commit/7c1e6275ad9eeec2ccdd4a100b085437f78a2603))
* bugsnag plugin ([#1159](https://github.com/rudderlabs/rudder-sdk-js/issues/1159)) ([c59cfd9](https://github.com/rudderlabs/rudder-sdk-js/commit/c59cfd9e6e4160e4759695dddf527bfc512f119e))
* configurable storage type ([#1258](https://github.com/rudderlabs/rudder-sdk-js/issues/1258)) ([08e3616](https://github.com/rudderlabs/rudder-sdk-js/commit/08e3616bece2ad3df1c533833b344a9c811e70fe))
* consent manager plugin ([#1096](https://github.com/rudderlabs/rudder-sdk-js/issues/1096)) ([7af1cce](https://github.com/rudderlabs/rudder-sdk-js/commit/7af1ccec03997cd55ce70aa1e4afba05b22da264))
* create bundling and packaging for v3 ([#1098](https://github.com/rudderlabs/rudder-sdk-js/issues/1098)) ([3f14bbe](https://github.com/rudderlabs/rudder-sdk-js/commit/3f14bbe8d9d6af62d4366873c59c9c21df704675))
* dataplane events queue ([#1088](https://github.com/rudderlabs/rudder-sdk-js/issues/1088)) ([17f45bc](https://github.com/rudderlabs/rudder-sdk-js/commit/17f45bc1a57f37edee56808aa1f337deef208528))
* events repository ([#1063](https://github.com/rudderlabs/rudder-sdk-js/issues/1063)) ([8a92dcb](https://github.com/rudderlabs/rudder-sdk-js/commit/8a92dcb14311b3537d391375fc0ed34433b5afe7))
* hybrid mode ([#1147](https://github.com/rudderlabs/rudder-sdk-js/issues/1147)) ([e623214](https://github.com/rudderlabs/rudder-sdk-js/commit/e6232145818032aa6e33130511b1e1d41d4a293b))
* improve adblocker detection ([#1176](https://github.com/rudderlabs/rudder-sdk-js/issues/1176)) ([6fb57ef](https://github.com/rudderlabs/rudder-sdk-js/commit/6fb57ef40c4ea73cb9d1c01844458702e2819ebc))
* improve destination loader logic ([#1263](https://github.com/rudderlabs/rudder-sdk-js/issues/1263)) ([c154155](https://github.com/rudderlabs/rudder-sdk-js/commit/c154155102f22ac17c6f82b8869b85000a5cc69d))
* ketch consent manager plugin ([#1210](https://github.com/rudderlabs/rudder-sdk-js/issues/1210)) ([75d4588](https://github.com/rudderlabs/rudder-sdk-js/commit/75d4588481e3fe86bad804162663f332ce2f895d))
* log messages language dictionary ([#1206](https://github.com/rudderlabs/rudder-sdk-js/issues/1206)) ([77a867e](https://github.com/rudderlabs/rudder-sdk-js/commit/77a867e9c109122a9223293cb5af25f1ccb48ecc))
* native destinations events queue ([#1127](https://github.com/rudderlabs/rudder-sdk-js/issues/1127)) ([ead338c](https://github.com/rudderlabs/rudder-sdk-js/commit/ead338cb5a45c7d109428259459892ff896a0ccb))
* plugins manager & capabilities manager ([#1062](https://github.com/rudderlabs/rudder-sdk-js/issues/1062)) ([9d03bbd](https://github.com/rudderlabs/rudder-sdk-js/commit/9d03bbdea3bf2658f56580aa9bb8df2af9baf9a0))
* refactor apis ([#1240](https://github.com/rudderlabs/rudder-sdk-js/issues/1240)) ([4f25a03](https://github.com/rudderlabs/rudder-sdk-js/commit/4f25a0377ef438a4e4b5dcad6f2504ec5da5f7a3))
* remove crypto based encryption for persistent data ([#1197](https://github.com/rudderlabs/rudder-sdk-js/issues/1197)) ([187b701](https://github.com/rudderlabs/rudder-sdk-js/commit/187b7016e75f092c54698fe7fe3652656943e35f))
* rename sdk file name ([#1190](https://github.com/rudderlabs/rudder-sdk-js/issues/1190)) ([0167e38](https://github.com/rudderlabs/rudder-sdk-js/commit/0167e384a05e1fa33b3da3b940f3952ee06ef21e))
* user session manager ([#1013](https://github.com/rudderlabs/rudder-sdk-js/issues/1013)) ([450cce0](https://github.com/rudderlabs/rudder-sdk-js/commit/450cce03bf09a5c3f3d93b6a6083173ddb6309d7))





# Change Log
