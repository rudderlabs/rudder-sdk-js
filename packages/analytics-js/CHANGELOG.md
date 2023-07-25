# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0-beta.1 (2023-07-25)


### Bug Fixes

* **analytics-js:** add new flag in errorHandler, add state reset method ([#998](https://github.com/rudderlabs/rudder-sdk-js/issues/998)) ([4c76315](https://github.com/rudderlabs/rudder-sdk-js/commit/4c76315481793cd29ae4dc9b249a0684df2540d4))
* **analytics-js:** data residency url detection issue ([#1163](https://github.com/rudderlabs/rudder-sdk-js/issues/1163)) ([4e80937](https://github.com/rudderlabs/rudder-sdk-js/commit/4e8093742935366918de2526eeabdf2b51851f55))
* **analytics-js:** fix edge cases & add unit tests for error handler ([068f305](https://github.com/rudderlabs/rudder-sdk-js/commit/068f305a6f401b7b521b2f0b0bdd8124d31c67c0))
* **analytics-js:** fix issues with tracking methods overloads ([#1164](https://github.com/rudderlabs/rudder-sdk-js/issues/1164)) ([718f9a9](https://github.com/rudderlabs/rudder-sdk-js/commit/718f9a9bf9e24fa203cfe9cec835528c91ed955f))
* **analytics-js:** fix type issues & broken unit tests ([dd198bc](https://github.com/rudderlabs/rudder-sdk-js/commit/dd198bc737f23d666dff15501a530b65c5b674f3))
* **analytics-js:** support imports in SSR & reduce shared bundles code ([#1135](https://github.com/rudderlabs/rudder-sdk-js/issues/1135)) ([29d1d75](https://github.com/rudderlabs/rudder-sdk-js/commit/29d1d75325c732d62b9926d3848c0b1b2e566c85))
* auto capture anonymous id ([#1160](https://github.com/rudderlabs/rudder-sdk-js/issues/1160)) ([2947ead](https://github.com/rudderlabs/rudder-sdk-js/commit/2947ead0b431ea608f510939f1d68ca1bae58095))
* auto detection of destSDKBaseUrl ([#1144](https://github.com/rudderlabs/rudder-sdk-js/issues/1144)) ([1d6a1d7](https://github.com/rudderlabs/rudder-sdk-js/commit/1d6a1d7788f03fcd3d0eb101c277737a5f758368))
* avoid persisting user id in alias api ([#1057](https://github.com/rudderlabs/rudder-sdk-js/issues/1057)) ([273eb9e](https://github.com/rudderlabs/rudder-sdk-js/commit/273eb9e27fda917f443cd1eff63d74580b612662))
* cookie storage options ([#1232](https://github.com/rudderlabs/rudder-sdk-js/issues/1232)) ([23970bc](https://github.com/rudderlabs/rudder-sdk-js/commit/23970bc88965b8a8631f406cd0c47b6bb949e0ea))
* issues in rudder event structure ([#1111](https://github.com/rudderlabs/rudder-sdk-js/issues/1111)) ([bed6210](https://github.com/rudderlabs/rudder-sdk-js/commit/bed6210cdc1097f1e3a75e9151cace1a7425401d))
* issues post sanity checks, tidy up code structure, add uaCH, npm packaging ([#1132](https://github.com/rudderlabs/rudder-sdk-js/issues/1132)) ([0fa64c1](https://github.com/rudderlabs/rudder-sdk-js/commit/0fa64c1bb277cbd20b0d7c984347e5fe52e4d4fe))
* native destinations queue options ([#1209](https://github.com/rudderlabs/rudder-sdk-js/issues/1209)) ([0341fc8](https://github.com/rudderlabs/rudder-sdk-js/commit/0341fc8a35433209a402f497cd92865bcec9f20f))
* normalize all error messages ([#1191](https://github.com/rudderlabs/rudder-sdk-js/issues/1191)) ([b45f3f3](https://github.com/rudderlabs/rudder-sdk-js/commit/b45f3f324afd2df6e806a586fe7d281392b03d79))
* storage option configuration ([#1217](https://github.com/rudderlabs/rudder-sdk-js/issues/1217)) ([7dc0488](https://github.com/rudderlabs/rudder-sdk-js/commit/7dc048895f7fae0783284dc5351b9a86df8981db))
* xhr queue plugin retry mechanism ([#1171](https://github.com/rudderlabs/rudder-sdk-js/issues/1171)) ([6d8d2b9](https://github.com/rudderlabs/rudder-sdk-js/commit/6d8d2b9db554459061995494de0b42c1f35b3bb6))


### Features

* add application state to bugsnag metadata ([#1168](https://github.com/rudderlabs/rudder-sdk-js/issues/1168)) ([7273e3a](https://github.com/rudderlabs/rudder-sdk-js/commit/7273e3af6683165c3c33265c64db6fb28a3ff5e5))
* **analytics-js-plugins:** new beacon queue plugin ([#1173](https://github.com/rudderlabs/rudder-sdk-js/issues/1173)) ([9e4602b](https://github.com/rudderlabs/rudder-sdk-js/commit/9e4602b67c7ce1345023388e09c3701820f71091))
* **analytics-js:** add application lifecycle and analytics class ([71ceed5](https://github.com/rudderlabs/rudder-sdk-js/commit/71ceed5276a9a4da83df4654b76b1d012e72f766))
* **analytics-js:** add external source loader, fix async tests, cleanup ([8ba7bdf](https://github.com/rudderlabs/rudder-sdk-js/commit/8ba7bdf260a6771bf4cfc154b9f84ab61846a622))
* **analytics-js:** add global state initial structure ([f636227](https://github.com/rudderlabs/rudder-sdk-js/commit/f636227e0094a4a3f0bfdc17d52c4731ab17e20c))
* **analytics-js:** add globaly exposed analytics instances ([03931a6](https://github.com/rudderlabs/rudder-sdk-js/commit/03931a67c51a62b41db1398a28f1e82d48b9a8a5))
* **analytics-js:** add HttpClient, Logger & ErrorHandler services ([236f951](https://github.com/rudderlabs/rudder-sdk-js/commit/236f95198d8f2ae4a029339074fa063679fbaa38))
* **analytics-js:** add more state slices ([#973](https://github.com/rudderlabs/rudder-sdk-js/issues/973)) ([7c1e627](https://github.com/rudderlabs/rudder-sdk-js/commit/7c1e6275ad9eeec2ccdd4a100b085437f78a2603))
* **analytics-js:** add online status detection in capabilities mngr ([a4702da](https://github.com/rudderlabs/rudder-sdk-js/commit/a4702dab9718f66cacc8aa58add41840f1853a23))
* **analytics-js:** add storage manager,fix issue with localhost cookies ([9a5bff7](https://github.com/rudderlabs/rudder-sdk-js/commit/9a5bff7ebbf76da9cbb768c401362b57da67d37b))
* **analytics-js:** expose global analytics instances  & preload buffer ([203919f](https://github.com/rudderlabs/rudder-sdk-js/commit/203919fd8efd263afb41732cb912898d50ca5781))
* **analytics-js:** migrated js-plugin dependency to source code ([4be78ab](https://github.com/rudderlabs/rudder-sdk-js/commit/4be78abcddbc11bae85c5d5f2718a46a4b0119db))
* bugsnag plugin ([#1159](https://github.com/rudderlabs/rudder-sdk-js/issues/1159)) ([c59cfd9](https://github.com/rudderlabs/rudder-sdk-js/commit/c59cfd9e6e4160e4759695dddf527bfc512f119e))
* config manager ([#990](https://github.com/rudderlabs/rudder-sdk-js/issues/990)) ([cc48a29](https://github.com/rudderlabs/rudder-sdk-js/commit/cc48a29b414ffbbbba10980c73a3fa78c6fd5e7c))
* consent manager plugin ([#1096](https://github.com/rudderlabs/rudder-sdk-js/issues/1096)) ([7af1cce](https://github.com/rudderlabs/rudder-sdk-js/commit/7af1ccec03997cd55ce70aa1e4afba05b22da264))
* create bundling and packaging for v3 ([#1098](https://github.com/rudderlabs/rudder-sdk-js/issues/1098)) ([3f14bbe](https://github.com/rudderlabs/rudder-sdk-js/commit/3f14bbe8d9d6af62d4366873c59c9c21df704675))
* dataplane events queue ([#1088](https://github.com/rudderlabs/rudder-sdk-js/issues/1088)) ([17f45bc](https://github.com/rudderlabs/rudder-sdk-js/commit/17f45bc1a57f37edee56808aa1f337deef208528))
* events repository ([#1063](https://github.com/rudderlabs/rudder-sdk-js/issues/1063)) ([8a92dcb](https://github.com/rudderlabs/rudder-sdk-js/commit/8a92dcb14311b3537d391375fc0ed34433b5afe7))
* events service ([#1000](https://github.com/rudderlabs/rudder-sdk-js/issues/1000)) ([7bb3025](https://github.com/rudderlabs/rudder-sdk-js/commit/7bb30251f4e5bfb169e69aca377e7e57df8ac58a))
* hybrid mode ([#1147](https://github.com/rudderlabs/rudder-sdk-js/issues/1147)) ([e623214](https://github.com/rudderlabs/rudder-sdk-js/commit/e6232145818032aa6e33130511b1e1d41d4a293b))
* improve adblocker detection ([#1176](https://github.com/rudderlabs/rudder-sdk-js/issues/1176)) ([6fb57ef](https://github.com/rudderlabs/rudder-sdk-js/commit/6fb57ef40c4ea73cb9d1c01844458702e2819ebc))
* ketch consent manager plugin ([#1210](https://github.com/rudderlabs/rudder-sdk-js/issues/1210)) ([75d4588](https://github.com/rudderlabs/rudder-sdk-js/commit/75d4588481e3fe86bad804162663f332ce2f895d))
* log messages language dictionary ([#1206](https://github.com/rudderlabs/rudder-sdk-js/issues/1206)) ([77a867e](https://github.com/rudderlabs/rudder-sdk-js/commit/77a867e9c109122a9223293cb5af25f1ccb48ecc))
* native destinations events queue ([#1127](https://github.com/rudderlabs/rudder-sdk-js/issues/1127)) ([ead338c](https://github.com/rudderlabs/rudder-sdk-js/commit/ead338cb5a45c7d109428259459892ff896a0ccb))
* plugins manager & capabilities manager ([#1062](https://github.com/rudderlabs/rudder-sdk-js/issues/1062)) ([9d03bbd](https://github.com/rudderlabs/rudder-sdk-js/commit/9d03bbdea3bf2658f56580aa9bb8df2af9baf9a0))
* remove crypto based encryption for persistent data ([#1197](https://github.com/rudderlabs/rudder-sdk-js/issues/1197)) ([187b701](https://github.com/rudderlabs/rudder-sdk-js/commit/187b7016e75f092c54698fe7fe3652656943e35f))
* rename sdk file name ([#1190](https://github.com/rudderlabs/rudder-sdk-js/issues/1190)) ([0167e38](https://github.com/rudderlabs/rudder-sdk-js/commit/0167e384a05e1fa33b3da3b940f3952ee06ef21e))
* session tracking ([#1061](https://github.com/rudderlabs/rudder-sdk-js/issues/1061)) ([e46e98c](https://github.com/rudderlabs/rudder-sdk-js/commit/e46e98c5211aaccb325e4c1109d8c26e4c41394d))
* storage service improvements ([#1233](https://github.com/rudderlabs/rudder-sdk-js/issues/1233)) ([441fd60](https://github.com/rudderlabs/rudder-sdk-js/commit/441fd600c2e72e990518e45c972e43ce33567e7f))
* user session manager ([#1013](https://github.com/rudderlabs/rudder-sdk-js/issues/1013)) ([450cce0](https://github.com/rudderlabs/rudder-sdk-js/commit/450cce03bf09a5c3f3d93b6a6083173ddb6309d7))





# Change Log
