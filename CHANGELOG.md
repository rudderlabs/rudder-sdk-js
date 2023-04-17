# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.29.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.28.0...v1.29.0) (2023-04-17)


### Features

* bingads Upgraded to latest  ([#1002](https://github.com/rudderlabs/rudder-sdk-js/issues/1002)) ([054b79d](https://github.com/rudderlabs/rudder-sdk-js/commit/054b79d41a950dbc870e2310f84ac7d07c50366f))


### Bug Fixes

* **fb_pixel:** add value in mapped event ([#1004](https://github.com/rudderlabs/rudder-sdk-js/issues/1004)) ([76d00f5](https://github.com/rudderlabs/rudder-sdk-js/commit/76d00f53bd5133604dd20988d2d1988cb16d3930))
* **GA4:** add send_to parameter support by default ([#994](https://github.com/rudderlabs/rudder-sdk-js/issues/994)) ([78e21c9](https://github.com/rudderlabs/rudder-sdk-js/commit/78e21c9583b8aac8400f91551ef47541de7402e1))
* upgrade vulnerable dependencies ([#996](https://github.com/rudderlabs/rudder-sdk-js/issues/996)) ([5a178d8](https://github.com/rudderlabs/rudder-sdk-js/commit/5a178d80b81c7555e17d7ca63ad295f98b14f32e))

## [1.28.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.27.0...v1.28.0) (2023-04-03)


### Features

* **goole_ads:** enhanced conversions ([#969](https://github.com/rudderlabs/rudder-sdk-js/issues/969)) ([755a978](https://github.com/rudderlabs/rudder-sdk-js/commit/755a9781b67e61c74faffafe561d9c52b012852c))


### Bug Fixes

* **fb pixel:** ecomm ([#955](https://github.com/rudderlabs/rudder-sdk-js/issues/955)) ([5c35592](https://github.com/rudderlabs/rudder-sdk-js/commit/5c35592943502f19ffda206eadb4a750bbcaf28d))
* support bingAds for multiple tagIds ([#957](https://github.com/rudderlabs/rudder-sdk-js/issues/957)) ([7ec2fd7](https://github.com/rudderlabs/rudder-sdk-js/commit/7ec2fd72a76b57777c6177e10977604e501c05e8))
* **ua and ga4:** cookie conflicts ([#979](https://github.com/rudderlabs/rudder-sdk-js/issues/979)) ([6b8cb60](https://github.com/rudderlabs/rudder-sdk-js/commit/6b8cb60ffd6c4ccd5bbbf4bb46b5ebb3d827dfff))

## [1.27.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.26.0...v1.27.0) (2023-03-14)


### Bug Fixes

* **braze:** handle undefined products ([#939](https://github.com/rudderlabs/rudder-sdk-js/issues/939)) ([7fd6748](https://github.com/rudderlabs/rudder-sdk-js/commit/7fd6748069a8a1ef506af57eeff103a21c33ab9d))
* client_id mapping for ga4 ([#926](https://github.com/rudderlabs/rudder-sdk-js/issues/926)) ([5a3944e](https://github.com/rudderlabs/rudder-sdk-js/commit/5a3944e95b063750bc5ebe215137b2d898db1974))
* duplicate page views being sent to ga4 ([#924](https://github.com/rudderlabs/rudder-sdk-js/issues/924)) ([2964d04](https://github.com/rudderlabs/rudder-sdk-js/commit/2964d0483a14059f47a9565b1caf5660f84dc1af))
* duplicate userid sent to ga4 ([#928](https://github.com/rudderlabs/rudder-sdk-js/issues/928)) ([075fd72](https://github.com/rudderlabs/rudder-sdk-js/commit/075fd722eae53722057bd52e210698bc301f63fe))
* ga4 device mode debug_view ([#922](https://github.com/rudderlabs/rudder-sdk-js/issues/922)) ([70eee60](https://github.com/rudderlabs/rudder-sdk-js/commit/70eee60558ccfbcb1a291caa995a1eb035a8a8a4))
* traits are not being sent to ga4 group call ([#930](https://github.com/rudderlabs/rudder-sdk-js/issues/930)) ([4ef29d0](https://github.com/rudderlabs/rudder-sdk-js/commit/4ef29d0317f0861e05dc0e53e3657a883f047c8e))

## [1.26.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.25.0...v1.26.0) (2023-03-02)


### Features

* onetrust for cloud mode events ([#903](https://github.com/rudderlabs/rudder-sdk-js/issues/903)) ([57ac565](https://github.com/rudderlabs/rudder-sdk-js/commit/57ac56541c8b10456fecec2e0b5091fc4985f904))
* onLoaded callback option ([#917](https://github.com/rudderlabs/rudder-sdk-js/issues/917)) ([0cbfbda](https://github.com/rudderlabs/rudder-sdk-js/commit/0cbfbda3b20c9bd4882dfc174d633b73eaac00ae))
* user agent client hint info added in context ([#919](https://github.com/rudderlabs/rudder-sdk-js/issues/919)) ([3b8a6d1](https://github.com/rudderlabs/rudder-sdk-js/commit/3b8a6d1c31927f96eebf5b79e068fd00369ef081))


## [1.25.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.24.1...v1.25.0) (2023-02-20)


### Features

* **ga4:** add sent_to parameter in gtag event call ([#906](https://github.com/rudderlabs/rudder-sdk-js/issues/906)) ([e621560](https://github.com/rudderlabs/rudder-sdk-js/commit/e621560a9822c4e5faaa8e7a42ff5194bb66b67f))

### [1.24.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.24.0...v1.24.1) (2023-02-08)


### Bug Fixes

* added logic to capture full url for ga4 page_location param ([#891](https://github.com/rudderlabs/rudder-sdk-js/issues/891)) ([b997fb0](https://github.com/rudderlabs/rudder-sdk-js/commit/b997fb09542423b6b61ecd38c145d16001b3ac1a))
* googleads config order ([#889](https://github.com/rudderlabs/rudder-sdk-js/issues/889)) ([517b0d0](https://github.com/rudderlabs/rudder-sdk-js/commit/517b0d0cda77ce917ddf1e4fc2e6eb26b8972b07))
* reverted got package ([#895](https://github.com/rudderlabs/rudder-sdk-js/issues/895)) ([19fb7d2](https://github.com/rudderlabs/rudder-sdk-js/commit/19fb7d2eb9e7100cac4116f5c448ef79efa8f621))
* v1 staging security check issue ([#894](https://github.com/rudderlabs/rudder-sdk-js/issues/894)) ([52d1d09](https://github.com/rudderlabs/rudder-sdk-js/commit/52d1d09ddd0bcab6cdf75cd47ffd462408c0dbe0))

## [1.24.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.23.0...v1.24.0) (2023-02-06)


### Features

* added support for both click event and dynamic remarketing events ([#855](https://github.com/rudderlabs/rudder-sdk-js/issues/855)) ([97eda04](https://github.com/rudderlabs/rudder-sdk-js/commit/97eda04b2458ef2e99b98e763c2c99889401eff7))
* **bugbash:** adding bugbash tag condition ([#871](https://github.com/rudderlabs/rudder-sdk-js/issues/871)) ([a761d2a](https://github.com/rudderlabs/rudder-sdk-js/commit/a761d2a6215d42aa7722c7dcbdebe5b613c95337))
* **destination:** onboarding new destination lemnisk ([#857](https://github.com/rudderlabs/rudder-sdk-js/issues/857)) ([6319785](https://github.com/rudderlabs/rudder-sdk-js/commit/63197859aa985545bdeb6ea55b64cf9dffcd4c86))
* option to opt out from loading polyfill ([#879](https://github.com/rudderlabs/rudder-sdk-js/issues/879)) ([1ff688e](https://github.com/rudderlabs/rudder-sdk-js/commit/1ff688e763fabc10a78375dbc69efad4c79e959e))
* **test-suite:** adding test cases for majorly used util functions of web device mode integrations ([#861](https://github.com/rudderlabs/rudder-sdk-js/issues/861)) ([934a0ef](https://github.com/rudderlabs/rudder-sdk-js/commit/934a0ef1721f5bb93d59c114318d73373ebed446))


### Bug Fixes

* add support for more method overloads for group api  ([66986d8](https://github.com/rudderlabs/rudder-sdk-js/commit/66986d8e737527f5bf76e3c914d7fdf3fe8b7c78))
* fix method overload values on edge case of wrong usage ([5798db0](https://github.com/rudderlabs/rudder-sdk-js/commit/5798db0133166a3f1183b031633b032f7e85bd05))
* library info override bug  ([c993601](https://github.com/rudderlabs/rudder-sdk-js/commit/c9936016f9a7cce081c8f907a8acc552bce7b5a7))
* replace node globals & build-ins rollup plugins with polyfill-node to allow optional chaining ([3961d16](https://github.com/rudderlabs/rudder-sdk-js/commit/3961d162a7bc468a3ac90a01659f190a36ba8a39))
* use uuid secure (using crypto) for supported browsers  ([bebf3d0](https://github.com/rudderlabs/rudder-sdk-js/commit/bebf3d0e4c2eb6d22fec7bea2cac5708f2c21245))

### [1.23.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.23.0...v1.23.1) (2023-01-16)


### Bug Fixes

* **integrations:** facebook pixel advanced matching condition added ([#847](https://github.com/rudderlabs/rudder-sdk-js/issues/847)) ([208a15a](https://github.com/rudderlabs/rudder-sdk-js/commit/208a15a1acdcce53c7eae84d5dc51464d5c2a7f2))

## [1.23.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.22.0...v1.23.0) (2023-01-12)


### Features

* allow usage of OneTrust category ids or names ([#814](https://github.com/rudderlabs/rudder-sdk-js/issues/814)) ([611aa44](https://github.com/rudderlabs/rudder-sdk-js/commit/611aa44be577a82272d1cc188d1a8373944a8760))
* **braze:** make logging configurable ([#817](https://github.com/rudderlabs/rudder-sdk-js/issues/817)) ([7d4252d](https://github.com/rudderlabs/rudder-sdk-js/commit/7d4252d53be4691c51f39ecabe4581cc448a2296))
* clientId support in ga4 hybrid mode ([#827](https://github.com/rudderlabs/rudder-sdk-js/issues/827)) ([4d222e6](https://github.com/rudderlabs/rudder-sdk-js/commit/4d222e68e9569919e8bed979b9071c0c9489b04c))
* ga4 hybrid mode ([#808](https://github.com/rudderlabs/rudder-sdk-js/issues/808)) ([f051549](https://github.com/rudderlabs/rudder-sdk-js/commit/f051549944337faa7f5b1e8215ee36f357620098))
* ga4 hybrid mode support ([#805](https://github.com/rudderlabs/rudder-sdk-js/issues/805)) ([0ccb557](https://github.com/rudderlabs/rudder-sdk-js/commit/0ccb5574fc7e29a99ac37f21aa506a23be8a1249))
* getSessionId api in v1 ([#781](https://github.com/rudderlabs/rudder-sdk-js/issues/781)) ([1107b4e](https://github.com/rudderlabs/rudder-sdk-js/commit/1107b4ecbd1d325733a8d76d001d39085ac9b93b))
* **new integration:** onboarding sendinblue web device mode destination ([#785](https://github.com/rudderlabs/rudder-sdk-js/issues/785)) ([7314094](https://github.com/rudderlabs/rudder-sdk-js/commit/73140949b6ef7a96bd4bd5fbd3ba7f401348ae44))
* onboard ga4 hybrid mode ([#747](https://github.com/rudderlabs/rudder-sdk-js/issues/747)) ([cd88940](https://github.com/rudderlabs/rudder-sdk-js/commit/cd88940c6a72d8648efbe953b42db0b5528d580a))
* onboard olark web device mode ([#762](https://github.com/rudderlabs/rudder-sdk-js/issues/762)) ([fc35c6c](https://github.com/rudderlabs/rudder-sdk-js/commit/fc35c6cfe46c9e8012cd89569bf9844b6a1f8079))
* **pinterest:** add ldp support ([#810](https://github.com/rudderlabs/rudder-sdk-js/issues/810)) ([f427d03](https://github.com/rudderlabs/rudder-sdk-js/commit/f427d03d32c12f6d48244b25e8627c963888d629))


### Bug Fixes

* **destination:** facebook pixel userData capturing fix for both identified and annonymous users ([#790](https://github.com/rudderlabs/rudder-sdk-js/issues/790)) ([120494c](https://github.com/rudderlabs/rudder-sdk-js/commit/120494c70fd00b04a9490e2a35320ff8bd404767))
* detection of sessionId for GA4 if no cookie exists, add unit test ([#820](https://github.com/rudderlabs/rudder-sdk-js/issues/820)) ([7024248](https://github.com/rudderlabs/rudder-sdk-js/commit/70242484b4fc7855dcab027f28142c8e01f2e49f))
* ga4 cookie issue ([#829](https://github.com/rudderlabs/rudder-sdk-js/issues/829)) ([d6bddb2](https://github.com/rudderlabs/rudder-sdk-js/commit/d6bddb2c725697ae28941ead2fe6bcab4fb8cea9))
* ga4- fix total to price for events ([#822](https://github.com/rudderlabs/rudder-sdk-js/issues/822)) ([279b780](https://github.com/rudderlabs/rudder-sdk-js/commit/279b7804c038c4f0d47a6587900aaa21a11a70da))
* reverting the changes made in  bing ads integration ([#792](https://github.com/rudderlabs/rudder-sdk-js/issues/792)) ([774a843](https://github.com/rudderlabs/rudder-sdk-js/commit/774a84399fb909b759ae1742de0822d93c8ec7b1))
* upgrade vulnerable dependencies ([#816](https://github.com/rudderlabs/rudder-sdk-js/issues/816)) ([c6067d3](https://github.com/rudderlabs/rudder-sdk-js/commit/c6067d38d4d7ca220badd27c91de4db37e27a031))

## [v1.22.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.21.0...v1.22.0) - 2022-12-07

### Merged

- ci: auto trigger staging deploy, fix npm install [`#759`](https://github.com/rudderlabs/rudder-sdk-js/pull/759)
- ci: deprecated aws codepipeline, add github actions to deploy to aws [`#755`](https://github.com/rudderlabs/rudder-sdk-js/pull/755)
- feat: added event_value field in bing ads payload [`#746`](https://github.com/rudderlabs/rudder-sdk-js/pull/746)
- feat/axeptio: onboard web device mode destination axeptio [`#743`](https://github.com/rudderlabs/rudder-sdk-js/pull/743)
- fix(destination): custom properties support in ga4 [`#719`](https://github.com/rudderlabs/rudder-sdk-js/pull/719)
- feat: ga4 hybrid mode support [`#731`](https://github.com/rudderlabs/rudder-sdk-js/pull/731)
- fix(destination): updated bing ads syntax as per the updated Microsoft's syntax [`#740`](https://github.com/rudderlabs/rudder-sdk-js/pull/740)
- feat(destination): add dedup support for identify call in Braze [`#728`](https://github.com/rudderlabs/rudder-sdk-js/pull/728)
- feat(destination): onboard satismeter [`#732`](https://github.com/rudderlabs/rudder-sdk-js/pull/732)
- feat : onboard microsoft clarity [`#739`](https://github.com/rudderlabs/rudder-sdk-js/pull/739)
- fix: illegal invocation issue for sendBeacon [`#735`](https://github.com/rudderlabs/rudder-sdk-js/pull/735)
- feat: onboarding microsoft clarity [`#733`](https://github.com/rudderlabs/rudder-sdk-js/pull/733)
- feature: posthog option to not load core sdk [`#723`](https://github.com/rudderlabs/rudder-sdk-js/pull/723)
- feat: messageId format updated [`#684`](https://github.com/rudderlabs/rudder-sdk-js/pull/684)

### Commits

- ci: fix the deploy github action for v1-staging [`80fbafc`](https://github.com/rudderlabs/rudder-sdk-js/commit/80fbafccd7e14d515cc8ad232d35cc098a5f48cc)

## [v1.21.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.20.0...v1.21.0) - 2022-11-08

### Merged

- Revert "feat: add utility to generate integration common names automatically" [`#725`](https://github.com/rudderlabs/rudder-sdk-js/pull/725)
- feat: add utility to generate integration common names automatically [`#685`](https://github.com/rudderlabs/rudder-sdk-js/pull/685)
- feat(Podsights): Onboarding new destination [`#709`](https://github.com/rudderlabs/rudder-sdk-js/pull/709)
- feat(new integration): onboarding qualaroo device mode destination [`#715`](https://github.com/rudderlabs/rudder-sdk-js/pull/715)
- enhancement [integration] : pinterest tag user defined event support [`#717`](https://github.com/rudderlabs/rudder-sdk-js/pull/717)

### Commits

- chore: release v1.21.0 [`0b80005`](https://github.com/rudderlabs/rudder-sdk-js/commit/0b80005769b4117f75a4bda70726762560021909)

## [v1.20.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.19.0...v1.20.0) - 2022-10-31

### Merged

- feat(dcm floodlight): add iframe support [`#698`](https://github.com/rudderlabs/rudder-sdk-js/pull/698)
- fix: convert non-string userId to a string [`#706`](https://github.com/rudderlabs/rudder-sdk-js/pull/706)
- feat: refiner device mode integration [`#710`](https://github.com/rudderlabs/rudder-sdk-js/pull/710)
- refactor: remove global lodash dependency [`#708`](https://github.com/rudderlabs/rudder-sdk-js/pull/708)

### Commits

- chore: release SDK v1.20.0 [`1e46d6a`](https://github.com/rudderlabs/rudder-sdk-js/commit/1e46d6ae229d88365d207fab35856dfd504c944c)

## [v1.19.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.18.0...v1.19.0) - 2022-10-25

### Merged

- fix: refiner device mode code removed [`#705`](https://github.com/rudderlabs/rudder-sdk-js/pull/705)
- fix: refiner group call email conflicts issue [`#699`](https://github.com/rudderlabs/rudder-sdk-js/pull/699)
- fix(ga): adding support of revenue along with total. [`#690`](https://github.com/rudderlabs/rudder-sdk-js/pull/690)
- feat: posthog group call support [`#688`](https://github.com/rudderlabs/rudder-sdk-js/pull/688)
- feat(new integration): refiner onboarding  [`#682`](https://github.com/rudderlabs/rudder-sdk-js/pull/682)

### Commits

- chore: release SDK v1.19.0 [`0924221`](https://github.com/rudderlabs/rudder-sdk-js/commit/0924221f522db8742549c34a28fa2678581f40a8)

## [v1.18.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.17.0...v1.18.0) - 2022-10-19

### Merged

- chore(buildspec): node version updated [`#683`](https://github.com/rudderlabs/rudder-sdk-js/pull/683)
- fix: common names map update [`#681`](https://github.com/rudderlabs/rudder-sdk-js/pull/681)
- feat(new-integration): onboarding yandex.metrica destination [`#671`](https://github.com/rudderlabs/rudder-sdk-js/pull/671)

### Commits

- chore: release SDK v1.18.0 [`4128086`](https://github.com/rudderlabs/rudder-sdk-js/commit/41280864e25207c8e535941bacf223f5a125fafc)

## [v1.17.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.16.0...v1.17.0) - 2022-10-12

### Merged

- feat: improved page/track calls braze [`#669`](https://github.com/rudderlabs/rudder-sdk-js/pull/669)
- feat(new integration): Iterable - onboard integration [`#670`](https://github.com/rudderlabs/rudder-sdk-js/pull/670)
- feat(june): set log level [`#675`](https://github.com/rudderlabs/rudder-sdk-js/pull/675)
- feat(new integration): Onboarding Engage Device Mode [`#662`](https://github.com/rudderlabs/rudder-sdk-js/pull/662)
- feat(integration): add multiplexing support to Pinterest Tag [`#659`](https://github.com/rudderlabs/rudder-sdk-js/pull/659)
- feat(new integration): onboarding june device mode destination [`#663`](https://github.com/rudderlabs/rudder-sdk-js/pull/663)
- Fix: Permission denied accessing error message [`#613`](https://github.com/rudderlabs/rudder-sdk-js/pull/613)
- feat(quora pixel): add warn logs for track API [`#660`](https://github.com/rudderlabs/rudder-sdk-js/pull/660)
- feat: enhanced logger module [`#657`](https://github.com/rudderlabs/rudder-sdk-js/pull/657)

### Commits

- chore: release SDK v1.17.0 [`3fca155`](https://github.com/rudderlabs/rudder-sdk-js/commit/3fca155a7963b37d87b148d06281dd30f456483d)
- chore: trigger commit [`5d215cf`](https://github.com/rudderlabs/rudder-sdk-js/commit/5d215cf232836c61de168fb6ccf4b4dd1a1f0301)
- chore: update code owners for integrations [`8855817`](https://github.com/rudderlabs/rudder-sdk-js/commit/88558178e7fe1e5508ccf593352db0383922563e)
- chore: update code owners for integrations [`134736e`](https://github.com/rudderlabs/rudder-sdk-js/commit/134736e41feafd09e992ad74d3bb00a3e51a8aad)

## [v1.16.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.15.0...v1.16.0) - 2022-09-21

### Merged

- fix(integration): update error message in LinkedIn Insight Tag [`#656`](https://github.com/rudderlabs/rudder-sdk-js/pull/656)
- feat (core): user session [`#637`](https://github.com/rudderlabs/rudder-sdk-js/pull/637)

### Commits

- chore: release SDK v1.16.0 with changelog [`53cc9fb`](https://github.com/rudderlabs/rudder-sdk-js/commit/53cc9fb05b1f9a3b99eacd58a9995c623e4fe2e6)
- chore: release SDK v1.16.0 [`9e2672e`](https://github.com/rudderlabs/rudder-sdk-js/commit/9e2672e55e5251b5c39cedd635d048b22bdefcdc)

## [v1.15.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.14.0...v1.15.0) - 2022-09-15

### Merged

- feat(integration): add common util function for mapping event names in ads destinations [`#643`](https://github.com/rudderlabs/rudder-sdk-js/pull/643)
- feat(LinkedIn Insights Tag): add support for event-specific conversion [`#648`](https://github.com/rudderlabs/rudder-sdk-js/pull/648)
- feature(new integration): Woopra Device Mode Onboarding [`#645`](https://github.com/rudderlabs/rudder-sdk-js/pull/645)
- feature(new integration): RollBar web Device mode integration onboarding [`#646`](https://github.com/rudderlabs/rudder-sdk-js/pull/646)
- feat(quora pixel): add data-loader attribute [`#649`](https://github.com/rudderlabs/rudder-sdk-js/pull/649)
- feat(new integration): quora pixel device mode destination onboarding [`#647`](https://github.com/rudderlabs/rudder-sdk-js/pull/647)

### Commits

- chore: release SDK v1.15.0 [`34c546d`](https://github.com/rudderlabs/rudder-sdk-js/commit/34c546d07dce65445ca57e5025d9f7a93233cc6f)

## [v1.14.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.13.3...v1.14.0) - 2022-09-07

### Merged

- Upgrade/braze web sdk [`#617`](https://github.com/rudderlabs/rudder-sdk-js/pull/617)
- feature(new integration): LiveChat web Device mode integration onboarding [`#633`](https://github.com/rudderlabs/rudder-sdk-js/pull/633)
- Enhancement(Integration): Pinterest Tag event_id added for deduplication + custom event support [`#635`](https://github.com/rudderlabs/rudder-sdk-js/pull/635)
- feature(new integration): shynet-destination [`#630`](https://github.com/rudderlabs/rudder-sdk-js/pull/630)

### Commits

- chore: release SDK v1.14.0 [`d30bdcb`](https://github.com/rudderlabs/rudder-sdk-js/commit/d30bdcbc0aa17b7dda7397efa8127365c5e03e43)

## [v1.13.3](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.13.2...v1.13.3) - 2022-09-05

### Merged

- feat (rockerbox): add anonymousId for all calls [`#636`](https://github.com/rudderlabs/rudder-sdk-js/pull/636)
- Feature(Intercom): Adding support of flattenJson in track call properties. [`#629`](https://github.com/rudderlabs/rudder-sdk-js/pull/629)
- bugfix(non CFD): SnapEngage - adding name field in constructor [`#632`](https://github.com/rudderlabs/rudder-sdk-js/pull/632)

### Commits

- chore: release SDK v1.13.3 [`47cfa00`](https://github.com/rudderlabs/rudder-sdk-js/commit/47cfa0029b423551a7ae70a5065541dfd4384e9b)

## [v1.13.2](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.13.1...v1.13.2) - 2022-08-30

### Merged

- fix(snappixel): cookie check [`#626`](https://github.com/rudderlabs/rudder-sdk-js/pull/626)
- Added support for configurable SameSite in v1 [`#627`](https://github.com/rudderlabs/rudder-sdk-js/pull/627)

### Commits

- chore: release SDK v1.13.2 [`1d08134`](https://github.com/rudderlabs/rudder-sdk-js/commit/1d081340acc884844ab273e230ed978de97565fa)

## [v1.13.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.13.0...v1.13.1) - 2022-08-24

### Merged

- Bug fix for MP consolidatedPageCalls [`#622`](https://github.com/rudderlabs/rudder-sdk-js/pull/622)

### Commits

- chore: release SDK v1.13.1 [`83eee31`](https://github.com/rudderlabs/rudder-sdk-js/commit/83eee310d901d6c9d5784ec837e94b6bc99c074e)

## [v1.13.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.12.1...v1.13.0) - 2022-08-23

### Merged

- Revert "Fix: VWO loadintegration option" changes [`#618`](https://github.com/rudderlabs/rudder-sdk-js/pull/618)
- Fix: VWO loadintegration option [`#614`](https://github.com/rudderlabs/rudder-sdk-js/pull/614)
- bugfix(ConvertFlow): correcting typo in event name [`#616`](https://github.com/rudderlabs/rudder-sdk-js/pull/616)
- feature(enhancement): adding the loader dataset attribute to the script tag [`#615`](https://github.com/rudderlabs/rudder-sdk-js/pull/615)
- feature(new integration): SnapEngage web Device mode integration onboarding [`#612`](https://github.com/rudderlabs/rudder-sdk-js/pull/612)
- feature/new integration: Convertflow onboarding [`#611`](https://github.com/rudderlabs/rudder-sdk-js/pull/611)

### Commits

- chore: release SDK v1.13.0 [`1ac9d3b`](https://github.com/rudderlabs/rudder-sdk-js/commit/1ac9d3be139500ae86ce5441f58c5cfe81a87137)
- chore(build): trigger commit [`5044044`](https://github.com/rudderlabs/rudder-sdk-js/commit/5044044af348d7ea072374f1d2b15d49f71b43d0)

## [v1.12.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.12.0...v1.12.1) - 2022-08-09

### Merged

- feature/new integration: RockerBox onboarding [`#597`](https://github.com/rudderlabs/rudder-sdk-js/pull/597)
- Feature(Fb Pixel): Compatibilty with cloud mode [`#594`](https://github.com/rudderlabs/rudder-sdk-js/pull/594)
- feature(Intercom):: Adding support of avatar and refactoring code. [`#605`](https://github.com/rudderlabs/rudder-sdk-js/pull/605)

### Commits

- chore: release v1.12.1 [`34e3fae`](https://github.com/rudderlabs/rudder-sdk-js/commit/34e3faed3f928a174c7bcd7a6695bf16f675696f)

## [v1.12.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.11.4...v1.12.0) - 2022-08-05

### Merged

- feature(event filtering): criteo onetag [`#595`](https://github.com/rudderlabs/rudder-sdk-js/pull/595)
- feature/mouseflow: new Integration Onboarding [`#590`](https://github.com/rudderlabs/rudder-sdk-js/pull/590)
- Fix: dataset attribute syntax updated in scriptLoader [`#598`](https://github.com/rudderlabs/rudder-sdk-js/pull/598)
- Added polyfills for unsupported functions [`#591`](https://github.com/rudderlabs/rudder-sdk-js/pull/591)
- Filter script loading errors from native SDKs [`#587`](https://github.com/rudderlabs/rudder-sdk-js/pull/587)
- Launchdarkly Fix [`#592`](https://github.com/rudderlabs/rudder-sdk-js/pull/592)
- Fix: source config fetch error handled [`#582`](https://github.com/rudderlabs/rudder-sdk-js/pull/582)
- Enhancement in  Bugsnag error filtering [`#581`](https://github.com/rudderlabs/rudder-sdk-js/pull/581)

### Commits

- chore: bumped version and regenerated changelog [`323bc5e`](https://github.com/rudderlabs/rudder-sdk-js/commit/323bc5e0da3360055997db4e8c22084f0e4b6990)

## [v1.11.4](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.11.3...v1.11.4) - 2022-07-28

### Merged

- Fix a bug in INTERCOM browser.js [`#572`](https://github.com/rudderlabs/rudder-sdk-js/pull/572)

### Commits

- Regenerated changelog [`99f157a`](https://github.com/rudderlabs/rudder-sdk-js/commit/99f157a5ca18ce78bf6a35a698e226627af87e86)
- Bumped version [`b3c4985`](https://github.com/rudderlabs/rudder-sdk-js/commit/b3c4985be4d4a4b98bc4a32b5ec9e1b6bb7e4b5a)

## [v1.11.3](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.11.2...v1.11.3) - 2022-07-26

### Merged

- Fix: Added validation for userAgent in brave browser [`#574`](https://github.com/rudderlabs/rudder-sdk-js/pull/574)

### Commits

- Regenerated changelog [`a841644`](https://github.com/rudderlabs/rudder-sdk-js/commit/a841644ba4555ab2bb6f70f00f34426886341936)
- Bumped version [`d0df0cb`](https://github.com/rudderlabs/rudder-sdk-js/commit/d0df0cbd8093d4ff5f8299eb525c59af7330cbe6)

## [v1.11.2](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.11.1...v1.11.2) - 2022-07-22

### Merged

- support launchdarkly key override for anonymous users [`#575`](https://github.com/rudderlabs/rudder-sdk-js/pull/575)
- Fix: Accessing dead object error in Firefox [`#567`](https://github.com/rudderlabs/rudder-sdk-js/pull/567)
- feature/ga4 debug mode support [`#565`](https://github.com/rudderlabs/rudder-sdk-js/pull/565)

### Commits

- Regenerated changelog [`5d06cb1`](https://github.com/rudderlabs/rudder-sdk-js/commit/5d06cb13dc5e1ed8bc5b4592f9de0eea558af2f0)
- Bumped version [`590a4b7`](https://github.com/rudderlabs/rudder-sdk-js/commit/590a4b7d64e5028aae101144969ea0dd177050c3)
- fix: undefined 'referrer' [`58b460e`](https://github.com/rudderlabs/rudder-sdk-js/commit/58b460ed9b01d9bda18a7c8e5abcc4a5bdd56b4b)
- bugfix(SnapPixel): update init, identify and add feature to customise dedupKey(#571) [`7731e33`](https://github.com/rudderlabs/rudder-sdk-js/commit/7731e33e63969b5e001c3ffa86029a31bf3b3f6d)

## [v1.11.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.11.0...v1.11.1) - 2022-07-12

### Merged

- bugfix(non CFD): Matomo customDimensions error [`#558`](https://github.com/rudderlabs/rudder-sdk-js/pull/558)
- feature[Vero-web-device-mode]: bugfix/vero: Vero tags object checked [`#559`](https://github.com/rudderlabs/rudder-sdk-js/pull/559)

### Commits

- Regnerated changelog [`39346e1`](https://github.com/rudderlabs/rudder-sdk-js/commit/39346e17209853a4080a6e3d824c0f8681df83a2)
- Bumped version [`f7e6175`](https://github.com/rudderlabs/rudder-sdk-js/commit/f7e6175dc12bc4e12fd54477f1b1d9a2d522b3a6)

## [v1.11.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.10.0...v1.11.0) - 2022-07-11

### Merged

- Fix: Use standard library for UUID generation [`#554`](https://github.com/rudderlabs/rudder-sdk-js/pull/554)
- feature(new integration): Matomo web Device mode integration onboarding [`#550`](https://github.com/rudderlabs/rudder-sdk-js/pull/550)
- feature(Vero-web-device-mode): new Integrations Vero web device mode [`#549`](https://github.com/rudderlabs/rudder-sdk-js/pull/549)
- Fix: handled undefined integration obj error [`#551`](https://github.com/rudderlabs/rudder-sdk-js/pull/551)

### Commits

- Regnerated changelog [`193ec10`](https://github.com/rudderlabs/rudder-sdk-js/commit/193ec1032b78b2f7cec705cb10a1dd6b269bad81)
- Bumped version [`167f39c`](https://github.com/rudderlabs/rudder-sdk-js/commit/167f39c6edd9b8e19a2c2cf4c258845072ce5a99)

## [v1.10.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.9.0...v1.10.0) - 2022-06-21

### Merged

- Crash reporting metrics implementation with Bugsnag [`#520`](https://github.com/rudderlabs/rudder-sdk-js/pull/520)

### Commits

- Regnerated changelog [`b68deda`](https://github.com/rudderlabs/rudder-sdk-js/commit/b68deda775b8786dded4a6745354e9c0baec11d2)
- Bumped version [`6596dff`](https://github.com/rudderlabs/rudder-sdk-js/commit/6596dff6d12fe40f7711832ba0298d540e12fdc5)

## [v1.9.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.8.0...v1.9.0) - 2022-06-14

### Merged

- feature(integration): DCM - add support to take custom variable from properties  [`#540`](https://github.com/rudderlabs/rudder-sdk-js/pull/540)

### Commits

- Regenerated changelog [`ce3fa8b`](https://github.com/rudderlabs/rudder-sdk-js/commit/ce3fa8bde55da3e5747cef514832b4dd3230273b)
- Bumped version [`5c8500b`](https://github.com/rudderlabs/rudder-sdk-js/commit/5c8500ba63a821ebca1148a638a8efbc77710dbb)

## [v1.8.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.7.2...v1.8.0) - 2022-06-09

### Merged

- fix(braze): adding dynamic support for eu data center [`#541`](https://github.com/rudderlabs/rudder-sdk-js/pull/541)
- fix page call event name to name category format [`#536`](https://github.com/rudderlabs/rudder-sdk-js/pull/536)
- feature(new integration): DCM device mode integration onboarding [`#515`](https://github.com/rudderlabs/rudder-sdk-js/pull/515)

### Commits

- Regnerated changelog [`dede593`](https://github.com/rudderlabs/rudder-sdk-js/commit/dede593e87f6d7dcf727117f300eeff307d22408)
- Bumped version [`a234dfc`](https://github.com/rudderlabs/rudder-sdk-js/commit/a234dfcc167eb9fbdee341b5da7763e5e20e7b27)

## [v1.7.2](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.7.1...v1.7.2) - 2022-05-30

### Merged

- Align Ready method's behaviour   [`#522`](https://github.com/rudderlabs/rudder-sdk-js/pull/522)

### Commits

- Regenerated changelog [`5b7a182`](https://github.com/rudderlabs/rudder-sdk-js/commit/5b7a182ccfb4dcc50d157308cd9499c66f2557f5)
- Bumped version [`a3a0287`](https://github.com/rudderlabs/rudder-sdk-js/commit/a3a0287ae766472b98a612c5d75d5d4ff04a26d7)
- Trigger commit [`22092f7`](https://github.com/rudderlabs/rudder-sdk-js/commit/22092f7c163aab4b417c7d723aeee870170dc868)
- Regenerated changelog [`d18425c`](https://github.com/rudderlabs/rudder-sdk-js/commit/d18425c2029713305680834dc87137fcc92b018e)

## [v1.7.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.7.0...v1.7.1) - 2022-05-14

### Merged

- fb pixel returns reverted [`#518`](https://github.com/rudderlabs/rudder-sdk-js/pull/518)

### Commits

- Regenerated changelog [`a077af9`](https://github.com/rudderlabs/rudder-sdk-js/commit/a077af9a219f52a79fa9b0e6f2ca6c35b58c5b5d)

## [v1.7.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.6.3...v1.7.0) - 2022-05-11

### Merged

- feature(new integration): Adroll Web Device Mode  [`#504`](https://github.com/rudderlabs/rudder-sdk-js/pull/504)

### Commits

- fix: corrected the rules in CODEOWNERS file [`a4ceda3`](https://github.com/rudderlabs/rudder-sdk-js/commit/a4ceda3cdfbd7f06b414db1b3bc4c102823c9434)
- Regenerated changelog [`6768767`](https://github.com/rudderlabs/rudder-sdk-js/commit/67687676e389c1cb90d81038acf1c5fb930d1520)

## [v1.6.3](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.6.2...v1.6.3) - 2022-05-09

### Merged

- Fix product id, quantity and price mapping [`#502`](https://github.com/rudderlabs/rudder-sdk-js/pull/502)

### Commits

- Regenerated changelog [`abb5163`](https://github.com/rudderlabs/rudder-sdk-js/commit/abb51638cde6ce13e20ee6a12c07bbfaac32a3f1)

## [v1.6.2](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.6.1...v1.6.2) - 2022-05-07

### Commits

- fix: 'IsCookieSupported' method doesn't exist [`b9db102`](https://github.com/rudderlabs/rudder-sdk-js/commit/b9db1022e6763f3448807d65e489c30a3099c554)

## [v1.6.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.4.3...v1.6.1) - 2022-04-29

### Merged

- Feature: Allow API calls before load [`#507`](https://github.com/rudderlabs/rudder-sdk-js/pull/507)
- Feature: Auto capture anonymous id  [`#497`](https://github.com/rudderlabs/rudder-sdk-js/pull/497)
- Bug fix (fb_pixel): wrongly mapped event_id  [`#501`](https://github.com/rudderlabs/rudder-sdk-js/pull/501)
- bug-fix event name is integer or special character [`#498`](https://github.com/rudderlabs/rudder-sdk-js/pull/498)
- Snap Pixelfeature (enhancements):  [`#496`](https://github.com/rudderlabs/rudder-sdk-js/pull/496)
- FB Pixel utils: Added validation for event_id values [`#492`](https://github.com/rudderlabs/rudder-sdk-js/pull/492)
- FB Pixel: Added object validations in getEventId function [`#491`](https://github.com/rudderlabs/rudder-sdk-js/pull/491)
- Allow empty event names in device mode event filtering [`#489`](https://github.com/rudderlabs/rudder-sdk-js/pull/489)
- FB util file renamed and fixed `originalTimestamp` override [`#488`](https://github.com/rudderlabs/rudder-sdk-js/pull/488)
- Facebook Pixel event_id discrepancy [`#486`](https://github.com/rudderlabs/rudder-sdk-js/pull/486)
- client_server_name file updated [`#477`](https://github.com/rudderlabs/rudder-sdk-js/pull/477)
- GA 360 integration [`#473`](https://github.com/rudderlabs/rudder-sdk-js/pull/473)
- added prefix and suffix to name and category [`#470`](https://github.com/rudderlabs/rudder-sdk-js/pull/470)

### Commits

- Regenerated changelog [`e194972`](https://github.com/rudderlabs/rudder-sdk-js/commit/e194972fa7950e95b561a814f82b775547bd49dc)
- Bumped version [`1bf0bff`](https://github.com/rudderlabs/rudder-sdk-js/commit/1bf0bff9d4ce1af3e9c7c88ccb7bbe55e06a4491)
- Regenerated changelog [`0483373`](https://github.com/rudderlabs/rudder-sdk-js/commit/0483373811302c2a87d6c2cef4d8ca0df1478e3c)
- Bumped version [`bd300be`](https://github.com/rudderlabs/rudder-sdk-js/commit/bd300bee03e86e60a1575005f574744c11944a5f)
- Regenerated changelog [`0660980`](https://github.com/rudderlabs/rudder-sdk-js/commit/0660980938bbdd1a7a0f20f8c11ebfa2b5f08410)
- Bumped version [`5e5897f`](https://github.com/rudderlabs/rudder-sdk-js/commit/5e5897f799d1d781c9f225d80e840cf245466327)
- Regnerated changelog [`8b0e28f`](https://github.com/rudderlabs/rudder-sdk-js/commit/8b0e28fbe35b7dc1f100901d514c878d50f7cbc4)
- Bumped version [`1ff92bf`](https://github.com/rudderlabs/rudder-sdk-js/commit/1ff92bf37345f98e0b7c616807bd5356a37a4bd4)
- Regnerated changelog [`e03eaa8`](https://github.com/rudderlabs/rudder-sdk-js/commit/e03eaa8c0eeed802df828fb50bb0a0ebd2fce077)
- Bumped versions [`32a3b9a`](https://github.com/rudderlabs/rudder-sdk-js/commit/32a3b9a7fa47c95f6717ce6167400b451a7b961c)
- Bumped version [`4527173`](https://github.com/rudderlabs/rudder-sdk-js/commit/452717316b81bffedbd13da15680feab9a29d221)
- Bumped version [`9daae82`](https://github.com/rudderlabs/rudder-sdk-js/commit/9daae822047c87bf9db3604876acf9fed7c855c3)
- Bumped version [`e4e30dd`](https://github.com/rudderlabs/rudder-sdk-js/commit/e4e30ddee927dde48f133c0c67eb92d693eab0fc)
- Bumped version [`7ca4eac`](https://github.com/rudderlabs/rudder-sdk-js/commit/7ca4eac608389ad7b91036cd00b2e0de8a01d69b)
- reduced repeated function call [`2e5b513`](https://github.com/rudderlabs/rudder-sdk-js/commit/2e5b5133fb6664a56bcc3a5e6ba459127517195d)
- updated util.js file path [`48ecef1`](https://github.com/rudderlabs/rudder-sdk-js/commit/48ecef1adeec119290f7ce4a276ea88504c5ccb7)
- Update integrations/FacebookPixel/browser.js [`bb3770d`](https://github.com/rudderlabs/rudder-sdk-js/commit/bb3770d1a05283f216aa5fcf80fbf1c34179354d)
- fixing code errors [`d646564`](https://github.com/rudderlabs/rudder-sdk-js/commit/d6465646a79053e92991dae64940564afb46f335)
- created util function [`8188e7e`](https://github.com/rudderlabs/rudder-sdk-js/commit/8188e7ebeaaa0d3769a64181274f1c307212b7e6)
- assigning event_id as per cloud mode [`a8025f2`](https://github.com/rudderlabs/rudder-sdk-js/commit/a8025f2ba852f3b5dba559479286c0d11b9dbdc2)
- Bumped version [`e60b529`](https://github.com/rudderlabs/rudder-sdk-js/commit/e60b52922ab4694081fb7b96623808c320934715)
- Bumped version [`e284d00`](https://github.com/rudderlabs/rudder-sdk-js/commit/e284d00c1c8dd41b91605f5b2cb288b8367478c5)
- Changed order in CODEOWNERS [`2b11480`](https://github.com/rudderlabs/rudder-sdk-js/commit/2b11480c5780a593e543b68ff1f809458fa6f021)
- Added code owners [`8fcd150`](https://github.com/rudderlabs/rudder-sdk-js/commit/8fcd15010280e4c20ed9e3cf3ced6f9ac554ec84)
- Bumped version [`d2e8152`](https://github.com/rudderlabs/rudder-sdk-js/commit/d2e815206583a287f32bff80103c0a9a302c0104)
- getUserId added to the declaration file [`83c2742`](https://github.com/rudderlabs/rudder-sdk-js/commit/83c2742b2a47855be471c823bd7f90d1768f2586)
- Added CODEOWNERS file [`3270abe`](https://github.com/rudderlabs/rudder-sdk-js/commit/3270abe4f9947d9382789c836f25980d3830da0b)
- Identify traits update for Facebook Pixel [`379b53d`](https://github.com/rudderlabs/rudder-sdk-js/commit/379b53d363a8456030b5ca9eb743342aaa7e01e6)
- Trigger commit [`93f0811`](https://github.com/rudderlabs/rudder-sdk-js/commit/93f0811f4b60fb38daf5c616e1fed1eba4085925)
- Node version upgraded to 12 [`fd6aff7`](https://github.com/rudderlabs/rudder-sdk-js/commit/fd6aff764da65fa56f9941bc5e8612b6b4e8de26)
- Node version upgraded to 12 [`f27385e`](https://github.com/rudderlabs/rudder-sdk-js/commit/f27385e7f15355ac9abfe314e536c6f7a64618bc)

## [v1.4.3](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.4.2...v1.4.3) - 2022-02-21

### Merged

- VWO: added load-integration flag, logger cleanup [`#463`](https://github.com/rudderlabs/rudder-sdk-js/pull/463)

### Commits

- Regnerated changelog [`42402f3`](https://github.com/rudderlabs/rudder-sdk-js/commit/42402f3df508427a91c503415cabad9c172003e0)
- Bumped version [`02f01c3`](https://github.com/rudderlabs/rudder-sdk-js/commit/02f01c31efebbc3e2e184e34eeda6568111e0a45)

## [v1.4.2](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.4.1...v1.4.2) - 2022-02-17

### Merged

- Staging -&gt; production [beacon fallback added (#460)] [`#461`](https://github.com/rudderlabs/rudder-sdk-js/pull/461)
- version bumped [`#462`](https://github.com/rudderlabs/rudder-sdk-js/pull/462)
- beacon fallback added [`#460`](https://github.com/rudderlabs/rudder-sdk-js/pull/460)

### Commits

- Regenerated changelog [`e30e0d7`](https://github.com/rudderlabs/rudder-sdk-js/commit/e30e0d7e3e0d9f2269648f96ca67524b4d83124a)
- Bumped version [`7fd70db`](https://github.com/rudderlabs/rudder-sdk-js/commit/7fd70dbb0c824df9bd948f9d34c96adeb5aa54b1)
- Pointed to the default branch in size-limit.yml [`d141aaa`](https://github.com/rudderlabs/rudder-sdk-js/commit/d141aaae4711881d12cb06c5106febac02741a0d)
- Re-generated stats.html [`97ebae5`](https://github.com/rudderlabs/rudder-sdk-js/commit/97ebae5e65a3d857af85ea38e9bc29a121794945)

## [v1.4.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.4.0...v1.4.1) - 2022-02-14

### Merged

- apiObject in ts declaration updated [`#453`](https://github.com/rudderlabs/rudder-sdk-js/pull/453)

### Commits

- Changelog updated [`5f59ace`](https://github.com/rudderlabs/rudder-sdk-js/commit/5f59ace1a4d0fe517bd0ec7c317c411da4384437)
- Bumped version [`2c6ef94`](https://github.com/rudderlabs/rudder-sdk-js/commit/2c6ef942bb2543f644c19fb573dbcd71cc1a6d75)

## [v1.4.0](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.3.4...v1.4.0) - 2022-02-11

### Merged

- IE support related changes (#449) [`#450`](https://github.com/rudderlabs/rudder-sdk-js/pull/450)
- IE support related changes [`#449`](https://github.com/rudderlabs/rudder-sdk-js/pull/449)

### Commits

- Bumped version [`bbd72b6`](https://github.com/rudderlabs/rudder-sdk-js/commit/bbd72b653c66bfd1cc6a025113b17f60457e4a65)
- Restored  check in load API [`845f5b3`](https://github.com/rudderlabs/rudder-sdk-js/commit/845f5b3e005f08af90b0f391fa9fc184c6c97084)

## [v1.3.4](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.3.3...v1.3.4) - 2022-02-03

### Merged

- Single source integration names [`#442`](https://github.com/rudderlabs/rudder-sdk-js/pull/442)
- deleting duplicate fields price, productId and quantity for revenue payload [`#443`](https://github.com/rudderlabs/rudder-sdk-js/pull/443)

### Commits

- Bumped version [`56fd706`](https://github.com/rudderlabs/rudder-sdk-js/commit/56fd7069472d074192a8c714815db81bd7cf2244)

## [v1.3.3](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.3.2...v1.3.3) - 2022-01-25

### Merged

- staging -&gt; production [`#441`](https://github.com/rudderlabs/rudder-sdk-js/pull/441)
- Fixed cname file mapping [`#440`](https://github.com/rudderlabs/rudder-sdk-js/pull/440)
- GTM: Fixed the different cnames to GTM (similar with control-plane name) [`#438`](https://github.com/rudderlabs/rudder-sdk-js/pull/438)

### Commits

- Bumped version [`e1120e8`](https://github.com/rudderlabs/rudder-sdk-js/commit/e1120e8499e94ab291a09fa4d84b5b5e2fb8430b)

## [v1.3.2](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.3.1...v1.3.2) - 2022-01-21

### Merged

- Added support for PostHog loaded config [`#436`](https://github.com/rudderlabs/rudder-sdk-js/pull/436)
- Feature: Support Event Filtering for Device Mode Destinations [`#358`](https://github.com/rudderlabs/rudder-sdk-js/pull/358)
- Added support for PostHog loaded config [`#436`](https://github.com/rudderlabs/rudder-sdk-js/pull/436)

### Commits

- Bumped version [`7a93f75`](https://github.com/rudderlabs/rudder-sdk-js/commit/7a93f7564256064889e1ed7d63d7e386356f99b0)
- Bumped version [`52d6741`](https://github.com/rudderlabs/rudder-sdk-js/commit/52d674152a33bb2cee0fdd1f296038d1fe85e6c0)

## [v1.3.1](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.2.20...v1.3.1) - 2022-01-18

### Merged

- Added server side support to GTM [`#434`](https://github.com/rudderlabs/rudder-sdk-js/pull/434)
- Bug Fix: Pinterest Tag - Removed "Checkout Step Completed" event mapping. [`#431`](https://github.com/rudderlabs/rudder-sdk-js/pull/431)

## [v1.2.20](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.2.19...v1.2.20) - 2022-01-14

### Merged

- Scriptloader Bugfix: Google optimize [`#427`](https://github.com/rudderlabs/rudder-sdk-js/pull/427)
- Fullstory cross domain user tracking support. [`#426`](https://github.com/rudderlabs/rudder-sdk-js/pull/426)
- Google Opitmize bugFix:  Adding script inside head if head is available [`#425`](https://github.com/rudderlabs/rudder-sdk-js/pull/425)

### Commits

- Bumped version [`7b13954`](https://github.com/rudderlabs/rudder-sdk-js/commit/7b13954240424fb8665c4f835e33979cb79d39bd)

## [v1.2.19](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.2.16...v1.2.19) - 2022-01-13

### Merged

- LaunchDarkly new integration [`#410`](https://github.com/rudderlabs/rudder-sdk-js/pull/410)
- Hotjar - Ability to send events in track [`#421`](https://github.com/rudderlabs/rudder-sdk-js/pull/421)
- Updated ts declaration for beacon and consent manager feature [`#417`](https://github.com/rudderlabs/rudder-sdk-js/pull/417)

### Commits

- Bumped version [`20dd1c5`](https://github.com/rudderlabs/rudder-sdk-js/commit/20dd1c576b3e3f23ac9f615b5ba1c1998df7e0fa)
- Bumped version [`a04e123`](https://github.com/rudderlabs/rudder-sdk-js/commit/a04e123d3754ecdf99bc178a34f03e76ca640bbd)
- Fixed a bug that prevented filtering unsupported integrations when cookie consent is disabled [`8b15b6f`](https://github.com/rudderlabs/rudder-sdk-js/commit/8b15b6fb65198cdd4b4a2b30f31b0809898b9f74)
- Bumped version [`3e83cda`](https://github.com/rudderlabs/rudder-sdk-js/commit/3e83cdad193b5b82000e5baaf0f9e60e7e866023)
- Fixed formatting issues [`c645346`](https://github.com/rudderlabs/rudder-sdk-js/commit/c6453467b9edb8d52e8e0bbbea801d78a6743dae)

## [v1.2.16](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.2.15...v1.2.16) - 2022-01-06

### Merged

- production-staging -&gt; production [`#416`](https://github.com/rudderlabs/rudder-sdk-js/pull/416)
- Bugfix Posthog : added 'persistence' field in options set in init() [`#413`](https://github.com/rudderlabs/rudder-sdk-js/pull/413)
- OneTrust_CookieConesnt_Changes-error_handling: addressed review comments [`#414`](https://github.com/rudderlabs/rudder-sdk-js/pull/414)

### Commits

- Bumped version [`5238043`](https://github.com/rudderlabs/rudder-sdk-js/commit/5238043ab823cf38ab3298ea39c4787abdca5001)
- production-staging: fixed bug re cookieconsent adding brackets to set of conditional operations [`7f9c8a3`](https://github.com/rudderlabs/rudder-sdk-js/commit/7f9c8a36d9a1f54d3e187399259512232edbcace)
- production-staging: fixed bug re cookieconsent [`ef434de`](https://github.com/rudderlabs/rudder-sdk-js/commit/ef434dee0572dea6cd3dfb88fc87a7f311758330)

## [v1.2.15](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.2.14...v1.2.15) - 2022-01-04

### Merged

- production-staging -&gt; production [`#408`](https://github.com/rudderlabs/rudder-sdk-js/pull/408)
- logic modified for checking cookieConsentOptions is present or not [`#409`](https://github.com/rudderlabs/rudder-sdk-js/pull/409)
- Error handling when both of the storage is unavailable  [`#407`](https://github.com/rudderlabs/rudder-sdk-js/pull/407)
- Modified cookieConsent class variable to local variable [`#406`](https://github.com/rudderlabs/rudder-sdk-js/pull/406)
- Added Cookie Consent Manager Support (OneTrust) [`#395`](https://github.com/rudderlabs/rudder-sdk-js/pull/395)
- Added beacon support [`#400`](https://github.com/rudderlabs/rudder-sdk-js/pull/400)

### Commits

- Bumped version [`9035c1b`](https://github.com/rudderlabs/rudder-sdk-js/commit/9035c1b2f479b049fe0e5108e0678a9e6a802052)
- storage unavailable err handling [`fa742f0`](https://github.com/rudderlabs/rudder-sdk-js/commit/fa742f0c0e95d1e0ecfbc4c5dc26b9d7c64f0a44)
- code refactoring [`3233e8b`](https://github.com/rudderlabs/rudder-sdk-js/commit/3233e8bf7d8ada0ba07f4f89aeeceeeef4f3968b)
- code cleaning [`2098d44`](https://github.com/rudderlabs/rudder-sdk-js/commit/2098d445ee033113a215359182b2d7e88235a1bd)
- code cleaning [`f5debe5`](https://github.com/rudderlabs/rudder-sdk-js/commit/f5debe56d2cb4806814101847e740e22d101feff)
- code cleanup [`6ab37e7`](https://github.com/rudderlabs/rudder-sdk-js/commit/6ab37e7b4d4cba71128f08ab240ef2132ca6800d)
- removed redundant code [`c08f520`](https://github.com/rudderlabs/rudder-sdk-js/commit/c08f520cddd0a703dedd62528c5af3b508daf871)
- reverted version upgrades [`b3c165e`](https://github.com/rudderlabs/rudder-sdk-js/commit/b3c165e6e6c612fc1b12d1af97f55d95d9c25c5a)
- logic modified re. cookieConsent Options [`e48ae1e`](https://github.com/rudderlabs/rudder-sdk-js/commit/e48ae1e8a54401c72e0323945dd77d24e70d1ac8)
- OneTrust_CookieConesnt_Changes: bug fix [`4395dd2`](https://github.com/rudderlabs/rudder-sdk-js/commit/4395dd2b3066e1bde91213f933bd1633a61c48d8)
- OneTrust_CookieConesnt_Changes: bug fix [`4637b66`](https://github.com/rudderlabs/rudder-sdk-js/commit/4637b66446ccec97e2f2b79c938a379e24edb75f)
- code refactoring [`e68d485`](https://github.com/rudderlabs/rudder-sdk-js/commit/e68d48541e0609f2b55812130b0262763b9c1378)
- OneTrust_CookieConesnt_Changes: refactored [`2f54252`](https://github.com/rudderlabs/rudder-sdk-js/commit/2f542527295e846797b6a34c44842930a541af64)
- code refactoring [`53b2aca`](https://github.com/rudderlabs/rudder-sdk-js/commit/53b2aca02ecf947b4271a625cdc2ea44794ded7a)

## [v1.2.14](https://github.com/rudderlabs/rudder-sdk-js/compare/v1.0.15...v1.2.14) - 2021-12-24

### Merged

- Removed the usage of loadash module to reduce the SDK size [`#403`](https://github.com/rudderlabs/rudder-sdk-js/pull/403)
- production-staging -&gt; production [`#399`](https://github.com/rudderlabs/rudder-sdk-js/pull/399)
- Added load option for secure cookie flag [`#398`](https://github.com/rudderlabs/rudder-sdk-js/pull/398)
- Set-value package dependency upgrade [`#397`](https://github.com/rudderlabs/rudder-sdk-js/pull/397)
- Enhancement Klaviyo : Introducing Ecom Events for Track calls [`#388`](https://github.com/rudderlabs/rudder-sdk-js/pull/388)
- add eventId in page call [`#396`](https://github.com/rudderlabs/rudder-sdk-js/pull/396)
- Autotrack depreciation note modified [`#393`](https://github.com/rudderlabs/rudder-sdk-js/pull/393)
- Google Ads - feat: add dynamic remarketing [`#394`](https://github.com/rudderlabs/rudder-sdk-js/pull/394)
- production-staging -&gt; production [`#391`](https://github.com/rudderlabs/rudder-sdk-js/pull/391)
- added functionality that will remove any property key that has an object or array [`#389`](https://github.com/rudderlabs/rudder-sdk-js/pull/389)
- TVSquared - fix: add check for deleteCustomVariable (#380) [`#387`](https://github.com/rudderlabs/rudder-sdk-js/pull/387)
- TVSquared - fix: add check for deleteCustomVariable [`#380`](https://github.com/rudderlabs/rudder-sdk-js/pull/380)
- production-staging -&gt; production (Google Optimize) [`#386`](https://github.com/rudderlabs/rudder-sdk-js/pull/386)
- bugfix : sriptloader async logic update [`#385`](https://github.com/rudderlabs/rudder-sdk-js/pull/385)
- Feat : Destination Google optimize [`#379`](https://github.com/rudderlabs/rudder-sdk-js/pull/379)
- Bumped version [`#382`](https://github.com/rudderlabs/rudder-sdk-js/pull/382)
- production-staging -&gt; production (Post Affiliate Pro) [`#381`](https://github.com/rudderlabs/rudder-sdk-js/pull/381)
- PostAffiliatePro Integration [`#378`](https://github.com/rudderlabs/rudder-sdk-js/pull/378)
- Version bump [`#376`](https://github.com/rudderlabs/rudder-sdk-js/pull/376)
- Bug: Incomplete data type definitions [`#373`](https://github.com/rudderlabs/rudder-sdk-js/pull/373)
- Feat: Moved useNewPageEventNameFormat inside integrations.AM [`#375`](https://github.com/rudderlabs/rudder-sdk-js/pull/375)
- Feat: Option to alter page event name in Amplitude [`#369`](https://github.com/rudderlabs/rudder-sdk-js/pull/369)
- Bug: Support for advanced combinations of parameters in objects missing in TS declaration file [`#372`](https://github.com/rudderlabs/rudder-sdk-js/pull/372)
- Added CONTRIBUTING.MD [`#370`](https://github.com/rudderlabs/rudder-sdk-js/pull/370)
- Bumped version [`#368`](https://github.com/rudderlabs/rudder-sdk-js/pull/368)
- Bug : removing the trailing slashes in instance url for Posthog [`#363`](https://github.com/rudderlabs/rudder-sdk-js/pull/363)
- Production staging -&gt; Production [`#367`](https://github.com/rudderlabs/rudder-sdk-js/pull/367)
- Bug: Correct package version updated [`#365`](https://github.com/rudderlabs/rudder-sdk-js/pull/365)
- Ts declaration fix [`#364`](https://github.com/rudderlabs/rudder-sdk-js/pull/364)
- Bug Fix: Prevent rudder element mutation by deep copying [`#362`](https://github.com/rudderlabs/rudder-sdk-js/pull/362)
- Enhancement: Production &lt;- Production Staging [`#361`](https://github.com/rudderlabs/rudder-sdk-js/pull/361)
- Bumped version 1.2.1 after previous revert [`#356`](https://github.com/rudderlabs/rudder-sdk-js/pull/356)
- Reverted out changes from PR #336 [`#355`](https://github.com/rudderlabs/rudder-sdk-js/pull/355)
- Production build issues resolved and version bumps [`#354`](https://github.com/rudderlabs/rudder-sdk-js/pull/354)
- production &lt;- production-staging [`#353`](https://github.com/rudderlabs/rudder-sdk-js/pull/353)
- Feature: Configure storage type from options [`#336`](https://github.com/rudderlabs/rudder-sdk-js/pull/336)
- Enhancement: Added browser compatibility info to babel [`#123`](https://github.com/rudderlabs/rudder-sdk-js/pull/123)
- Updated structure and revamped content [`#350`](https://github.com/rudderlabs/rudder-sdk-js/pull/350)
- Feature: Added Group call support for GA4 [`#192`](https://github.com/rudderlabs/rudder-sdk-js/pull/192)
- Feature: Allow Pinterest top-level property mapping i.e. revenue -&gt; value [`#322`](https://github.com/rudderlabs/rudder-sdk-js/pull/322)
- Enhancement: Add config requested by the lytics team [`#309`](https://github.com/rudderlabs/rudder-sdk-js/pull/309)
- Fix: Facebook content type [`#283`](https://github.com/rudderlabs/rudder-sdk-js/pull/283)
- Enhancement: Replaces console.logs to logger.debug in FacebookPixel [`#324`](https://github.com/rudderlabs/rudder-sdk-js/pull/324)
- NPM package v1.0.20 published [`#351`](https://github.com/rudderlabs/rudder-sdk-js/pull/351)
- Enhancement: Added API overloads for NPM package that SDK supports [`#348`](https://github.com/rudderlabs/rudder-sdk-js/pull/348)
- Quantum metric int [`#346`](https://github.com/rudderlabs/rudder-sdk-js/pull/346)
- Enhancement: Git Ignore NPM Package [`#347`](https://github.com/rudderlabs/rudder-sdk-js/pull/347)
- Enhancement: NPM Package Updates [`#344`](https://github.com/rudderlabs/rudder-sdk-js/pull/344)
- fixed the type but shouldn't affect any previous or future additions ADOBE_ANALYTICS [`#345`](https://github.com/rudderlabs/rudder-sdk-js/pull/345)
- edit in rewriteFrames for ForEach [`#343`](https://github.com/rudderlabs/rudder-sdk-js/pull/343)
- fix bug on sentry rewriteFrames [`#342`](https://github.com/rudderlabs/rudder-sdk-js/pull/342)
- Sentry production [`#341`](https://github.com/rudderlabs/rudder-sdk-js/pull/341)
- update scriptloader id [`#339`](https://github.com/rudderlabs/rudder-sdk-js/pull/339)
- update identify [`#338`](https://github.com/rudderlabs/rudder-sdk-js/pull/338)
- Sentry Integrations [`#337`](https://github.com/rudderlabs/rudder-sdk-js/pull/337)
- Sentry integration [`#335`](https://github.com/rudderlabs/rudder-sdk-js/pull/335)
- ProfitWell Integration [`#333`](https://github.com/rudderlabs/rudder-sdk-js/pull/333)
- change log level to debug [`#332`](https://github.com/rudderlabs/rudder-sdk-js/pull/332)
- Profitwell update: add cond. check [`#331`](https://github.com/rudderlabs/rudder-sdk-js/pull/331)
- move marketing tracking to identify [`#330`](https://github.com/rudderlabs/rudder-sdk-js/pull/330)
- update profitwell identify [`#329`](https://github.com/rudderlabs/rudder-sdk-js/pull/329)
- Profitwell device-mode - Issue [`#327`](https://github.com/rudderlabs/rudder-sdk-js/pull/327)
- Profitwell device-mode update [`#326`](https://github.com/rudderlabs/rudder-sdk-js/pull/326)
- Profitwell Integration [`#323`](https://github.com/rudderlabs/rudder-sdk-js/pull/323)
- removed checkout_id support and replaced it with order_id to align be… [`#320`](https://github.com/rudderlabs/rudder-sdk-js/pull/320)
- Fix for when Google Ads track is calling RudderElement.properties ins… [`#316`](https://github.com/rudderlabs/rudder-sdk-js/pull/316)
- Snap Pixel Integration [`#318`](https://github.com/rudderlabs/rudder-sdk-js/pull/318)
- refactor event names in object [`#317`](https://github.com/rudderlabs/rudder-sdk-js/pull/317)
- Snap pixel update [`#313`](https://github.com/rudderlabs/rudder-sdk-js/pull/313)
- Snap Pixel Integration [`#310`](https://github.com/rudderlabs/rudder-sdk-js/pull/310)
- update sha256 value for fb_pixel [`#312`](https://github.com/rudderlabs/rudder-sdk-js/pull/312)
- add sha256 missed import [`#311`](https://github.com/rudderlabs/rudder-sdk-js/pull/311)
- Fix/brave browser [`#307`](https://github.com/rudderlabs/rudder-sdk-js/pull/307)
- added allowUserSuppliedJavascript [`#306`](https://github.com/rudderlabs/rudder-sdk-js/pull/306)
- added enableHtmlInAppMessageserror for braze [`#305`](https://github.com/rudderlabs/rudder-sdk-js/pull/305)
- Drip [`#303`](https://github.com/rudderlabs/rudder-sdk-js/pull/303)
- Drip - Identify call update [`#301`](https://github.com/rudderlabs/rudder-sdk-js/pull/301)
- Qualtrics integrations js sdk [`#300`](https://github.com/rudderlabs/rudder-sdk-js/pull/300)
- Drip - update [`#299`](https://github.com/rudderlabs/rudder-sdk-js/pull/299)
- Qualtrics: Ternary condition Edit [`#297`](https://github.com/rudderlabs/rudder-sdk-js/pull/297)
- Drip Integration - updates [`#296`](https://github.com/rudderlabs/rudder-sdk-js/pull/296)
- Drip Integration [`#295`](https://github.com/rudderlabs/rudder-sdk-js/pull/295)
- Qualtrics Integration [`#294`](https://github.com/rudderlabs/rudder-sdk-js/pull/294)
- Lytics typo [`#284`](https://github.com/rudderlabs/rudder-sdk-js/pull/284)
- Added traits support to GTM [`#292`](https://github.com/rudderlabs/rudder-sdk-js/pull/292)
- Criteo device mode to production [`#293`](https://github.com/rudderlabs/rudder-sdk-js/pull/293)
- Criteo : refactored code [`#291`](https://github.com/rudderlabs/rudder-sdk-js/pull/291)
- Mixpanel fix for persistance name none [`#290`](https://github.com/rudderlabs/rudder-sdk-js/pull/290)
- Mixpanel fix for persistance name [`#289`](https://github.com/rudderlabs/rudder-sdk-js/pull/289)
- Criteo integrations [`#279`](https://github.com/rudderlabs/rudder-sdk-js/pull/279)
- added default value for additional settings gads [`#288`](https://github.com/rudderlabs/rudder-sdk-js/pull/288)
- Mixpanel added support for cookie configs device mode [`#285`](https://github.com/rudderlabs/rudder-sdk-js/pull/285)
- added three additional settings gads [`#286`](https://github.com/rudderlabs/rudder-sdk-js/pull/286)
- Production Mixpanel [`#281`](https://github.com/rudderlabs/rudder-sdk-js/pull/281)
- Mixpanel [`#278`](https://github.com/rudderlabs/rudder-sdk-js/pull/278)
- Production staging [`#280`](https://github.com/rudderlabs/rudder-sdk-js/pull/280)
- Reddit Pixel integration [`#272`](https://github.com/rudderlabs/rudder-sdk-js/pull/272)
- added support for name lytics [`#269`](https://github.com/rudderlabs/rudder-sdk-js/pull/269)
- Production staging [`#267`](https://github.com/rudderlabs/rudder-sdk-js/pull/267)
- Heap device mode [`#268`](https://github.com/rudderlabs/rudder-sdk-js/pull/268)
- Linkedin pixel integration [`#266`](https://github.com/rudderlabs/rudder-sdk-js/pull/266)
- Production staging [`#261`](https://github.com/rudderlabs/rudder-sdk-js/pull/261)
- removed adding of created_at if not present in traits customer io [`#260`](https://github.com/rudderlabs/rudder-sdk-js/pull/260)
- added proxy url for loading aa sdks [`#258`](https://github.com/rudderlabs/rudder-sdk-js/pull/258)
- refactor +bug fix fb pixel [`#256`](https://github.com/rudderlabs/rudder-sdk-js/pull/256)
- Production staging [`#254`](https://github.com/rudderlabs/rudder-sdk-js/pull/254)
- Adobe Analytics [`#250`](https://github.com/rudderlabs/rudder-sdk-js/pull/250)
- changed logic for payload for custom events fb pixel [`#252`](https://github.com/rudderlabs/rudder-sdk-js/pull/252)
- fb pixel custom event fix [`#251`](https://github.com/rudderlabs/rudder-sdk-js/pull/251)
- Update integration_cname.js [`#248`](https://github.com/rudderlabs/rudder-sdk-js/pull/248)
- added check for product array in fb pixel [`#247`](https://github.com/rudderlabs/rudder-sdk-js/pull/247)
- Pinterest Sdk Integrations [`#245`](https://github.com/rudderlabs/rudder-sdk-js/pull/245)
- Event ordering issues fixed [`#244`](https://github.com/rudderlabs/rudder-sdk-js/pull/244)
- Fixed property mapping issues and incorporated changes acc to webapp. [`#243`](https://github.com/rudderlabs/rudder-sdk-js/pull/243)
- Pinterest Tag SDK commit [`#242`](https://github.com/rudderlabs/rudder-sdk-js/pull/242)
- Production &lt;--- staging [`#240`](https://github.com/rudderlabs/rudder-sdk-js/pull/240)
- add location.href as page defaults [`#239`](https://github.com/rudderlabs/rudder-sdk-js/pull/239)
- change page defaults [`#238`](https://github.com/rudderlabs/rudder-sdk-js/pull/238)
- Reset anonId based on flag [`#237`](https://github.com/rudderlabs/rudder-sdk-js/pull/237)
- Production &lt;--- staging [`#235`](https://github.com/rudderlabs/rudder-sdk-js/pull/235)
- Update browser.js [`#236`](https://github.com/rudderlabs/rudder-sdk-js/pull/236)
- Made changes for Event Label(or el) field. [`#234`](https://github.com/rudderlabs/rudder-sdk-js/pull/234)
- getUserTraits [`#229`](https://github.com/rudderlabs/rudder-sdk-js/pull/229)
- getUserTraits [`#228`](https://github.com/rudderlabs/rudder-sdk-js/pull/228)
- Bingads [`#226`](https://github.com/rudderlabs/rudder-sdk-js/pull/226)
- Production &lt;--  staging [`#222`](https://github.com/rudderlabs/rudder-sdk-js/pull/222)
- Legacy support fixes Clevertap [`#227`](https://github.com/rudderlabs/rudder-sdk-js/pull/227)
- Clevertap Post test fixes [`#225`](https://github.com/rudderlabs/rudder-sdk-js/pull/225)
- Custom domain [`#223`](https://github.com/rudderlabs/rudder-sdk-js/pull/223)
- pull changes from other PR and changes to storage for cookie domain [`#221`](https://github.com/rudderlabs/rudder-sdk-js/pull/221)
- onboarding clevertap [`#219`](https://github.com/rudderlabs/rudder-sdk-js/pull/219)
- Production &lt;-- staging [`#216`](https://github.com/rudderlabs/rudder-sdk-js/pull/216)
- klaviyo support of email as primary [`#218`](https://github.com/rudderlabs/rudder-sdk-js/pull/218)
- bug [`#217`](https://github.com/rudderlabs/rudder-sdk-js/pull/217)
- klaviyo - minor fixes [`#215`](https://github.com/rudderlabs/rudder-sdk-js/pull/215)
- Babel transform plugin for object assign [`#214`](https://github.com/rudderlabs/rudder-sdk-js/pull/214)
- Klaviyo integration [`#212`](https://github.com/rudderlabs/rudder-sdk-js/pull/212)
- Persistence of initial page properties [`#213`](https://github.com/rudderlabs/rudder-sdk-js/pull/213)
- Production staging update [`#211`](https://github.com/rudderlabs/rudder-sdk-js/pull/211)
- Add fn to fetch source config [`#210`](https://github.com/rudderlabs/rudder-sdk-js/pull/210)

### Commits

- OneTrust_CookieConesnt_Changes: reverted to trim() for category matching [`e9eaec3`](https://github.com/rudderlabs/rudder-sdk-js/commit/e9eaec35a061978ad5692ebc3ed932614a3ad549)
- code cleaning [`948c569`](https://github.com/rudderlabs/rudder-sdk-js/commit/948c5692d17fb99fb8f34610935db71f61d9794d)
- code refactoring [`feab8f5`](https://github.com/rudderlabs/rudder-sdk-js/commit/feab8f522f6a7be0fde227858583b93515b47301)
- code refactoring [`7ac1bac`](https://github.com/rudderlabs/rudder-sdk-js/commit/7ac1bac03c582cf01a1174d74ef6e0e1a9b7e0d5)
- OneTrust_CookieConesnt_Changes: minor big fix [`171fc79`](https://github.com/rudderlabs/rudder-sdk-js/commit/171fc7930f0f0b65a26071b43ca298675a2ac04d)
- OneTrust_CookieConesnt_Changes: Addressed review comments [`968e642`](https://github.com/rudderlabs/rudder-sdk-js/commit/968e642bdcadb81d5f2143654370328b71dad7e3)
- code refactoring [`c457dab`](https://github.com/rudderlabs/rudder-sdk-js/commit/c457dabfc79d06f74b95a0d9ef378c3eb4003953)
- code refactoring [`d6c537a`](https://github.com/rudderlabs/rudder-sdk-js/commit/d6c537ae121db47083aa0517336cc7cbdd824bc2)
- OneTrust_CookieConesnt_Changes: added logger debugs [`ddb4daf`](https://github.com/rudderlabs/rudder-sdk-js/commit/ddb4daf7a8a1f522fab10907b5dd20e89b1ffce3)
- OneTrust_CookieConesnt_Changes: minor bug fix [`528b0c9`](https://github.com/rudderlabs/rudder-sdk-js/commit/528b0c997ffcdf3f882a8cce6434f57a07c0fdbe)
- OneTrust_CookieConesnt_Changes: changed key oneTrustCookieCategories [`a61623d`](https://github.com/rudderlabs/rudder-sdk-js/commit/a61623d258f63205295ee6b9e1c2f802e654edbd)
- modified beacon logic [`0651b47`](https://github.com/rudderlabs/rudder-sdk-js/commit/0651b47169c302979ac4ebbd968105a2c34016be)
- OneTrust_CookieConesnt_Changes: added try/catch and minor refactoring [`a4847d7`](https://github.com/rudderlabs/rudder-sdk-js/commit/a4847d78da257055e1150f0bfb06960303c9ba97)
- OneTrust_CookieConesnt_Changes: Addressed review comments [`02cf227`](https://github.com/rudderlabs/rudder-sdk-js/commit/02cf227a6874d6f53f3caffda16599c790650f1a)
- version bumped [`69140d2`](https://github.com/rudderlabs/rudder-sdk-js/commit/69140d21f97afb5b344334996524f583e4057177)
- feature beacon [`f1b6c08`](https://github.com/rudderlabs/rudder-sdk-js/commit/f1b6c0836e20cd0f757d4d08baa27c61c3b3f466)
- OneTrust_CookieConesnt_Changes: changed CookieConsentFactory to a static class [`187b976`](https://github.com/rudderlabs/rudder-sdk-js/commit/187b9769c994cdd9865247ae9177fb2592d8018e)
- OneTrust_CookieConesnt_Changes: added comments [`7475f9e`](https://github.com/rudderlabs/rudder-sdk-js/commit/7475f9e67dda38b2bc1d76849122ffaaf2c41959)
- OneTrust_CookieConesnt_Changes: added logic to take options for cookie consent from rudder analytics load options [`a270541`](https://github.com/rudderlabs/rudder-sdk-js/commit/a270541ba8b7375e8d7349a6d752ed2734386791)
- OneTrust_CookieConesnt_Changes: changed logic for accepting cookies refactored [`efeb0c2`](https://github.com/rudderlabs/rudder-sdk-js/commit/efeb0c20a45a279fb66739f69f5a21227fcf27ba)
- OneTrust_CookieConesnt_Changes: changed logic for accepting cookies [`383d6c8`](https://github.com/rudderlabs/rudder-sdk-js/commit/383d6c8d1a790664c126d15d11ed25650348718f)
- OneTrust_CookieConesnt_Changes: added CookieConsentFactory file [`c965384`](https://github.com/rudderlabs/rudder-sdk-js/commit/c96538498760c0cd584ed0b42b1f29d7e7baf8bd)
- Updated declaration file to include 'secureCookie' load API option [`d1545ea`](https://github.com/rudderlabs/rudder-sdk-js/commit/d1545ea5ffe3c5cec9de1a3d652214592635c50e)
- OneTrust_CookieConesnt_Changes: Addressed review comments [`fb18d9f`](https://github.com/rudderlabs/rudder-sdk-js/commit/fb18d9f73d7ac4cd996a3d1a9a7de65e5beb246f)
- working on beacon plugin [`e78172e`](https://github.com/rudderlabs/rudder-sdk-js/commit/e78172eff097958fd843859971c260268d583b8a)
- OneTrust_CookieConesnt_Changes: Changed the structure [`bf959a1`](https://github.com/rudderlabs/rudder-sdk-js/commit/bf959a109c56467bd2c7078634f3038b8bab6f08)
- OneTrust_CookieConesnt_Changes: Logic added. All dev tests not done. basic tests done. [`204c944`](https://github.com/rudderlabs/rudder-sdk-js/commit/204c944eb4be658da62a60ed096a00cf944f1d2f)
- OneTrust_CookieConesnt_Changes: Initial Structure [`a79a2b4`](https://github.com/rudderlabs/rudder-sdk-js/commit/a79a2b452d2cd8ca7890b74ec1ed6a9aac9ca7ab)
- Feedback incorporated. [`4ce4fed`](https://github.com/rudderlabs/rudder-sdk-js/commit/4ce4fedee384d0822c9dcd57adb70e9252d0160f)
- Updated URL [`20cd225`](https://github.com/rudderlabs/rudder-sdk-js/commit/20cd225509c6cc2d5550c0300ac374f7be2b7bfd)
- Update README.md [`75805df`](https://github.com/rudderlabs/rudder-sdk-js/commit/75805df30d45e023922350bb07707fde33cfeaac)
- modified note re autotrack [`2c67931`](https://github.com/rudderlabs/rudder-sdk-js/commit/2c67931654c202e075e5172969fc89562354e68f)
- Testing code pipeline [`904341b`](https://github.com/rudderlabs/rudder-sdk-js/commit/904341b663444be5e050d1699f4b8aacb7f4664d)
- Update README.md [`c2421a8`](https://github.com/rudderlabs/rudder-sdk-js/commit/c2421a8ab42b09689b6bb01ab4a47cda52be4f98)
- Update CONTRIBUTING.md [`da75616`](https://github.com/rudderlabs/rudder-sdk-js/commit/da756163d76f4155f281806e6866972875e2b50d)
- Update CONTRIBUTING.md [`ae29f6f`](https://github.com/rudderlabs/rudder-sdk-js/commit/ae29f6fd0ec86166f07fc2f1eaf490618dc45d6b)
- Update README.md [`5f1fa63`](https://github.com/rudderlabs/rudder-sdk-js/commit/5f1fa63354a60361cbd0190ce167492a8dda706c)
- Create CONTRIBUTING.md [`f6ea9a4`](https://github.com/rudderlabs/rudder-sdk-js/commit/f6ea9a46eed10ff2e2fe6ce5e73799ce069bb1e0)
- bump the version from 1.2.1 to 1.2.2 [`6eb9f4c`](https://github.com/rudderlabs/rudder-sdk-js/commit/6eb9f4c110b2e44151c6450ba1eeb7ffbc3b2ee8)
- ts declaration fixed [`bf13f04`](https://github.com/rudderlabs/rudder-sdk-js/commit/bf13f048903bb5142358fc5836cc2b57a60d8c60)
- Deleted index.js (npm package) file [`6758f25`](https://github.com/rudderlabs/rudder-sdk-js/commit/6758f25e523379451047c85e4f4db9e30bf84add)
- Updated npm package version to match the SDK [`224acf0`](https://github.com/rudderlabs/rudder-sdk-js/commit/224acf06c6e0c3bb21084fb2785b101b5844ea24)
- Deleted index.js (npm package) file [`aed3996`](https://github.com/rudderlabs/rudder-sdk-js/commit/aed3996a2d02e644abc9ab67b39c4c163eafbb1f)
- Update .gitignore to exlude index.js (npm package) [`7c2cc0e`](https://github.com/rudderlabs/rudder-sdk-js/commit/7c2cc0e70674ac4b27845900d9c958a2d062ac79)
- Merge pull request #352 from rudderlabs/GA4-stripping [`e9000d8`](https://github.com/rudderlabs/rudder-sdk-js/commit/e9000d84010a0ca0af3e1481f22dd8b6271ce31d)
- removed bug that strips property key value pairs [`230fe61`](https://github.com/rudderlabs/rudder-sdk-js/commit/230fe61f5ccc18f579f62cb6df87bfc11ce223d5)
- removed bug that strips property key value pairs [`f625307`](https://github.com/rudderlabs/rudder-sdk-js/commit/f6253073ccc14b77b247eafc8d402c2aa03143f8)
- Update README.md [`716e35a`](https://github.com/rudderlabs/rudder-sdk-js/commit/716e35ac025387dcc1de2d94649cc7066a5940a9)
- Merge pull request #274 from alan-cooney/production [`b3413b8`](https://github.com/rudderlabs/rudder-sdk-js/commit/b3413b8f7cc866e7e955a8a0c412537b482990cb)
- Added info on loading 3rd party scripts using load [`40c0d8d`](https://github.com/rudderlabs/rudder-sdk-js/commit/40c0d8d51b44b561af55a89489a6eb07d3ec53ae)
- Update README.md [`f96f173`](https://github.com/rudderlabs/rudder-sdk-js/commit/f96f173e6a4f5a48adebace123d990d1bf97b62c)
- Merge pull request #349 from rudderlabs/qm-prod [`21b8933`](https://github.com/rudderlabs/rudder-sdk-js/commit/21b89335db97bc2760a857c9bb4774e1b9885563)
- qm-prod: Addressed review comments [`5c20276`](https://github.com/rudderlabs/rudder-sdk-js/commit/5c20276e8814448a7efc7b4b815e3f80dd7e5e28)
- QuatumMetric-int:Removed siteID [`5c07002`](https://github.com/rudderlabs/rudder-sdk-js/commit/5c0700291c063754513002515128d8f7570e9eaa)
- QuatumMetric-int:Removed siteID [`0a47eb5`](https://github.com/rudderlabs/rudder-sdk-js/commit/0a47eb54bab32bf51d7e79dc46fb4f57bf2b02a6)
- Reverted package.json changes [`4f6a8c1`](https://github.com/rudderlabs/rudder-sdk-js/commit/4f6a8c10261fbc7faf3da2f9b9da90d1d7bf50d4)
- QuatumMetric-int:Addressed Review comments [`f5ace51`](https://github.com/rudderlabs/rudder-sdk-js/commit/f5ace5128a85a7f40cc8aa6b06e5404c5771806d)
- QuatumMetric-int:Addressed Review comments [`c11a185`](https://github.com/rudderlabs/rudder-sdk-js/commit/c11a185f1ec7a5b774dfbe660370465d5a431b61)
- changed config setting to siteID [`2770b67`](https://github.com/rudderlabs/rudder-sdk-js/commit/2770b67215261a8e5c185b34084157963ba0c57a)
- changed config setting to siteID [`644cf3e`](https://github.com/rudderlabs/rudder-sdk-js/commit/644cf3e7fd25c094b8781aca678fab2188217239)
- resolved conflicts, added Quatum metric integration [`ab88c9d`](https://github.com/rudderlabs/rudder-sdk-js/commit/ab88c9d3d092f0d97eae364cd92aae0f54f50922)
- resolved conflicts, added Quatum metric integration [`dde8141`](https://github.com/rudderlabs/rudder-sdk-js/commit/dde81412681720ab7503b81e1b4c2cb6bb5327bf)
- Update README.md [`b093be3`](https://github.com/rudderlabs/rudder-sdk-js/commit/b093be3f18b94cf82b96573f904a59ffee628209)
- Update README.md [`0764545`](https://github.com/rudderlabs/rudder-sdk-js/commit/076454565e78d9c0bdf58857383fc4bd5c13d408)
- fixed the type but shouldn't affect any previous or future additions [`987eb6b`](https://github.com/rudderlabs/rudder-sdk-js/commit/987eb6b2a2dca41a9d7afbb0cfb52b6618c22ce7)
- Enhancement: Updated dist for npm [`7ae1fd3`](https://github.com/rudderlabs/rudder-sdk-js/commit/7ae1fd34ad558a68e21b0d7a560ee497afb2c4f7)
- minor update [`2e303b7`](https://github.com/rudderlabs/rudder-sdk-js/commit/2e303b7254c1531d299d5a029124498f9c69dbfd)
- minor update [`7b091ab`](https://github.com/rudderlabs/rudder-sdk-js/commit/7b091aba26a263788797cc593c18a758ca630353)
- minor update [`bb3d3ef`](https://github.com/rudderlabs/rudder-sdk-js/commit/bb3d3ef8b3d6acdf53207a605e21134c468f0d94)
- code refactored and ready is modified [`803f0db`](https://github.com/rudderlabs/rudder-sdk-js/commit/803f0db5e0848c887a7a93c78b4d76b33dc1f079)
- code refactored and ready is modified [`be67b8a`](https://github.com/rudderlabs/rudder-sdk-js/commit/be67b8abfbaeb6963bd8ca74360d0da85d079563)
- init code transferred to isReady for loading issue [`eaae184`](https://github.com/rudderlabs/rudder-sdk-js/commit/eaae1849b5ce4851fdba268c06338d77ff19a468)
- init code transferred to isReady for loading issue [`3881888`](https://github.com/rudderlabs/rudder-sdk-js/commit/3881888314c4cdfae3f272f70e77d856ed34a123)
- edit in config [`5dcbc5e`](https://github.com/rudderlabs/rudder-sdk-js/commit/5dcbc5e9177951e7c60188ae7034a9d250d0def1)
- edit in config [`6fbc04a`](https://github.com/rudderlabs/rudder-sdk-js/commit/6fbc04ab9273476ccf7d4563156b30b15db53862)
- minor update [`da92a11`](https://github.com/rudderlabs/rudder-sdk-js/commit/da92a111f94e7ea322074b6a2bc6096e47aa64f7)
- minor update [`91e5d72`](https://github.com/rudderlabs/rudder-sdk-js/commit/91e5d72fadc43f00d2532c2dacacae012ae574fb)
- edit in traits and object to array function [`6d91f3f`](https://github.com/rudderlabs/rudder-sdk-js/commit/6d91f3f34404d55ceb4566689128bcde8221039a)
- edit in traits and object to array function [`8decc8a`](https://github.com/rudderlabs/rudder-sdk-js/commit/8decc8a88787ff74b2e3ad28e585c80ce518b74c)
- edits after end to end test [`1e24e15`](https://github.com/rudderlabs/rudder-sdk-js/commit/1e24e15a3f6d239ea4b4920a9e354caaa2ed795e)
- edits after end to end test [`995579e`](https://github.com/rudderlabs/rudder-sdk-js/commit/995579e28297e820bb6b2a95f51688ff4e0f6ca0)
- mandatory field checks reverted and scriploader edit [`549a728`](https://github.com/rudderlabs/rudder-sdk-js/commit/549a7289477cab88dbef0985f41dcc5965b80971)
- mandatory field checks reverted and scriploader edit [`8e9d999`](https://github.com/rudderlabs/rudder-sdk-js/commit/8e9d9999086ecb4dc521c1c5565566c0cd2707a9)
- include paths handling edited [`1b2c9cf`](https://github.com/rudderlabs/rudder-sdk-js/commit/1b2c9cfb024998fb170e6ebb3d7dc7f9166af9ca)
- include paths handling edited [`c21c120`](https://github.com/rudderlabs/rudder-sdk-js/commit/c21c1203c127d89b8dd80365d71b9ea13a04bc47)
- refactored code [`c30df50`](https://github.com/rudderlabs/rudder-sdk-js/commit/c30df501f1b58a2d041189d4d005a717d45b1204)
- refactored code [`a058f81`](https://github.com/rudderlabs/rudder-sdk-js/commit/a058f816e0ac2466bb788df5a2448609ccd0d633)
- adding set release by property [`5e49c87`](https://github.com/rudderlabs/rudder-sdk-js/commit/5e49c87874474b8dde66c4f5214cc7c55e1e9545)
- adding set release by property [`520cffa`](https://github.com/rudderlabs/rudder-sdk-js/commit/520cffabb8ab0a0a45d73c106ed54ad78c10b3fc)
- event not dropped if username, email or id is not present [`5c91e25`](https://github.com/rudderlabs/rudder-sdk-js/commit/5c91e25c0cfa6705307e7ea3efe7d0d72804ae45)
- event not dropped if username, email or id is not present [`88a472c`](https://github.com/rudderlabs/rudder-sdk-js/commit/88a472c5a2fead572d2348d81718769c0181bafa)
- logger addition, object to array conversion and formatting [`c3d146d`](https://github.com/rudderlabs/rudder-sdk-js/commit/c3d146d7ad7b67a72a154c4d626f557ebfb2d430)
- logger addition, object to array conversion and formatting [`132b7b9`](https://github.com/rudderlabs/rudder-sdk-js/commit/132b7b99983e460ee344da4f4d1b8a66d3fa664f)
- initial commit for rewriteFrames [`d46e288`](https://github.com/rudderlabs/rudder-sdk-js/commit/d46e2883b30c04fec57c8f421c12da24f2a0cbd8)
- initial commit for rewriteFrames [`c443b30`](https://github.com/rudderlabs/rudder-sdk-js/commit/c443b304e1ef1a8222b1a2a012c9934ab4f0712a)
- commit without rewrite frames [`8730d57`](https://github.com/rudderlabs/rudder-sdk-js/commit/8730d572ab795b9f4f4d82cc49476f0da9b0a019)
- commit without rewrite frames [`8c8a9cc`](https://github.com/rudderlabs/rudder-sdk-js/commit/8c8a9cc877287e20ca37596286b18f4ce4c1291d)
- review comment addressed for initial commit [`f7e045c`](https://github.com/rudderlabs/rudder-sdk-js/commit/f7e045cb013c755106d1a207b9994090a23f4164)
- review comment addressed for initial commit [`cfb668c`](https://github.com/rudderlabs/rudder-sdk-js/commit/cfb668cb42e6d955eb5d4e8997c8800bb26a8350)
- initial commit without rewrite frames [`914af60`](https://github.com/rudderlabs/rudder-sdk-js/commit/914af608d15937ca3bf0741dfe9624479adfa18e)
- initial commit without rewrite frames [`b6ec6bd`](https://github.com/rudderlabs/rudder-sdk-js/commit/b6ec6bd84a41ceed5e9bfbbd9718697b50d00b15)
- ProfitWell initial Commit [`4fc12f7`](https://github.com/rudderlabs/rudder-sdk-js/commit/4fc12f7363a27d57dfab1de66f71573a69fa8a1f)
- add isLoaded and isReady check [`14eb2ab`](https://github.com/rudderlabs/rudder-sdk-js/commit/14eb2ab0877e41ccc1ad2c54e5336f416e797298)
- Delete test-tool.yaml [`87c8d5a`](https://github.com/rudderlabs/rudder-sdk-js/commit/87c8d5a2e519bf585183b7218b79598fdd3e1cbd)
- remove unused import [`140eefa`](https://github.com/rudderlabs/rudder-sdk-js/commit/140eefa5946d26d58b1448aa1f0371450a7dd8aa)
- correct payload key [`37c7ae0`](https://github.com/rudderlabs/rudder-sdk-js/commit/37c7ae0c22a6b192e2275052f342aba92cef8bc4)
- remove throw error message [`8639a94`](https://github.com/rudderlabs/rudder-sdk-js/commit/8639a94708393f52f20b0efa16e9bc2b9a524019)
- remove cookieData [`008fe6d`](https://github.com/rudderlabs/rudder-sdk-js/commit/008fe6d96804d17777a616bcc58e5383acd426b3)
- refactor code [`28a1882`](https://github.com/rudderlabs/rudder-sdk-js/commit/28a1882e75b7901b10886383084b5eb715c55da3)
- refactor code [`5536ca0`](https://github.com/rudderlabs/rudder-sdk-js/commit/5536ca0922d75ca53d856b9d86b19a145e7f8103)
- ProfitWell Initial Commit [`1ef638f`](https://github.com/rudderlabs/rudder-sdk-js/commit/1ef638f5a731d7b58eff94f1a6b4f271e9348dc7)
- removed checkout_id support and replaced it with order_id to align better with ecomm spec [`6f9a4d3`](https://github.com/rudderlabs/rudder-sdk-js/commit/6f9a4d30d08f0493f2fe523498cbc761a12e6b6a)
- Snap Pixel Initial Commit [`e42f8da`](https://github.com/rudderlabs/rudder-sdk-js/commit/e42f8da149fd2ba9483b5de987c16f54cf3d0988)
- refactor event names [`2075cdd`](https://github.com/rudderlabs/rudder-sdk-js/commit/2075cddd54380fbd224a8a036e3160136c3dd5d2)
- Fix for when Google Ads track is calling RudderElement.properties instead of RudderElement.message.properties [`c8c6f7b`](https://github.com/rudderlabs/rudder-sdk-js/commit/c8c6f7bcdaddaedde38af6db8493b7871de3377c)
- update custom event list [`5dc5d33`](https://github.com/rudderlabs/rudder-sdk-js/commit/5dc5d33d156b5ce6c5277b9157743b78d76c8e5e)
- remove page_view event from the list [`da645d2`](https://github.com/rudderlabs/rudder-sdk-js/commit/da645d27458df2827cd5ca64d08369cb201c312a)
- minor update [`703eacb`](https://github.com/rudderlabs/rudder-sdk-js/commit/703eacb149b2d654ffd7b700b5a88c0a245a085a)
- add log and change event name [`b41e1d1`](https://github.com/rudderlabs/rudder-sdk-js/commit/b41e1d1766db54d22e841e32328685e60eee4a67)
- trim the event value [`20c12a8`](https://github.com/rudderlabs/rudder-sdk-js/commit/20c12a838a4400a8c982817a74dcda4c67a7e4de)
- add edge cases and refactor code [`df1ab5a`](https://github.com/rudderlabs/rudder-sdk-js/commit/df1ab5ac18b71f48ceaca5c8fb73a16c9c1aa42c)
- modified payload mapping [`56023e9`](https://github.com/rudderlabs/rudder-sdk-js/commit/56023e9bf19068debc6a494e6d2248dc399d54c4)
- add cases for empty payload [`1107c1d`](https://github.com/rudderlabs/rudder-sdk-js/commit/1107c1de48d250015518b2403d63d3a6ff36dc06)
- add cookie data check and reformat code [`b919b30`](https://github.com/rudderlabs/rudder-sdk-js/commit/b919b30f1a09d72ab567ee3763dda1d5ead50b75)
- Snap Pixel Initial Commit [`3a3a9fb`](https://github.com/rudderlabs/rudder-sdk-js/commit/3a3a9fbcdcb7b32a5b4db9630eaf163e4c0c2119)
- Merge pull request #308 from rudderlabs/production-staging [`de5d618`](https://github.com/rudderlabs/rudder-sdk-js/commit/de5d618c714a9bb0e468012bc1fecd763cdbe576)
- brave browser detection logic modified [`377b3e4`](https://github.com/rudderlabs/rudder-sdk-js/commit/377b3e421880e54e9caac309d7fa3424db4ee007)
- comment added [`5f6a6ab`](https://github.com/rudderlabs/rudder-sdk-js/commit/5f6a6ab79bf79645cb5b3c3ed1b51919126e6fb1)
- Detect brave browser and add it to the userAgent [`d64f8a4`](https://github.com/rudderlabs/rudder-sdk-js/commit/d64f8a4b50fb58221d35cc300dfa8f735c7524be)
- Merge pull request #304 from rudderlabs/production-staging [`81605a7`](https://github.com/rudderlabs/rudder-sdk-js/commit/81605a7032cc36b6c2c0a204f11aef6577dd575d)
- remove comment [`4f464d3`](https://github.com/rudderlabs/rudder-sdk-js/commit/4f464d3a2909a81f9372c0d80ac375ad30fdea51)
- update drip campaign fields [`e434e65`](https://github.com/rudderlabs/rudder-sdk-js/commit/e434e65b635e1d19bf3a5c9788da2f0642e8b1fc)
- reformat code [`6dedc31`](https://github.com/rudderlabs/rudder-sdk-js/commit/6dedc31c51c238a3472de90e631d381abcd09f67)
- add custom fields for identify [`468d07a`](https://github.com/rudderlabs/rudder-sdk-js/commit/468d07a5e4b6cf01242f00e6fee0ed64509449ef)
- Merge pull request #298 from rudderlabs/OVP_FOR_AA [`a511e23`](https://github.com/rudderlabs/rudder-sdk-js/commit/a511e23d57eb1dce4c170a954677db17753564c4)
- reformat code [`d8bd5d4`](https://github.com/rudderlabs/rudder-sdk-js/commit/d8bd5d42dffe86b2fe32ed440f93d425ba38c09d)
- set ovp for AA from properties (dr.dk) [`68a7410`](https://github.com/rudderlabs/rudder-sdk-js/commit/68a7410669ed1afcd21ee5319f5b34596a5c9419)
- Revert "set ovp for AA from properties (dr.dk)" [`e767e37`](https://github.com/rudderlabs/rudder-sdk-js/commit/e767e37fdc8c9c1610eae945a35151159e2ba8f7)
- set ovp for AA from properties (dr.dk) [`581dd69`](https://github.com/rudderlabs/rudder-sdk-js/commit/581dd69df7a1327db7163adb06778a08a8e95757)
- dynamicTitle ternary condition edit [`a053142`](https://github.com/rudderlabs/rudder-sdk-js/commit/a0531424b5e873cd94a3009bd298e07c10e7b6f6)
- correct function name [`625b39f`](https://github.com/rudderlabs/rudder-sdk-js/commit/625b39f9f4056496c2e271d7c79200df0a4c2ef4)
- minor update [`d3a79d6`](https://github.com/rudderlabs/rudder-sdk-js/commit/d3a79d6ae06d58b80c3650e40864f6305253beee)
- minor update and refactor code [`f1950e7`](https://github.com/rudderlabs/rudder-sdk-js/commit/f1950e75f6b513715d7cd1f4a101b8a38a33daee)
- page title edit [`1d495ff`](https://github.com/rudderlabs/rudder-sdk-js/commit/1d495ff0cd0e7758e2dffcb39313a25db1f346a5)
- minor updates [`e19305a`](https://github.com/rudderlabs/rudder-sdk-js/commit/e19305a132e466b1f03c8611db13ec2c331548d8)
- minor edits in logic [`e1f7d92`](https://github.com/rudderlabs/rudder-sdk-js/commit/e1f7d923af537f0db653b355abe8804cff81e472)
- minor edits in logic [`79cafe7`](https://github.com/rudderlabs/rudder-sdk-js/commit/79cafe7a98209468688610bda0a574196b46f935)
- editing extra page call [`51a5d42`](https://github.com/rudderlabs/rudder-sdk-js/commit/51a5d427a747e58bb9dbda04c3ed799e24ef1943)
- script loading edit [`79b818a`](https://github.com/rudderlabs/rudder-sdk-js/commit/79b818a729c5ebf46c857167e6416bd5fa2f0a0d)
- add custom events for track call [`1c3ae8d`](https://github.com/rudderlabs/rudder-sdk-js/commit/1c3ae8d758b63c367f19805e31ac08843d1d471b)
- modify few conditions and refactor code [`c96ce03`](https://github.com/rudderlabs/rudder-sdk-js/commit/c96ce03539b199603d571dfa6e530aff29315061)
- reformatting page call code [`ae96683`](https://github.com/rudderlabs/rudder-sdk-js/commit/ae96683242938d52e7228e9d2d67fe79ccf1bc2f)
- adding category in page call [`1f7f3a5`](https://github.com/rudderlabs/rudder-sdk-js/commit/1f7f3a5c6202e1097bb4b27b0fc60ed90ae7b742)
- add window keyword and ES6 syntax [`3f36a5c`](https://github.com/rudderlabs/rudder-sdk-js/commit/3f36a5c4ab4e4f6e361879bda54c5a0f6bed9847)
- modified few conditions and reformatted code [`059263e`](https://github.com/rudderlabs/rudder-sdk-js/commit/059263e0d419f73e7aad1f881b74f0b6b71e1bdb)
- change to camelCase and reformat code [`db8cf54`](https://github.com/rudderlabs/rudder-sdk-js/commit/db8cf547ae281878fe328190f82082c94e4a2266)
- adding page call [`00ed711`](https://github.com/rudderlabs/rudder-sdk-js/commit/00ed711d63031afcc81e5a91720aa686f3411a4d)
- minor edit in script loading [`94581a6`](https://github.com/rudderlabs/rudder-sdk-js/commit/94581a662cf3feee77c64c0806f0045c579aa64e)
- change drip keys [`80fea2a`](https://github.com/rudderlabs/rudder-sdk-js/commit/80fea2a116ea77d6612bfac22481d96fc98bac16)
- Drip initial commit [`f9a8ddb`](https://github.com/rudderlabs/rudder-sdk-js/commit/f9a8ddb4517ac342ea6eb67b55e8004272d8b9d5)
- minor edit in script loading [`69cb97a`](https://github.com/rudderlabs/rudder-sdk-js/commit/69cb97a7f71917e1fb56aeb99b95260bbe53e66f)
- initial commit [`709234d`](https://github.com/rudderlabs/rudder-sdk-js/commit/709234df4baba310370ff991cb52f8adba922e5a)
- add minor formatting [`0ea6955`](https://github.com/rudderlabs/rudder-sdk-js/commit/0ea6955c1c8182f65ac2aa476953eeda68c52387)
- refactored code [`8674153`](https://github.com/rudderlabs/rudder-sdk-js/commit/8674153a2a58c3dbd9aeb4c2e0c73871690a9bfd)
- mixpanel conflict resolve [`d58d0c5`](https://github.com/rudderlabs/rudder-sdk-js/commit/d58d0c561e3e34536db253c5dc5305a3e6ffd4cd)
- Updated Intercom name field with firstName and lastName if not set [`26be887`](https://github.com/rudderlabs/rudder-sdk-js/commit/26be887888d99daaf580e0d4a530ec4d8e7db567)
- Updated Mixpanel config values with default values [`3678920`](https://github.com/rudderlabs/rudder-sdk-js/commit/3678920cdba4a0d5c97254e48b27f7657d5deb9c)
- mixpanel fix for persistance name [`b43708a`](https://github.com/rudderlabs/rudder-sdk-js/commit/b43708a8d6ddae5f138a39774d632732a96111ac)
- mixpanel fix for persistance name [`92144da`](https://github.com/rudderlabs/rudder-sdk-js/commit/92144da654d63a26e01f8537fc216eda89fec917)
- fix typo in lytics integration [`8626698`](https://github.com/rudderlabs/rudder-sdk-js/commit/8626698531b682902b0332b961d9b3ca6c1613b3)
- formatting [`4ec0959`](https://github.com/rudderlabs/rudder-sdk-js/commit/4ec0959d8e70d9aba8c9f90f5ede7ce1aaf81494)
- Revert "minor update" [`82db1f0`](https://github.com/rudderlabs/rudder-sdk-js/commit/82db1f0b4dda2423a049f3e289963a1dff938f88)
- Revert "edits in filter array assign" [`65c3159`](https://github.com/rudderlabs/rudder-sdk-js/commit/65c31595947edabba1533263684b409c08a14069)
- minor update [`c4790be`](https://github.com/rudderlabs/rudder-sdk-js/commit/c4790bec4eabd0d2ae254e845ccfb1ae058ddd59)
- added default value for additional settings [`51513fe`](https://github.com/rudderlabs/rudder-sdk-js/commit/51513fe696d5465989a78f6f07dce399ae9bc063)
- Merge pull request #287 from rudderlabs/production-staging [`0629ddd`](https://github.com/rudderlabs/rudder-sdk-js/commit/0629dddfee899be6e384d00081ff34b0c860ec07)
- edits in filter array assign [`f252006`](https://github.com/rudderlabs/rudder-sdk-js/commit/f25200643ca7dc7af74e88abcfe982871f695180)
- added three additional settings [`39934a4`](https://github.com/rudderlabs/rudder-sdk-js/commit/39934a45f3f2c790ec5aeae0d3406aba1649ec50)
- filters spelling changed [`e66f175`](https://github.com/rudderlabs/rudder-sdk-js/commit/e66f1751bfe3be74d296703a014342f17dd7e930)
- mixpanel added support for cookie configs device mode [`f5788da`](https://github.com/rudderlabs/rudder-sdk-js/commit/f5788dafa0a2e58bf40ee82784849954a12010f4)
- filters added, review comments addressed [`2ae1e7f`](https://github.com/rudderlabs/rudder-sdk-js/commit/2ae1e7fd88aba356517cdd8fdfcca7a8a4828877)
- refactored code [`e94b832`](https://github.com/rudderlabs/rudder-sdk-js/commit/e94b832736f52a4b97b4ab2afbe17c5b06490c93)
- review comments addresses, extra data added [`c53ae25`](https://github.com/rudderlabs/rudder-sdk-js/commit/c53ae25176d4e90832f66c280df78fe404c32a07)
- commit 2 [`168a326`](https://github.com/rudderlabs/rudder-sdk-js/commit/168a326390ea4c5c04c476df795cd0bc44ef5dfd)
- mixpanel added support for general traits [`da5e5e8`](https://github.com/rudderlabs/rudder-sdk-js/commit/da5e5e82635726e48ff6903b966125b461cdd12f)
- mixpanel bugfix [`3cb93b4`](https://github.com/rudderlabs/rudder-sdk-js/commit/3cb93b44f9ce1e6d7f39e8957f0a2e5cbb1ca686)
- mixpanel review changes [`8ed9027`](https://github.com/rudderlabs/rudder-sdk-js/commit/8ed9027e8c69ac075da181bf8ea225b6eb53b2e3)
- mixpanel bugfix [`5e9b79f`](https://github.com/rudderlabs/rudder-sdk-js/commit/5e9b79f325a2e842a59493489eb95eba13615359)
- mixpanel added logs [`0b45c5e`](https://github.com/rudderlabs/rudder-sdk-js/commit/0b45c5e02094b6afa4efd0df97065338ebaad64e)
- mixpanel minor fix [`60719a3`](https://github.com/rudderlabs/rudder-sdk-js/commit/60719a3f7d619760f10786d3bd764d42d686c0b5)
- criteo implementation [`81efeb6`](https://github.com/rudderlabs/rudder-sdk-js/commit/81efeb62512bfb8a43b2d6a1f8d268d0a1ea31f2)
- edits [`09a7f2a`](https://github.com/rudderlabs/rudder-sdk-js/commit/09a7f2ab76c9c302dad83476dfd8105d3e6ed4d5)
- mixpanel name changes [`94af828`](https://github.com/rudderlabs/rudder-sdk-js/commit/94af828ced4c19c8c0c053dfd7f1252aebe97719)
- update util and group [`3b9596e`](https://github.com/rudderlabs/rudder-sdk-js/commit/3b9596e53f142547cb6f1db40a7695a8d6128db7)
- mixpanel minor change [`6f8abcb`](https://github.com/rudderlabs/rudder-sdk-js/commit/6f8abcb903b6d0f9551edc70a10caa9848c35f06)
- add util function [`73486ab`](https://github.com/rudderlabs/rudder-sdk-js/commit/73486ab80a02e8294a0d8329376f70a1613e12c5)
- mixpanel identify [`fb67c8d`](https://github.com/rudderlabs/rudder-sdk-js/commit/fb67c8d58758414cba13bbc38ca432649ff17f82)
- add mixpanel alias call [`5c52fde`](https://github.com/rudderlabs/rudder-sdk-js/commit/5c52fde8df94c23b5c59c73ed773af953ceb3045)
- add mixpanel group call [`3f0e804`](https://github.com/rudderlabs/rudder-sdk-js/commit/3f0e804856ca03ca354cb5d0570aa2cd86f9d69b)
- minor updates [`8ed5277`](https://github.com/rudderlabs/rudder-sdk-js/commit/8ed52772f27a5ad03faad29752cb917efe06dd46)
- mixpanel onboarding [`d3d5ec2`](https://github.com/rudderlabs/rudder-sdk-js/commit/d3d5ec2cc88650e8304314ec6bcccf4636dca545)
- minor updates [`a65aea6`](https://github.com/rudderlabs/rudder-sdk-js/commit/a65aea63ec664f93703548973801f6a8486b8391)
- primary commit [`1e8b6bb`](https://github.com/rudderlabs/rudder-sdk-js/commit/1e8b6bb3d89f0d535887713e7979f4f43ce5a8c9)
- minor fix [`4a56bac`](https://github.com/rudderlabs/rudder-sdk-js/commit/4a56baca4c7d56d44cc2c7efe4fac9dd2cbe3ccf)
- reddit pixel integration update [`33813c1`](https://github.com/rudderlabs/rudder-sdk-js/commit/33813c1cde6ce00ece403ba2377745180b1b90c4)
- Fix GA4 mutation of track method properties [`0b4773c`](https://github.com/rudderlabs/rudder-sdk-js/commit/0b4773c1f814cf57d8d2ff2b1b521ba98205e488)
- Merge pull request #255 from ther0y/fix/fbq_eventCustomProperties [`c29b2ba`](https://github.com/rudderlabs/rudder-sdk-js/commit/c29b2bad6bfb8d8844c3f5db3d3016dbd9eea8a9)
- minor updates [`e9994ab`](https://github.com/rudderlabs/rudder-sdk-js/commit/e9994abc1e41829365f3f538fb773192e15c6e66)
- add event name not present check for track call [`f8b97b8`](https://github.com/rudderlabs/rudder-sdk-js/commit/f8b97b8bbd4173b120cf0f62579c7bf958fca349)
- add log message and corrected string templating [`83d22de`](https://github.com/rudderlabs/rudder-sdk-js/commit/83d22dee886061ac4e4a5aa3947ae0681867cfad)
- Merge pull request #270 from rudderlabs/production-staging [`2d2f09d`](https://github.com/rudderlabs/rudder-sdk-js/commit/2d2f09d1060811e3fa00f97961c7faf32bc45332)
- added support for name [`5704bbe`](https://github.com/rudderlabs/rudder-sdk-js/commit/5704bbe4cd004e749b5aa4047f8afd1fa1f2969e)
- resolving conflicts [`a0bc196`](https://github.com/rudderlabs/rudder-sdk-js/commit/a0bc1969bbca67881433e97407afa2e708dc415c)
- minor formatting [`a4e8a6b`](https://github.com/rudderlabs/rudder-sdk-js/commit/a4e8a6bab8451fe99ae48b0215c4558d269c27ed)
- Merge pull request #265 from rudderlabs/heapDeviceMode [`62881a2`](https://github.com/rudderlabs/rudder-sdk-js/commit/62881a287519fd42d0590dd5d428c44f33e141fe)
- added implementation of heap [`6965ef2`](https://github.com/rudderlabs/rudder-sdk-js/commit/6965ef2d7c072be6664ed2e8a698446e1dfa8648)
- developed heap web device mode [`f28d2ca`](https://github.com/rudderlabs/rudder-sdk-js/commit/f28d2ca6b3fd2270092ade138d4baae5fe27dc59)
- change intg dest name [`621fe59`](https://github.com/rudderlabs/rudder-sdk-js/commit/621fe593a27a0613cc9c60cf0c2849f1a11de8b7)
- minor fix [`9dd7adc`](https://github.com/rudderlabs/rudder-sdk-js/commit/9dd7adc2c71c111af6effc9b0797035b3a15fc17)
- linkedin pixel [`0bdc01b`](https://github.com/rudderlabs/rudder-sdk-js/commit/0bdc01b12e6368e10ddd4e3ac8d33466ce211a7a)
- removed adding of created_at if not present in traits [`e527ae5`](https://github.com/rudderlabs/rudder-sdk-js/commit/e527ae58cea8617a930f384174149387a39a5eb0)
- Merge pull request #259 from rudderlabs/production-staging [`0154004`](https://github.com/rudderlabs/rudder-sdk-js/commit/0154004c13376e8b535b7ed26d832a7f462ae262)
- changed lowest supported version of safari [`8b63f86`](https://github.com/rudderlabs/rudder-sdk-js/commit/8b63f865e498aeedd585247f0c9b5363f28f2086)
- Merge pull request #257 from rudderlabs/drdkEnhancements [`7e03dcd`](https://github.com/rudderlabs/rudder-sdk-js/commit/7e03dcd0101bc2c1a5443b0a503dc700fcc71771)
- added and fixed screen info for context.screen for device mode [`6f9de46`](https://github.com/rudderlabs/rudder-sdk-js/commit/6f9de4690bdb304bcc27a769e8bfc59c036b81a5)
- Fix eventCustomProperties issue in FacebookPixel buildPayLoad method. [`c7d50f6`](https://github.com/rudderlabs/rudder-sdk-js/commit/c7d50f6b2f188392cb26c16a806bb0abeb0e583f)
- minor bug fix [`ddb8db8`](https://github.com/rudderlabs/rudder-sdk-js/commit/ddb8db8b9a2f13e47bdcef45e6bfc9daf10cf74d)
- removed consoles [`ed3c9c1`](https://github.com/rudderlabs/rudder-sdk-js/commit/ed3c9c1895129695230255926809ef2cfb405201)
- changed logic for payload for custom events [`6d3a02f`](https://github.com/rudderlabs/rudder-sdk-js/commit/6d3a02f0c727f90f33d15ac891a88213a8b622af)
- changed variable name [`12b6f6e`](https://github.com/rudderlabs/rudder-sdk-js/commit/12b6f6e02ae0c24197b127276883ef98f5955e34)
- tested and bug fixes [`36e964e`](https://github.com/rudderlabs/rudder-sdk-js/commit/36e964e5b136b27cb30b10f086f3577c692c9885)
- addressed review comments [`3aee214`](https://github.com/rudderlabs/rudder-sdk-js/commit/3aee2144842b6b61b1c0de53af17c95faa386507)
- refactored code for adobe [`9f55399`](https://github.com/rudderlabs/rudder-sdk-js/commit/9f55399993cf5f400e2b6e03080b769e4168c924)
- minor bug fix [`750906e`](https://github.com/rudderlabs/rudder-sdk-js/commit/750906ec603c5941f285c71584eda6cf8db81fd5)
- added comments [`b4ad8e5`](https://github.com/rudderlabs/rudder-sdk-js/commit/b4ad8e52224be2ee3dc941994105b5999dd7329e)
- dev bug fixes [`dc3bf9e`](https://github.com/rudderlabs/rudder-sdk-js/commit/dc3bf9e3447d36d09bb3682b23285a45f3433bc1)
- bug fixes for normal track events [`f823e42`](https://github.com/rudderlabs/rudder-sdk-js/commit/f823e424d57f9507d4ecebadd46c836440cce489)
- added remaining functionalities [`7ebd966`](https://github.com/rudderlabs/rudder-sdk-js/commit/7ebd9666b4dd1f14b89005c7a4e07cd430ca7e21)
- list properties added [`acbb40f`](https://github.com/rudderlabs/rudder-sdk-js/commit/acbb40f5609b340effae4d554357e1309f16541c)
- added properties event level except list property and product level properties remaining [`1af3428`](https://github.com/rudderlabs/rudder-sdk-js/commit/1af34284d6349e851abc18a114ff92b04b0df549)
- added functionality for tracks [`8ef0928`](https://github.com/rudderlabs/rudder-sdk-js/commit/8ef0928c787cf4dfbaa88d40ddee61b29a857ee8)
- Minor fixes [`d524fe0`](https://github.com/rudderlabs/rudder-sdk-js/commit/d524fe01af32ddb02ac1a6d83e4911145f38eb24)
- added and tested page calls [`b16a5ac`](https://github.com/rudderlabs/rudder-sdk-js/commit/b16a5ac4d6605871fefaf3414c6c69b7269a71a5)
- initial commit [`38f5405`](https://github.com/rudderlabs/rudder-sdk-js/commit/38f54055b7ee076b5c4ffdafdcef01f729192c71)
- initial commit [`12d2540`](https://github.com/rudderlabs/rudder-sdk-js/commit/12d25403e6704a46f301f23c332367858a320166)
- Added integration_cname as Pinterest and pinterest [`8bd0d22`](https://github.com/rudderlabs/rudder-sdk-js/commit/8bd0d22a99ae223fc64bb09826177b35e314fc95)
- Fixed wrong property mapping issues and incorporated changes acc to webapp [`eb8cb22`](https://github.com/rudderlabs/rudder-sdk-js/commit/eb8cb2270b03c5b2a62e6eee74d8bfa65d0ef66b)
- Update package.json [`352f523`](https://github.com/rudderlabs/rudder-sdk-js/commit/352f5230331257cb4ce37cf5f91754ab377b61ed)
- Update package.json [`cebdcf8`](https://github.com/rudderlabs/rudder-sdk-js/commit/cebdcf88786502465870e883511f66a316cc779a)
- Update package.json [`6a303fc`](https://github.com/rudderlabs/rudder-sdk-js/commit/6a303fcc5e55413aa466c8fc26be9008b2b6b255)
- Added test cases [`fcb90b8`](https://github.com/rudderlabs/rudder-sdk-js/commit/fcb90b814dd68f9068fef5105ea31e240232d58b)
- change readme [`8ed95e2`](https://github.com/rudderlabs/rudder-sdk-js/commit/8ed95e24277741a822067cb5620600271fe6532a)
- add flag for reset [`bae8e61`](https://github.com/rudderlabs/rudder-sdk-js/commit/bae8e61f3d55f4f745021378634c09935d5704f5)
- bump version [`7876ca2`](https://github.com/rudderlabs/rudder-sdk-js/commit/7876ca2a81bc2e4fabe1a42b5f6b84768e127b17)
- add dist files [`e03d983`](https://github.com/rudderlabs/rudder-sdk-js/commit/e03d983cfe9ba113be468bfeffd844f29a54c312)
- A minor change [`69045ab`](https://github.com/rudderlabs/rudder-sdk-js/commit/69045ab8e6797b1e0b02bd2d46f3a88cdb4faabf)
- Provided support for revenue & total. [`1e13e87`](https://github.com/rudderlabs/rudder-sdk-js/commit/1e13e870cc0e6fc60aced76969d1ceb607ce9421)
- Update package.json [`1b590aa`](https://github.com/rudderlabs/rudder-sdk-js/commit/1b590aab335ae2e6bc15db89bd634d93ee4ae713)
- legacy support fixes [`b93cb60`](https://github.com/rudderlabs/rudder-sdk-js/commit/b93cb60c40d703f4dd7e22260c3472c1cfb07662)
- Updated browser.js file [`051d746`](https://github.com/rudderlabs/rudder-sdk-js/commit/051d746b86b65d23c5f7dcbd957098ef47b98ad0)
- Updated browser.js file. [`3d02acc`](https://github.com/rudderlabs/rudder-sdk-js/commit/3d02acc7449a6e44bae895a420c3428943129f3d)
- Update index.js [`123c577`](https://github.com/rudderlabs/rudder-sdk-js/commit/123c57734980ffe7ce3a9723eded538de62c3b98)
- Update client_server_name.js [`50a0bee`](https://github.com/rudderlabs/rudder-sdk-js/commit/50a0beee7c8d7547d62dd4237975d9d4cd69ea9c)
- Add files via upload [`36ccc86`](https://github.com/rudderlabs/rudder-sdk-js/commit/36ccc86400c5cccdeebda646e6b1a06eef7365e0)
- minor util fix [`815d29a`](https://github.com/rudderlabs/rudder-sdk-js/commit/815d29a000553eeed55ec4bad2aca5a4d19d9b9f)
- post test fixes [`cea2f5d`](https://github.com/rudderlabs/rudder-sdk-js/commit/cea2f5da012dba93a7a05763fbc99abf299d4177)
- bump version [`d1b7902`](https://github.com/rudderlabs/rudder-sdk-js/commit/d1b7902a244ad41f7407574ce33019fa0fabe5ff)
- pull changes from other PR and changes to storage [`1d18766`](https://github.com/rudderlabs/rudder-sdk-js/commit/1d187667e6d885e449d84223ed4fa0e0e257bc7e)
- pull changes from other PR and changes to storage [`474653d`](https://github.com/rudderlabs/rudder-sdk-js/commit/474653d05f638b95e40ee4466ac7e3eaf9defb1f)
- fix for util fxns [`c3dc1e7`](https://github.com/rudderlabs/rudder-sdk-js/commit/c3dc1e7e18c77604cee30a8438fe9fbdeb2c8db2)
- addressed review comments [`4d3bfd1`](https://github.com/rudderlabs/rudder-sdk-js/commit/4d3bfd13cba85277ea6b074abac4d232adcb7060)
- bump version [`475886d`](https://github.com/rudderlabs/rudder-sdk-js/commit/475886df1ff7711efc5843a55119b037f4d28cb4)
- device mode support for page call aswell [`e837e04`](https://github.com/rudderlabs/rudder-sdk-js/commit/e837e04469107be1edeced2cb6c352819e7d8691)
- fixes [`377e34b`](https://github.com/rudderlabs/rudder-sdk-js/commit/377e34bfa27165c2b3330c66aa2c3494c5cff738)
- added util fxn [`66ee347`](https://github.com/rudderlabs/rudder-sdk-js/commit/66ee347e571d6d43a13a28db53b3ed93a9035ad3)
- added babel transform plugin for object assign [`bd6fe6d`](https://github.com/rudderlabs/rudder-sdk-js/commit/bd6fe6d8334ec8ef003695c6cdd538778b9e66cb)
- resolving conflict [`634b930`](https://github.com/rudderlabs/rudder-sdk-js/commit/634b9309151a9fc90e8a1755c0cf41c02b340016)
- review changes minor [`8a01073`](https://github.com/rudderlabs/rudder-sdk-js/commit/8a0107392845d5340c2e1783badbb2a86e4bfcac)
- minor fix [`621b1e8`](https://github.com/rudderlabs/rudder-sdk-js/commit/621b1e8ab76d901a043201a7b5a288a47b1125f7)
- klaviyo review comment fixes [`3fcfe09`](https://github.com/rudderlabs/rudder-sdk-js/commit/3fcfe09e29fe96658edf7a7b7ba5154c5b8facb7)
- store initial referrer and referring domain and add in payload [`148d525`](https://github.com/rudderlabs/rudder-sdk-js/commit/148d525ca1aa471b694bc5bf5d96ac0745756eb5)
- reverting check for traits in message root [`fc5547a`](https://github.com/rudderlabs/rudder-sdk-js/commit/fc5547a2a6a53334d4ee3a7fac2b5bc8cb8825a7)
- remove untracked files [`a759adc`](https://github.com/rudderlabs/rudder-sdk-js/commit/a759adcb96f2f411eb20dc49080f5d29519d66ec)
- update gitignore and autotrack [`0201860`](https://github.com/rudderlabs/rudder-sdk-js/commit/020186027a03a192e0697ec19c9ee18f92074f57)
- page call fixes [`62af828`](https://github.com/rudderlabs/rudder-sdk-js/commit/62af82811c4a9f0c6624b470af7415360360cd67)
- minor fix [`5b0b2aa`](https://github.com/rudderlabs/rudder-sdk-js/commit/5b0b2aacbc5613d5d6ef85ca8aed9119516394d0)
- klaviyo review comment fixes [`1facad3`](https://github.com/rudderlabs/rudder-sdk-js/commit/1facad312b7aaa627089d4c644b767cd401fd34b)
- klaviyo update [`ffec339`](https://github.com/rudderlabs/rudder-sdk-js/commit/ffec339897352e0385ee5f536014b30417dfb2fc)
- klaviyo device mode onboarding [`b216fcb`](https://github.com/rudderlabs/rudder-sdk-js/commit/b216fcb9ff8972304b80f64a1054d3ccc2756427)
- Build NPM and add dist folder [`af176ba`](https://github.com/rudderlabs/rudder-sdk-js/commit/af176ba474f57b7638fb8575d558f7e277aa0dba)
- Add "getSourceConfig" option as an alternative to "configUrl" to get sourceConfig [`49211f7`](https://github.com/rudderlabs/rudder-sdk-js/commit/49211f7fd7b64c11d229265fc46331ce7b05e362)
- Update README.md [`f071344`](https://github.com/rudderlabs/rudder-sdk-js/commit/f07134491fc6f224f154a7affd5d84a05b4d31ee)
- Add License [`aaf1033`](https://github.com/rudderlabs/rudder-sdk-js/commit/aaf10332bf116026dff711d599f73c865524494d)
- Delete LICENSE [`6c8fed0`](https://github.com/rudderlabs/rudder-sdk-js/commit/6c8fed0844db363b38f523e5b027f86097e1348c)

## [1.1.1](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.1-rc.2...1.1.1) - 2020-05-01

### Merged

- Fixes [`#54`](https://github.com/rudderlabs/rudder-sdk-js/pull/54)
- Addresses issue #49: sets updated page data on GA tracker [`#52`](https://github.com/rudderlabs/rudder-sdk-js/pull/52)
- Addresses issue #50: populate 'category' and 'label' fields in GA [`#53`](https://github.com/rudderlabs/rudder-sdk-js/pull/53)
- add callbacks to method names globally [`#46`](https://github.com/rudderlabs/rudder-sdk-js/pull/46)
- Intercom fix [`#45`](https://github.com/rudderlabs/rudder-sdk-js/pull/45)

### Commits

- modify changelog [`4f3cd2e`](https://github.com/rudderlabs/rudder-sdk-js/commit/4f3cd2e22f1dfd133fdb0f24db4e9f581337a436)
- adding files for release [`3878bd7`](https://github.com/rudderlabs/rudder-sdk-js/commit/3878bd77f89355250b4298cd9e66160e53de7704)
- update dist files [`b929f48`](https://github.com/rudderlabs/rudder-sdk-js/commit/b929f4824bb03be7549332fc111d4de6ce1fab7f)
- update dist [`6e27cad`](https://github.com/rudderlabs/rudder-sdk-js/commit/6e27cad4ececbe3bec71ace1986c344ae7e52877)
- remove console logs [`205108d`](https://github.com/rudderlabs/rudder-sdk-js/commit/205108d122158872e73f2d4cf52c3ce755e6ed35)
- add check and set same-site on cookies [`f7ae61a`](https://github.com/rudderlabs/rudder-sdk-js/commit/f7ae61a723a26f3375e9c6fba438671e69e1885d)
- add check and more logs [`4e3e7fe`](https://github.com/rudderlabs/rudder-sdk-js/commit/4e3e7fef8ff564ecce5bca227aea68ba2ea59715)
- added ecommerce events [`624e822`](https://github.com/rudderlabs/rudder-sdk-js/commit/624e822c682e2246f58b0d48ee5812e6b40a4ae8)
- made change for legace events [`807b54b`](https://github.com/rudderlabs/rudder-sdk-js/commit/807b54b802d3fb4d60e7bd7d59e3592798bccf3f)
- making changes for fb-pixel [`9cf5574`](https://github.com/rudderlabs/rudder-sdk-js/commit/9cf5574abf0af39f08af34932136a580ee28b99a)
- add tracker name [`b6cdd53`](https://github.com/rudderlabs/rudder-sdk-js/commit/b6cdd53d446c7c314d6d207153da902b5ff38521)
- Update README.md [`269cdf5`](https://github.com/rudderlabs/rudder-sdk-js/commit/269cdf507e2a72b81e6bb1cce31ca11961668b04)
- add dependency [`6b88610`](https://github.com/rudderlabs/rudder-sdk-js/commit/6b88610c5c031a9e86d6df78d69ee9b37716064d)
- update dist files [`04a21eb`](https://github.com/rudderlabs/rudder-sdk-js/commit/04a21ebb457da1a01c1e5d6a2cd18270e1bfb806)
- adding missing dependency [`b14f393`](https://github.com/rudderlabs/rudder-sdk-js/commit/b14f393478172eef7380cf4aae04c5047bbb0f71)
- Update README.md [`5ae4e21`](https://github.com/rudderlabs/rudder-sdk-js/commit/5ae4e21c39018f62aef08ba348f2768ebac232da)
- Update README.md [`dc5184b`](https://github.com/rudderlabs/rudder-sdk-js/commit/dc5184b16bf28c3efc5307deb54b718472f053b8)
- Update README.md [`814fee7`](https://github.com/rudderlabs/rudder-sdk-js/commit/814fee72e23d3867157cff896808d1af21d1c382)

## [1.1.1-rc.2](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.1-rc.1...1.1.1-rc.2) - 2020-03-24

### Merged

- test commit [`#44`](https://github.com/rudderlabs/rudder-sdk-js/pull/44)
- update gzip and brotli dist files [`#43`](https://github.com/rudderlabs/rudder-sdk-js/pull/43)
- Lotame Integration [`#42`](https://github.com/rudderlabs/rudder-sdk-js/pull/42)
- bug fix [`#41`](https://github.com/rudderlabs/rudder-sdk-js/pull/41)

### Commits

- adding release steps [`ac096c3`](https://github.com/rudderlabs/rudder-sdk-js/commit/ac096c3cdb495316907c8dad31eafa3dc7e9382b)
- change to master [`d24813d`](https://github.com/rudderlabs/rudder-sdk-js/commit/d24813d3554bfb0b12ab030f3ba898076ed7d3f8)
- test with develop [`ba4a81e`](https://github.com/rudderlabs/rudder-sdk-js/commit/ba4a81edd7cffef2bb81649096715397068ecbcd)
- update dist files [`1b77022`](https://github.com/rudderlabs/rudder-sdk-js/commit/1b770229d8aeb7bb86ab8c34c5a5c6204459f385)
- add siz-limit [`93a6c26`](https://github.com/rudderlabs/rudder-sdk-js/commit/93a6c2644a8ca4e4b9b111e511fc45909534136b)
- add siz-limit [`891b556`](https://github.com/rudderlabs/rudder-sdk-js/commit/891b556f1a4d50c8ed363b9c2ce7dbd4e8698e4b)
- add dependencies [`ca4b20e`](https://github.com/rudderlabs/rudder-sdk-js/commit/ca4b20e431f32647376bca0ede06a01d4452b832)
- add dependencies [`34223fe`](https://github.com/rudderlabs/rudder-sdk-js/commit/34223feaa39e6b5a24480e1c98deeb262b3d093a)
- add size dependencies [`9ed810f`](https://github.com/rudderlabs/rudder-sdk-js/commit/9ed810f375a6b70fb1b99968b6452ad9c61cf442)
- add size dependencies [`b814200`](https://github.com/rudderlabs/rudder-sdk-js/commit/b8142008651152fd302700b09c33e7f3723b15b1)
- code review comment incorporation. [`28bdd57`](https://github.com/rudderlabs/rudder-sdk-js/commit/28bdd57406c5249dfc29225f503bef4988dc2642)
- removed handlebars [`04e2c69`](https://github.com/rudderlabs/rudder-sdk-js/commit/04e2c694fc7391a63e16aaee821d17fcec323d82)
- lotame synch pixel callback [`f63c1c7`](https://github.com/rudderlabs/rudder-sdk-js/commit/f63c1c7d0969424969937700584c8ddf3f050604)
- changes for lotame storage and fetching value from config [`d3c534b`](https://github.com/rudderlabs/rudder-sdk-js/commit/d3c534b5ca4cdc03e10a2b0af75e4f8ec511c9e4)
- Update README.md [`33013a7`](https://github.com/rudderlabs/rudder-sdk-js/commit/33013a7a2eb20618c599c2032da348fd21d5f8da)
- Update README.md [`8a47649`](https://github.com/rudderlabs/rudder-sdk-js/commit/8a47649091182a5bff9b8194d5e860dc3f7ba411)
- Update README.md [`c185a92`](https://github.com/rudderlabs/rudder-sdk-js/commit/c185a92ca010420290e51846cbfa0885c663a5b3)
- initial commit for lotame [`4eefd6e`](https://github.com/rudderlabs/rudder-sdk-js/commit/4eefd6e29813608fc36db96f6f89832e5ff433a2)

## [1.1.1-rc.1](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.1-rc.0...1.1.1-rc.1) - 2020-03-17

### Merged

- making release [`#40`](https://github.com/rudderlabs/rudder-sdk-js/pull/40)
- add page prop to context and autotrack enabled from load option [`#39`](https://github.com/rudderlabs/rudder-sdk-js/pull/39)

### Commits

- add page prop to context and autotrack enabled as option [`b28cb38`](https://github.com/rudderlabs/rudder-sdk-js/commit/b28cb38eb40e6ca7fe9a2e81154b5a88dc2ea7da)
- Update README.md [`c00027d`](https://github.com/rudderlabs/rudder-sdk-js/commit/c00027d62383f2fcb19119021c767a69c6ebf069)

## [1.1.1-rc.0](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.0...1.1.1-rc.0) - 2020-03-16

### Merged

- add missing dependency [`#38`](https://github.com/rudderlabs/rudder-sdk-js/pull/38)
- Release [`#37`](https://github.com/rudderlabs/rudder-sdk-js/pull/37)
- remove default_ip [`#36`](https://github.com/rudderlabs/rudder-sdk-js/pull/36)

### Commits

- update changelog [`4891420`](https://github.com/rudderlabs/rudder-sdk-js/commit/4891420d427e40e62e39818d93d60190045ef91c)
- update distfiles and other refactoring [`a757323`](https://github.com/rudderlabs/rudder-sdk-js/commit/a757323210a18bf586eb9cac4a96067916acb73c)
- Update README.md [`bda368f`](https://github.com/rudderlabs/rudder-sdk-js/commit/bda368f1fa07cc56f14a645776d6c78b4145b9f7)

## [1.1.0](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.0-beta.4...1.1.0) - 2020-03-06

### Merged

- check message size [`#35`](https://github.com/rudderlabs/rudder-sdk-js/pull/35)

### Commits

- update changelog [`93629e9`](https://github.com/rudderlabs/rudder-sdk-js/commit/93629e95544f96228e47a4ffd8c7e29ec388fe0d)
- updating dists [`3268e5a`](https://github.com/rudderlabs/rudder-sdk-js/commit/3268e5a3bfd1e8359cbd34b741a604142fb50d08)

## [1.1.0-beta.4](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.0-beta.3...1.1.0-beta.4) - 2020-02-28

### Merged

- Develop to master [`#34`](https://github.com/rudderlabs/rudder-sdk-js/pull/34)
- Revisit api calls [`#33`](https://github.com/rudderlabs/rudder-sdk-js/pull/33)

### Commits

- Release 1.1.0-beta.4 [`9c70c8c`](https://github.com/rudderlabs/rudder-sdk-js/commit/9c70c8ce5ad3792aaa3746d5224246158d04438c)

## [1.1.0-beta.3](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.0-beta.2...1.1.0-beta.3) - 2020-02-28

### Merged

- Develop to master [`#32`](https://github.com/rudderlabs/rudder-sdk-js/pull/32)
- Group call support [`#31`](https://github.com/rudderlabs/rudder-sdk-js/pull/31)
- Feature/onready [`#30`](https://github.com/rudderlabs/rudder-sdk-js/pull/30)
- Develop to master [`#29`](https://github.com/rudderlabs/rudder-sdk-js/pull/29)
- Support for configurable config url [`#28`](https://github.com/rudderlabs/rudder-sdk-js/pull/28)

### Commits

- Release 1.1.0-beta.3 [`5b321a0`](https://github.com/rudderlabs/rudder-sdk-js/commit/5b321a05b56936b06e8c09ba85c23ad14c9cdd22)
- changes for kissmetrics group [`b3e4aaf`](https://github.com/rudderlabs/rudder-sdk-js/commit/b3e4aaff4d44de52a389d7006b2e53f9601b74e5)
- Create appspec.yml [`53edb46`](https://github.com/rudderlabs/rudder-sdk-js/commit/53edb468b3238062528f2372569c5b4285281968)
- Update script-test.html [`60035db`](https://github.com/rudderlabs/rudder-sdk-js/commit/60035dbe7e7d486dbdd955de20884963e99f6a2d)
- Update script-test.html [`94d6db1`](https://github.com/rudderlabs/rudder-sdk-js/commit/94d6db1c475007f921d7ec9e963e6e44bcc9afdd)
- code clean up [`aa401d0`](https://github.com/rudderlabs/rudder-sdk-js/commit/aa401d011703304d4ddfea44ce0ef5228361c3b0)
- support for identify in hotjar and group in kissmetrics [`14e8a7b`](https://github.com/rudderlabs/rudder-sdk-js/commit/14e8a7bf181f4dbb54d897576eca2fecc81f3048)
- bug fix [`ab6d901`](https://github.com/rudderlabs/rudder-sdk-js/commit/ab6d9016c8c54abade01ab33c9738dc49d4d5c1a)
- changes [`b049b83`](https://github.com/rudderlabs/rudder-sdk-js/commit/b049b83cccffcea5675977f5ef84816b0c035130)
- bug fix [`759ae9a`](https://github.com/rudderlabs/rudder-sdk-js/commit/759ae9ab514b33fae5bbc9ad5ab9865e6b8b02a1)
- code cleanup [`c918e5e`](https://github.com/rudderlabs/rudder-sdk-js/commit/c918e5e2c54a02d27a2e8a3de0ff567e447a341e)
- support for group call [`10fc57a`](https://github.com/rudderlabs/rudder-sdk-js/commit/10fc57a0f19e3f6122ae6e868ed24b96b6842857)
- update tests [`c83e7a2`](https://github.com/rudderlabs/rudder-sdk-js/commit/c83e7a2ca6ae9631741715f744e84158f68b3e06)
- Adding support for exposing ready on analytics object [`66f2744`](https://github.com/rudderlabs/rudder-sdk-js/commit/66f27445f6bd41d362c79892ae39cad54e19a8d6)
- updated output files [`fc0be07`](https://github.com/rudderlabs/rudder-sdk-js/commit/fc0be076c253592def2c7c8092b38a362264dbd1)
- added support for configurable config url [`92f6dda`](https://github.com/rudderlabs/rudder-sdk-js/commit/92f6dda86579b53a4859f5eb34eba6b4cea21d91)

## [1.1.0-beta.2](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.0-beta.1...1.1.0-beta.2) - 2020-02-17

### Commits

- update changelog [`296c9a7`](https://github.com/rudderlabs/rudder-sdk-js/commit/296c9a720a9a5239bc0b86d53eda7e318a00f7bb)
- update dist files with newer version [`7561d13`](https://github.com/rudderlabs/rudder-sdk-js/commit/7561d13e3da42d4be1055a00b0deedc4b797383a)
- gh-release script for refernec e [`54a105a`](https://github.com/rudderlabs/rudder-sdk-js/commit/54a105a3a45110759964e71473e442a41063202e)

## [1.1.0-beta.1](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.0-beta.0...1.1.0-beta.1) - 2020-02-17

### Commits

- bump release [`3e88d99`](https://github.com/rudderlabs/rudder-sdk-js/commit/3e88d99273caca63ebf2f28169216c82e696cfda)
- test gh-release [`c49b78d`](https://github.com/rudderlabs/rudder-sdk-js/commit/c49b78d708df2fd6c591b3ed5073595e113eb63e)
- release util changes [`7ad7bb0`](https://github.com/rudderlabs/rudder-sdk-js/commit/7ad7bb0699d66972ebe1c2d24dfc941058e31f64)
- update changelog and other utilities [`4aabcba`](https://github.com/rudderlabs/rudder-sdk-js/commit/4aabcbadd061011a55aed68dea40f306f2eac0b5)
- update dist files [`fab5f6b`](https://github.com/rudderlabs/rudder-sdk-js/commit/fab5f6b630017783fd9bbdbe5fc5b2b2d18433c3)

## 1.1.0-beta.0 - 2020-02-17

### Merged

- Develop [`#26`](https://github.com/rudderlabs/rudder-sdk-js/pull/26)
- Braze integration [`#25`](https://github.com/rudderlabs/rudder-sdk-js/pull/25)
- Dest intercom [`#23`](https://github.com/rudderlabs/rudder-sdk-js/pull/23)
- Replace console.log with logger.debug [`#20`](https://github.com/rudderlabs/rudder-sdk-js/pull/20)
- Update README.md [`#18`](https://github.com/rudderlabs/rudder-sdk-js/pull/18)
- Henry and Smith initial Changes [`#14`](https://github.com/rudderlabs/rudder-sdk-js/pull/14)
- Readme edits [`#17`](https://github.com/rudderlabs/rudder-sdk-js/pull/17)
- Feature/gtm [`#16`](https://github.com/rudderlabs/rudder-sdk-js/pull/16)
- VWO [`#15`](https://github.com/rudderlabs/rudder-sdk-js/pull/15)
- refactor structure [`#13`](https://github.com/rudderlabs/rudder-sdk-js/pull/13)
- Key change in GoogleAds [`#12`](https://github.com/rudderlabs/rudder-sdk-js/pull/12)
- Refactoring of integration initialization [`#11`](https://github.com/rudderlabs/rudder-sdk-js/pull/11)
- adding cookie support [`#10`](https://github.com/rudderlabs/rudder-sdk-js/pull/10)
- fix hubspot id [`#9`](https://github.com/rudderlabs/rudder-sdk-js/pull/9)
- fixes [`#8`](https://github.com/rudderlabs/rudder-sdk-js/pull/8)
- Fix : Hubspot [`#7`](https://github.com/rudderlabs/rudder-sdk-js/pull/7)
- Segment compatibility [`#6`](https://github.com/rudderlabs/rudder-sdk-js/pull/6)
- Namespace refactor [`#5`](https://github.com/rudderlabs/rudder-sdk-js/pull/5)
- GoogleAds integration [`#4`](https://github.com/rudderlabs/rudder-sdk-js/pull/4)
- Hotjar integration [`#3`](https://github.com/rudderlabs/rudder-sdk-js/pull/3)
- Replay events to integrations after successful initialization [`#2`](https://github.com/rudderlabs/rudder-sdk-js/pull/2)
- Update README.md [`#1`](https://github.com/rudderlabs/rudder-sdk-js/pull/1)

### Commits

- add utility modules [`f0ead88`](https://github.com/rudderlabs/rudder-sdk-js/commit/f0ead88e6debfe39ce6838c004c9a81c4d33dd14)
- update autotrack test files and other fixes [`a30e3ed`](https://github.com/rudderlabs/rudder-sdk-js/commit/a30e3ed5144f6f71625ae374f8b4339ea7544aa9)
- resolve conflicts [`bf2a9a4`](https://github.com/rudderlabs/rudder-sdk-js/commit/bf2a9a400c5b57314b70e3150fb077ee556f7cad)
- add val tracking list [`eb8c0e8`](https://github.com/rudderlabs/rudder-sdk-js/commit/eb8c0e86b3fcbbbe8c3f010c819acd6f9b45abff)
- adding support to test video destinations [`4cd09c0`](https://github.com/rudderlabs/rudder-sdk-js/commit/4cd09c0c70da5b3866d6681fc348f044bd90d299)
- logpurchase event handling [`993dcce`](https://github.com/rudderlabs/rudder-sdk-js/commit/993dcce115b716574d57d1f5ecaa572f4e17cd16)
- braze native integration TODO: logPurchase support [`019d745`](https://github.com/rudderlabs/rudder-sdk-js/commit/019d74593d40a527d48fbd1c5a7854c3263820be)
- sample form test [`634636e`](https://github.com/rudderlabs/rudder-sdk-js/commit/634636e1b5d8215eb48cdd95e5771cb84e163572)
- read el values [`7b1e56b`](https://github.com/rudderlabs/rudder-sdk-js/commit/7b1e56b4489e85c9010061ca0c1274aef219f69d)
- initial changes for comscore [`dd82c98`](https://github.com/rudderlabs/rudder-sdk-js/commit/dd82c98b66a0e051e6c54a4d4508e22e4ec52e00)
- fix undefined vars [`d476016`](https://github.com/rudderlabs/rudder-sdk-js/commit/d47601643085c93289feb8468bff26a2368f29f4)
- add error handling [`753b71c`](https://github.com/rudderlabs/rudder-sdk-js/commit/753b71ce29f01b9f530ee82bdf7b8efad851184a)
- init changes for flip-flop ready integration [`3154a25`](https://github.com/rudderlabs/rudder-sdk-js/commit/3154a25c880ed5242f756fefacfe68d4e862e232)
- add on-body dependency [`36b9c0c`](https://github.com/rudderlabs/rudder-sdk-js/commit/36b9c0c11f8ece0a5947e3a921058de1f7783691)
- init chartbeat integration [`3ab900d`](https://github.com/rudderlabs/rudder-sdk-js/commit/3ab900de5733ad2507f5cb623d3b28de40842ccf)
- output files and bugfix [`338fe10`](https://github.com/rudderlabs/rudder-sdk-js/commit/338fe10a59c019d55236c6173478f1713588763a)
- added customerio native sdk [`29bd7fb`](https://github.com/rudderlabs/rudder-sdk-js/commit/29bd7fb8681e34e749319237b6033cdfe1131df5)
- refactor [`7158ff7`](https://github.com/rudderlabs/rudder-sdk-js/commit/7158ff72808b01130870cdc4e137dbb051a34e33)
- working version [`8046190`](https://github.com/rudderlabs/rudder-sdk-js/commit/80461908fd2b93cdf1fc2d94d705f7aa96b1b641)
- fix: intercom not loading [`6688293`](https://github.com/rudderlabs/rudder-sdk-js/commit/66882932271f0f26930e385cc71cc47b52cacd8b)
- replace variable [`d18a7f0`](https://github.com/rudderlabs/rudder-sdk-js/commit/d18a7f0a5811b7e4a8ca1795a679500677c5d0e2)
- intercom js sdk v0 [`d6fbfaf`](https://github.com/rudderlabs/rudder-sdk-js/commit/d6fbfafd11a6aaa3a02612e088b7efd85d6c08f1)
- update comment [`9dd15ea`](https://github.com/rudderlabs/rudder-sdk-js/commit/9dd15eaeff14626f06a23814833211986b5ef945)
- add helper modules and utilities [`875162f`](https://github.com/rudderlabs/rudder-sdk-js/commit/875162f227fabe557235d5a0185d27c3a6831a26)
- add to integrations [`ae98f8e`](https://github.com/rudderlabs/rudder-sdk-js/commit/ae98f8e987ab746abc337ce07105e5451f29d73e)
- add kissmetrics integration [`afdc0d9`](https://github.com/rudderlabs/rudder-sdk-js/commit/afdc0d9cd331c90fc99da3ca54b69cbee49730d6)
- updated output files [`11e6a51`](https://github.com/rudderlabs/rudder-sdk-js/commit/11e6a518d8233c8bcf12b8386bde4d462532c19c)
- changed key in identify [`fbf0d65`](https://github.com/rudderlabs/rudder-sdk-js/commit/fbf0d65198d404a02f56c9044a0405828c05036f)
- changed name of page event [`740fe9c`](https://github.com/rudderlabs/rudder-sdk-js/commit/740fe9ce699115c7c82b96d55e76e567ef06f318)
- added output files [`2cd5a83`](https://github.com/rudderlabs/rudder-sdk-js/commit/2cd5a835057fa299e69a38542a808b0a78c4fb7b)
- code cleanup [`b7f05d8`](https://github.com/rudderlabs/rudder-sdk-js/commit/b7f05d8bf1dd90dc59fddf51b82cb7251f39ecb0)
- Keen JS integration [`18b9d0f`](https://github.com/rudderlabs/rudder-sdk-js/commit/18b9d0fd546161da04f422e05589917eb5db3059)
- resolve conflicts and remove lock file [`e903d32`](https://github.com/rudderlabs/rudder-sdk-js/commit/e903d328d9d1372e2a237f198cf165404c5fa368)
- Fix bug with multiple native destinations. [`15de0dd`](https://github.com/rudderlabs/rudder-sdk-js/commit/15de0dd30eb4dec0bb41dd16854420f094b6582c)
- update dist files [`3ac13e5`](https://github.com/rudderlabs/rudder-sdk-js/commit/3ac13e54ead5f816faf46efa782bedff17412e60)
- update dist files [`f2d648f`](https://github.com/rudderlabs/rudder-sdk-js/commit/f2d648f92ded2bde4f5a3e170e71d1253aa8003b)
- add GTM native integration [`f0b8f60`](https://github.com/rudderlabs/rudder-sdk-js/commit/f0b8f604227def5042f91d863e6d254d1c3a7df1)
- changed logic [`adeae50`](https://github.com/rudderlabs/rudder-sdk-js/commit/adeae5088e0ff6f55f12607d9892435b5265993d)
- Merge branches 'refactor' and 'master' of github.com:rudderlabs/rudder-sdk-js into refactor [`42394f5`](https://github.com/rudderlabs/rudder-sdk-js/commit/42394f51b6678e753da550dbe700337df53729ee)
- exposed api for anonymous id [`2ceeed6`](https://github.com/rudderlabs/rudder-sdk-js/commit/2ceeed614862614171c30a4d9075d95aa25edd65)
- serve file via server [`2afca4e`](https://github.com/rudderlabs/rudder-sdk-js/commit/2afca4e1204355c4906167dfb8ce5e37ec3b118e)
- added test files [`fdc0f18`](https://github.com/rudderlabs/rudder-sdk-js/commit/fdc0f186b8e378fac947b18d2616d635f06b9df4)
- key change [`046d612`](https://github.com/rudderlabs/rudder-sdk-js/commit/046d612d47fbb54dc6845ffd6a17d9dedc2f0c84)
- update dist [`0522c38`](https://github.com/rudderlabs/rudder-sdk-js/commit/0522c383e4c5a18e1a04a0f4992eb30394a5cc61)
- refactoring of integration initialization [`1c13d0a`](https://github.com/rudderlabs/rudder-sdk-js/commit/1c13d0a0ae51d6a399ccd7c2505e262669c2dab4)
- fixing min [`adb5931`](https://github.com/rudderlabs/rudder-sdk-js/commit/adb5931a401b0dac3973e402a9c18253e4f05b79)
- update dist file [`b39ab6e`](https://github.com/rudderlabs/rudder-sdk-js/commit/b39ab6ebdb03910123c9f077bf2d8265f1605e9a)
- change version [`4d47173`](https://github.com/rudderlabs/rudder-sdk-js/commit/4d47173c4a437426f1f33077283a19a1bcc2bb37)
- change version [`9f14d8b`](https://github.com/rudderlabs/rudder-sdk-js/commit/9f14d8b0426462010e4c5780b8349f8374f0e05d)
- add dist files [`d4c0ca3`](https://github.com/rudderlabs/rudder-sdk-js/commit/d4c0ca37830801e3a3aca92550a7209d4bf179c1)
- addin cookie support [`80adbb4`](https://github.com/rudderlabs/rudder-sdk-js/commit/80adbb4de832047313043351447565afc2251e9b)
- updated output files [`514623c`](https://github.com/rudderlabs/rudder-sdk-js/commit/514623ce0d58ae80de97ab4c5d899547b7ca1684)
- changing name to be uploaded to cdn [`26b2bcb`](https://github.com/rudderlabs/rudder-sdk-js/commit/26b2bcbca75c51aea12506ffc399336d146af77a)
- adding v1 to url [`3000f62`](https://github.com/rudderlabs/rudder-sdk-js/commit/3000f6291ed282461733280f710bce2836417b08)
- code clean up and logger [`306047c`](https://github.com/rudderlabs/rudder-sdk-js/commit/306047cbf23818d15800460a61a1d55887e99b67)
- initial work for autotrack [`95c98fe`](https://github.com/rudderlabs/rudder-sdk-js/commit/95c98fe1f8a303d2f4e7c3887118c0471821217a)
- updated output files [`a1b30fd`](https://github.com/rudderlabs/rudder-sdk-js/commit/a1b30fd15582f13774531913f6a746f9f49eb0ff)
- updated version [`1542b3b`](https://github.com/rudderlabs/rudder-sdk-js/commit/1542b3ba99b0a1b56342819ee258c248166784ae)
- changes for timestamp [`d71583d`](https://github.com/rudderlabs/rudder-sdk-js/commit/d71583d16fedee94e99ca11c213e530c8cd17a90)
- value also a key for revenue [`c99020d`](https://github.com/rudderlabs/rudder-sdk-js/commit/c99020df2283d92a0c8bd016f1d8efd4d06ee068)
- obfuscate output file [`b7289c8`](https://github.com/rudderlabs/rudder-sdk-js/commit/b7289c8ba97eb3991462bf7373d0fad52776a544)
- add obfuscate plugin [`06a9030`](https://github.com/rudderlabs/rudder-sdk-js/commit/06a90309f3a3e73ca9b1f7b1f7bb6d9ac2982b3a)
- added anonymous id in storage [`f92b227`](https://github.com/rudderlabs/rudder-sdk-js/commit/f92b2271c53f1c91c26bff209f2cb73f8c11a268)
- change in error handling [`d208b33`](https://github.com/rudderlabs/rudder-sdk-js/commit/d208b33705c7750251de1526ebb31db3e8ad1aa8)
- generate different output files based on condition [`2fd7119`](https://github.com/rudderlabs/rudder-sdk-js/commit/2fd7119c9f09320752431c6753954b84f3010a4b)
- add sentat and originalTimestamp [`d702578`](https://github.com/rudderlabs/rudder-sdk-js/commit/d702578339e058d840aea927efc951bd5e495fd7)
- change in method param in load [`793f7ca`](https://github.com/rudderlabs/rudder-sdk-js/commit/793f7ca4f59849c2792cf371513fde4afaaa593c)
- implemented logutil [`4fee349`](https://github.com/rudderlabs/rudder-sdk-js/commit/4fee349c29aea8d25deda576cc0ba153cf9d2d5c)
- adding localstorage-retry module functionality [`3ea6a92`](https://github.com/rudderlabs/rudder-sdk-js/commit/3ea6a92510d1ad6989f0a9a23b20cee1d1acd66f)
- add or replace traits properties instead of replacing the complete object [`a911bf3`](https://github.com/rudderlabs/rudder-sdk-js/commit/a911bf399517f428d8f9cc1a25cb5a695ebefd35)
- Updated version. [`c621113`](https://github.com/rudderlabs/rudder-sdk-js/commit/c621113d6206673cbb494882c4125a3ae1c8c6d5)
- Updated version of js. [`1ed67fe`](https://github.com/rudderlabs/rudder-sdk-js/commit/1ed67fe55c54f340a5835cb9c35b1c90812d535a)
- namespace refactor [`c6d580a`](https://github.com/rudderlabs/rudder-sdk-js/commit/c6d580a37a932a3c1362225f99491697758b5e91)
- Updated README.md [`b31b814`](https://github.com/rudderlabs/rudder-sdk-js/commit/b31b814010c082f6b3dcfcc08f7542d6ca21cdfa)
- updated version [`42a5012`](https://github.com/rudderlabs/rudder-sdk-js/commit/42a5012fc732ac02ad9e73b6badd4768fcff3c38)
- updated ReadMe [`4ae963a`](https://github.com/rudderlabs/rudder-sdk-js/commit/4ae963a14ea0224ac7f30a3d0a145dcf78339561)
- updated ReadMe [`092b02a`](https://github.com/rudderlabs/rudder-sdk-js/commit/092b02a576075ce0a31151c97e332b606ab2058a)
- updated ReadMe [`81e344f`](https://github.com/rudderlabs/rudder-sdk-js/commit/81e344f72de1a2b3b27665562cfb332ab9138923)
- auto page tracking [`572cd54`](https://github.com/rudderlabs/rudder-sdk-js/commit/572cd54be7143c60e48803093b9b9e3954c7b067)
- updated readme [`823d272`](https://github.com/rudderlabs/rudder-sdk-js/commit/823d2729b5d954f861773683c4feaf57e608d1a8)
- updated output files [`cefabe9`](https://github.com/rudderlabs/rudder-sdk-js/commit/cefabe97024dc802581815eb9ca17c9106cd9185)
- Create LICENSE [`2ad4c11`](https://github.com/rudderlabs/rudder-sdk-js/commit/2ad4c1107bf64aa395e693506787b0930315a70a)
- updated version and output files [`29f8d38`](https://github.com/rudderlabs/rudder-sdk-js/commit/29f8d389d5cb5c5a44b64cbbb9abb6ef939f5272)
- revert hard coded initialization of hotjar [`06686b4`](https://github.com/rudderlabs/rudder-sdk-js/commit/06686b4d677d8580fa71fc09ad620d8233e08ff5)
- hotjar integration initial commit [`a0155d7`](https://github.com/rudderlabs/rudder-sdk-js/commit/a0155d7ad6d932da7d9e1df527da9c43d29b7626)
- reverting rollup config [`893067f`](https://github.com/rudderlabs/rudder-sdk-js/commit/893067f9b9a3f751ae75e512eff6903bf1359158)
- replay events to sdks after successful intialization [`4712add`](https://github.com/rudderlabs/rudder-sdk-js/commit/4712add2a88bd178827a91c6d503d9d4fb27af4f)
- error handling [`00672ac`](https://github.com/rudderlabs/rudder-sdk-js/commit/00672ac9337aa04029c634794443ab373880d414)
- moving readme to root [`cb00657`](https://github.com/rudderlabs/rudder-sdk-js/commit/cb00657431a3ea7456d99c78cda9781c720c1489)
- browser code was overwritten by node [`5a35d10`](https://github.com/rudderlabs/rudder-sdk-js/commit/5a35d1011e1e2951b5f92b44d97c5268d16a9a39)
- adding writekey auth header and make the test changes [`3435c63`](https://github.com/rudderlabs/rudder-sdk-js/commit/3435c638cf7803d3ba4b38f63fd36020c038670b)
- remove old files and add gitignore [`c5b7fee`](https://github.com/rudderlabs/rudder-sdk-js/commit/c5b7feeced21cb2b7dbbf3edea899d02b98ad2cc)
- pushing to cdn and tests changes [`ada55b6`](https://github.com/rudderlabs/rudder-sdk-js/commit/ada55b63d41c6bc9e660d31fa0bf0d2cd9d8965b)
- updated test files [`1ba3151`](https://github.com/rudderlabs/rudder-sdk-js/commit/1ba3151ab8d2bdc9d2ca8923082536cca7b491d6)
- first commit [`be40257`](https://github.com/rudderlabs/rudder-sdk-js/commit/be4025745951d3142570be326e2532feb616f52b)
- remove formatting [`2fd3b19`](https://github.com/rudderlabs/rudder-sdk-js/commit/2fd3b1992b6a6376419ee7a0d296f61413f8964f)
- code specific readme [`a88d264`](https://github.com/rudderlabs/rudder-sdk-js/commit/a88d2646215fa375647e641b382affafa7ed50bb)
- updated test htmls [`3d0441e`](https://github.com/rudderlabs/rudder-sdk-js/commit/3d0441e829350a3be0361987ac971a250b4bb147)
- removed some logs [`67166b4`](https://github.com/rudderlabs/rudder-sdk-js/commit/67166b4c6b330dba10c21761b40783ad11d48be7)
- support for providing server url in load [`6bdee49`](https://github.com/rudderlabs/rudder-sdk-js/commit/6bdee49e62bf0c9b0e58bcf8a95464a7aa8a7156)
- first try with stackedit [`091cc0a`](https://github.com/rudderlabs/rudder-sdk-js/commit/091cc0a6ed7513ba4e41d75a2e4e8e2dce274fa4)
- add btoa for node [`8976266`](https://github.com/rudderlabs/rudder-sdk-js/commit/8976266b7bc331b6c265c63e426334cca270c992)
- conditional require, won't be used by rollup for iife [`4052ad0`](https://github.com/rudderlabs/rudder-sdk-js/commit/4052ad00822125a2f999e7546495120bfe9f20e5)
- added test browser [`f60cfbf`](https://github.com/rudderlabs/rudder-sdk-js/commit/f60cfbfbb23c153bd35aadc8aacad030ee232a4d)
- handled options parameter [`b03c131`](https://github.com/rudderlabs/rudder-sdk-js/commit/b03c131d5805360c896754753ece3ac890e39b47)
- add sentAt at msg level and use originalTimestamp instead of timestamp [`85176c3`](https://github.com/rudderlabs/rudder-sdk-js/commit/85176c358b8657add51467a461dba5cb898a4e09)
- replace only the null or undefined value in payload [`9819390`](https://github.com/rudderlabs/rudder-sdk-js/commit/981939039bc016923c922615e04d78d7885f66a6)
- added support for accepting destinationoptions from sdk and some refactoring [`f37a6ad`](https://github.com/rudderlabs/rudder-sdk-js/commit/f37a6ad8832e8d0550489925c5ffb4335eeb57ba)
- update keys with camelCase and timestamp refactoring. [`db451ce`](https://github.com/rudderlabs/rudder-sdk-js/commit/db451ce53bc12f5ac7caad1da627e95df0bfa070)
- changes for incorporation of accessing BE config with basic auth [`917a28e`](https://github.com/rudderlabs/rudder-sdk-js/commit/917a28e07d0b93035da1f931022cc837f292f99a)
- refactored code [`256f5a8`](https://github.com/rudderlabs/rudder-sdk-js/commit/256f5a8c4e9a122f8f05bf762d0273573786f852)
- add javascript sdk for GA [`caecd43`](https://github.com/rudderlabs/rudder-sdk-js/commit/caecd43d9087bc5204cd02ddd3116640809207b4)
- 1. Add GA node code( initial commit ) [`e3fb321`](https://github.com/rudderlabs/rudder-sdk-js/commit/e3fb321e8d0385b6527ff2544b33b0b579ce7e0a)
- removed hard coded hubId [`eb9f3e4`](https://github.com/rudderlabs/rudder-sdk-js/commit/eb9f3e4eaaac99092beb1d96628c6caaf029d38b)
- updated method name [`68bdcfe`](https://github.com/rudderlabs/rudder-sdk-js/commit/68bdcfe06af4a62371b3c360266ad736952e6582)
- code review comment incorporation [`3a808ac`](https://github.com/rudderlabs/rudder-sdk-js/commit/3a808ac5ecda31e494ed9c3ce34e0223bc7cf53a)
- adding jsdoc and other refactoring [`b3b1c34`](https://github.com/rudderlabs/rudder-sdk-js/commit/b3b1c3405337bc6d72bdb3a1ea832cfe06e50408)
- implement review comments [`bc0cd75`](https://github.com/rudderlabs/rudder-sdk-js/commit/bc0cd7535befe5641c2a9432c4836c0498d47565)
- exported new api for builder pattern [`52034e2`](https://github.com/rudderlabs/rudder-sdk-js/commit/52034e22a80d9e319241cab07af2b2d7c712fdbb)
- code review comments incorporation and separate api for call with rudderElementBuilder [`89155bb`](https://github.com/rudderlabs/rudder-sdk-js/commit/89155bb43205d5921f011901b4e3f487eb6bf316)
- remove unused variable [`2526118`](https://github.com/rudderlabs/rudder-sdk-js/commit/2526118ff180f2dd69e9d823c70b6ba70ed5d844)
- implementing review comments. [`f92fce1`](https://github.com/rudderlabs/rudder-sdk-js/commit/f92fce1fd07148c0383f7a091cbfb179b377b1d8)
- keeping the tests in sink [`f3096fd`](https://github.com/rudderlabs/rudder-sdk-js/commit/f3096fd6d21eefadeb8034db9addea705c280242)
- adding xmlhttp as external and other changes [`dc0a3e1`](https://github.com/rudderlabs/rudder-sdk-js/commit/dc0a3e1083979d39ab3dc5fa08ba5aeab15caa8b)
- exported builder from analytics.js [`61a59fa`](https://github.com/rudderlabs/rudder-sdk-js/commit/61a59fa0653f091bf94f79166d1c450d5de7df8a)
- example of builder pattern added [`0e2fe29`](https://github.com/rudderlabs/rudder-sdk-js/commit/0e2fe295d7f227e92ad1f6f1d8b67e54f3defe59)
- node for hubspot [`ddcf775`](https://github.com/rudderlabs/rudder-sdk-js/commit/ddcf775ecc9c2a6e9545846b329984c0ab6f7e7a)
- moving utils into sub-dir and adding build-script [`f3db335`](https://github.com/rudderlabs/rudder-sdk-js/commit/f3db335ef3e3d4943223938d0dfdb09c3d398aac)
- adding terser for es6 uglify [`8f48269`](https://github.com/rudderlabs/rudder-sdk-js/commit/8f482694f9f8e6c95feb4472fc12f3866bcafaa9)
- refactoring structure [`568fbea`](https://github.com/rudderlabs/rudder-sdk-js/commit/568fbeaf5157c0b8f95f1d4af9b703c861370285)
- checking structure change [`1fb6f63`](https://github.com/rudderlabs/rudder-sdk-js/commit/1fb6f6329b099865afa4964b27ea1017e3860725)
- handle storage calls [`2f19bff`](https://github.com/rudderlabs/rudder-sdk-js/commit/2f19bff04a039fbef3a032d649cb3a28d5293bcb)
- adding storage to persist user_id and traits, replacing rl_message key and rl_ [`6de3c16`](https://github.com/rudderlabs/rudder-sdk-js/commit/6de3c162e9343cffae38922205e3fb8176bcdf2e)
- updating test scenarios [`bc0f3ab`](https://github.com/rudderlabs/rudder-sdk-js/commit/bc0f3ab777d14b9b1e266add9aa3f156bdf4c863)
- demo prep [`a06d4a5`](https://github.com/rudderlabs/rudder-sdk-js/commit/a06d4a51873fd3a6e40570664c74e72f8edd5f26)
- integrated identify call [`e6ca854`](https://github.com/rudderlabs/rudder-sdk-js/commit/e6ca854dffec73c278c07b763bd8957c0cd3691a)
- added var args support in track [`8a1efe7`](https://github.com/rudderlabs/rudder-sdk-js/commit/8a1efe78195295f169bb486bc1350df2afa2f9b9)
- fixed error [`9688354`](https://github.com/rudderlabs/rudder-sdk-js/commit/968835432064f835ba9c52bacd54c477e2954042)
- added var args support in page [`d7ff6cc`](https://github.com/rudderlabs/rudder-sdk-js/commit/d7ff6cc6ed2d5448cc244426fae7fc7640c34cda)
- updated test html [`070ad93`](https://github.com/rudderlabs/rudder-sdk-js/commit/070ad933c68890d04aa09fa6e6d426666b95c7a0)
- test [`bb0254c`](https://github.com/rudderlabs/rudder-sdk-js/commit/bb0254cf0030c3312280332d3ff7fe31edf64367)
- modified test html [`3dbde54`](https://github.com/rudderlabs/rudder-sdk-js/commit/3dbde54642947cd7598f4ec92d37e48b2009784c)
- change to publish [`6edf69f`](https://github.com/rudderlabs/rudder-sdk-js/commit/6edf69f8a25410d5a325b2ceff746a85a053df5c)
- call with rudder element [`9aeeadd`](https://github.com/rudderlabs/rudder-sdk-js/commit/9aeeadd6f15d8936c5001a153d40950f9995a49d)
- changes for replay [`a459a61`](https://github.com/rudderlabs/rudder-sdk-js/commit/a459a61ecd9f8a0804023c89ded212482684b08f)
- imported event repository and config [`ef6f139`](https://github.com/rudderlabs/rudder-sdk-js/commit/ef6f13924f166546f5a24264487459521a3804d7)
- Rudder analytics [`28a63f5`](https://github.com/rudderlabs/rudder-sdk-js/commit/28a63f502caa5f9f54da59b29a1addad70bd9c43)
- adding integration prototype and a sample angular app to test [`bd9db6c`](https://github.com/rudderlabs/rudder-sdk-js/commit/bd9db6c6bc6900d01f51fd626d34e373553549c8)
- adding browser flag [`81f751e`](https://github.com/rudderlabs/rudder-sdk-js/commit/81f751e6c3bed92bd21b811de46b8248e82d6941)
- change in test files [`06f2973`](https://github.com/rudderlabs/rudder-sdk-js/commit/06f2973049cf26565a48e5d1506f183982d38a39)
- testing rollup [`7e03cdc`](https://github.com/rudderlabs/rudder-sdk-js/commit/7e03cdc51199534a05bafb74d68a38792f19e71b)
- miscelleneous changes [`967ff3e`](https://github.com/rudderlabs/rudder-sdk-js/commit/967ff3ef2f811af67497ad62b783340cc7a8e53f)
- updated imports [`2ca4bad`](https://github.com/rudderlabs/rudder-sdk-js/commit/2ca4bad6b7f4804e53f3e3394f35a7155d614f38)
- add babel and rollup [`071de37`](https://github.com/rudderlabs/rudder-sdk-js/commit/071de378cc0ae3555a9f8593cf5c3478a7e95405)
- modify to support import/export [`c08feab`](https://github.com/rudderlabs/rudder-sdk-js/commit/c08feabcb2b8f3adfcb5257258d81c7c8a529fd7)
- corrected imports [`6776b94`](https://github.com/rudderlabs/rudder-sdk-js/commit/6776b94325207908245850478774c54c3383ed60)
- separating modules from RudderClient [`2fd5e00`](https://github.com/rudderlabs/rudder-sdk-js/commit/2fd5e006e3b494c39b065e9e4aa41442cc36fb98)
- separating modules from rudder client [`6a4eba5`](https://github.com/rudderlabs/rudder-sdk-js/commit/6a4eba5a4c48116f066aa04f304c908a984f3c63)
- moving out code [`8c61a8b`](https://github.com/rudderlabs/rudder-sdk-js/commit/8c61a8b000e5e634260f4b10ba49b11e50ef0f6f)
- initial commit to move the code into blocks [`85895d5`](https://github.com/rudderlabs/rudder-sdk-js/commit/85895d5e31620045844433a87427d2b93650b2c9)
- initial changes for testing [`42a53e7`](https://github.com/rudderlabs/rudder-sdk-js/commit/42a53e7f9fd98eba2504c465d45ac179ccd753e9)
- intermediary changes for eslint and browserify [`478d0d8`](https://github.com/rudderlabs/rudder-sdk-js/commit/478d0d8615853c2d5b3d73d139ad8c124487df26)
- checking in eslint [`36cdd39`](https://github.com/rudderlabs/rudder-sdk-js/commit/36cdd399ee93d3ce97e62f49824c9a8ff9cda1c1)
- Hubspot sdk implementation [`48d4d8e`](https://github.com/rudderlabs/rudder-sdk-js/commit/48d4d8e9e93961853954c0c596f13448529a9f00)
- interim checkin for HubSpot integration [`8fc34c9`](https://github.com/rudderlabs/rudder-sdk-js/commit/8fc34c9d40336fa6c9da75bda2c0038f427dcebd)
- start interim checkin related to addition of support for destination provider SDK [`11ee070`](https://github.com/rudderlabs/rudder-sdk-js/commit/11ee070a37aedd8cea85c1fcfbd792dbc6c791a3)
- few more lint and undef resolve [`fdd7b7c`](https://github.com/rudderlabs/rudder-sdk-js/commit/fdd7b7c9f19559e363b44081167edac38e459f80)
- Formatting change [`b2d0ee0`](https://github.com/rudderlabs/rudder-sdk-js/commit/b2d0ee0eaf97f2173e4641fd445398e992895949)
- final development checkin [`4685843`](https://github.com/rudderlabs/rudder-sdk-js/commit/468584379b2d638d3ea091464f3e16247cd8d0fc)
- interim checkin [`4b7a0d8`](https://github.com/rudderlabs/rudder-sdk-js/commit/4b7a0d8eab6488066cc46c2c4a868f5c3390d2a5)
- interim checkin [`9500fa0`](https://github.com/rudderlabs/rudder-sdk-js/commit/9500fa00ef587fd42e33f24d0afc8946daf77069)
- interim checkin [`9b1b303`](https://github.com/rudderlabs/rudder-sdk-js/commit/9b1b3034ca4a071e0643390e4bc03aca628e1a33)
- interim checkin [`667ec9d`](https://github.com/rudderlabs/rudder-sdk-js/commit/667ec9de285cb4939c02076a153c1f6bb734d89c)
- interim checkin [`33b030a`](https://github.com/rudderlabs/rudder-sdk-js/commit/33b030a2d1c8ebe6a95242eefdf5214246f6bf40)
- interim checkin [`908a501`](https://github.com/rudderlabs/rudder-sdk-js/commit/908a501d264ae8913720605ef0dad0ea14f8d1b1)
- interim checkin [`6afedd0`](https://github.com/rudderlabs/rudder-sdk-js/commit/6afedd0fc06bffe39d0bb4f38ab5f3ea1020cd35)
- interim checkin [`4b2a99e`](https://github.com/rudderlabs/rudder-sdk-js/commit/4b2a99e83f4a2db3ad35c380c4b5a0ab366121ea)
- refactored for OOP; regular development checkin [`72e540c`](https://github.com/rudderlabs/rudder-sdk-js/commit/72e540c06cf1ce6b3120c3c807f26d3e053e29aa)
- interim checkin [`0ae0fbb`](https://github.com/rudderlabs/rudder-sdk-js/commit/0ae0fbb4a4b58b4fdf0eeaed0f0566c9a07d7b25)
- interim checkin [`bc1a51d`](https://github.com/rudderlabs/rudder-sdk-js/commit/bc1a51de2d1e03894b1cf0d2b8df0200fd97c0f4)
- interim checkin [`daddc31`](https://github.com/rudderlabs/rudder-sdk-js/commit/daddc316cf4845a8d1b9c29018bbc18374aed97f)
- interim checkin [`4a140f0`](https://github.com/rudderlabs/rudder-sdk-js/commit/4a140f039237465639ddc58d96fd77d995fd85f7)
- interim checkin [`2530250`](https://github.com/rudderlabs/rudder-sdk-js/commit/25302504d734b582a20e1c49fc5650c676d0b929)
- interim checkin [`12703c2`](https://github.com/rudderlabs/rudder-sdk-js/commit/12703c2a70edc90e9813454c2a395ac91b5f2e62)
- interim checkin [`bd214f7`](https://github.com/rudderlabs/rudder-sdk-js/commit/bd214f7a841f22bb3cca9c99ad5f615a15e20dee)
- renamed RudderAnalyticsClient to RudderClient in alignment with other SDKs [`8a50244`](https://github.com/rudderlabs/rudder-sdk-js/commit/8a50244345a1ee853fe71f542750715569482918)
- renamed RudderAnalyticsClient to RudderClient in alignment with other SDKs [`38d22eb`](https://github.com/rudderlabs/rudder-sdk-js/commit/38d22eb937c23a5f7d9a56b7a6b97698ded63295)
- interim checkin [`9e1049b`](https://github.com/rudderlabs/rudder-sdk-js/commit/9e1049b629be982a6cfa43d8e65928044b7180b6)
- interim checkin [`0d74446`](https://github.com/rudderlabs/rudder-sdk-js/commit/0d744469d633a77f8f77f021fa1229440cb773ac)
- interim checkin for JavaScript SDK [`992d1ed`](https://github.com/rudderlabs/rudder-sdk-js/commit/992d1ed19205a1123bf3562cff707724f7d0fa0e)
- interim checkin for minified JS [`77990d2`](https://github.com/rudderlabs/rudder-sdk-js/commit/77990d2971673bf8461faf566d7f8ae19c9e3652)
- interim checkin for Javascript SDK [`c748661`](https://github.com/rudderlabs/rudder-sdk-js/commit/c74866134ad022f2813ba1dfc81a42c6e695a7f9)
- JavaScript SDK started [`e8c440a`](https://github.com/rudderlabs/rudder-sdk-js/commit/e8c440a2a2dd1be57262b85aa7a9e11fafd58589)

## [v1.0.15](https://github.com/rudderlabs/rudder-sdk-js/compare/1.1.1...v1.0.15) - 2021-02-08

### Merged

- Master &lt;-- from Production branches [`#205`](https://github.com/rudderlabs/rudder-sdk-js/pull/205)
- Production &lt;-- staging [`#203`](https://github.com/rudderlabs/rudder-sdk-js/pull/203)
- improve logs [`#204`](https://github.com/rudderlabs/rudder-sdk-js/pull/204)
- Browser extension support [`#191`](https://github.com/rudderlabs/rudder-sdk-js/pull/191)
- PostHog integration [`#200`](https://github.com/rudderlabs/rudder-sdk-js/pull/200)
- Fix: Querystring api [`#197`](https://github.com/rudderlabs/rudder-sdk-js/pull/197)
- Production merge [`#195`](https://github.com/rudderlabs/rudder-sdk-js/pull/195)
- Production -&gt; master [`#183`](https://github.com/rudderlabs/rudder-sdk-js/pull/183)
- AM linker [`#194`](https://github.com/rudderlabs/rudder-sdk-js/pull/194)
- Amp linker [`#193`](https://github.com/rudderlabs/rudder-sdk-js/pull/193)
- Adding Support for AMP Linker [`#189`](https://github.com/rudderlabs/rudder-sdk-js/pull/189)
- product is not defined [`#190`](https://github.com/rudderlabs/rudder-sdk-js/pull/190)
- product is not defined [`#187`](https://github.com/rudderlabs/rudder-sdk-js/pull/187)
- Production &lt;-- staging [`#185`](https://github.com/rudderlabs/rudder-sdk-js/pull/185)
- add lowercase check [`#186`](https://github.com/rudderlabs/rudder-sdk-js/pull/186)
- Reserved keys [`#184`](https://github.com/rudderlabs/rudder-sdk-js/pull/184)
- Production &lt;- staging [`#182`](https://github.com/rudderlabs/rudder-sdk-js/pull/182)
- Appcues Web SDK [`#176`](https://github.com/rudderlabs/rudder-sdk-js/pull/176)
- Production &lt;--  Staging [`#174`](https://github.com/rudderlabs/rudder-sdk-js/pull/174)
- GA4 Bug fixes- page view will not trigger with identify call when blockPageView flag is true. [`#180`](https://github.com/rudderlabs/rudder-sdk-js/pull/180)
- GA4 Bug fixes- flattening track call json payload [`#179`](https://github.com/rudderlabs/rudder-sdk-js/pull/179)
- GA4 Bug fixes- added logic of sendUserId in init function when script… [`#178`](https://github.com/rudderlabs/rudder-sdk-js/pull/178)
- GA4 Bug fixes [`#177`](https://github.com/rudderlabs/rudder-sdk-js/pull/177)
- Update README.md [`#172`](https://github.com/rudderlabs/rudder-sdk-js/pull/172)
- add files from staging for Pendo release [`#175`](https://github.com/rudderlabs/rudder-sdk-js/pull/175)
- Ga4/prod [`#173`](https://github.com/rudderlabs/rudder-sdk-js/pull/173)
- Update README.md [`#170`](https://github.com/rudderlabs/rudder-sdk-js/pull/170)
- add intg name [`#168`](https://github.com/rudderlabs/rudder-sdk-js/pull/168)
- Am name staging [`#169`](https://github.com/rudderlabs/rudder-sdk-js/pull/169)
- pendo-sdk/commit for staging branch [`#167`](https://github.com/rudderlabs/rudder-sdk-js/pull/167)
- added lytics destination [`#165`](https://github.com/rudderlabs/rudder-sdk-js/pull/165)
- Amplitude - added version name [`#162`](https://github.com/rudderlabs/rudder-sdk-js/pull/162)
- Added revenue_type key [`#161`](https://github.com/rudderlabs/rudder-sdk-js/pull/161)
- Amplitude [`#160`](https://github.com/rudderlabs/rudder-sdk-js/pull/160)
- Amplitude - code refactoring and test file add [`#159`](https://github.com/rudderlabs/rudder-sdk-js/pull/159)
- Amplitude - Code refactoring [`#158`](https://github.com/rudderlabs/rudder-sdk-js/pull/158)
- Prod(cdn and npm) to master [`#155`](https://github.com/rudderlabs/rudder-sdk-js/pull/155)
- Amplitude [`#156`](https://github.com/rudderlabs/rudder-sdk-js/pull/156)
- added for moengage and tested [`#153`](https://github.com/rudderlabs/rudder-sdk-js/pull/153)
- Update README.md [`#150`](https://github.com/rudderlabs/rudder-sdk-js/pull/150)
- add check for options [`#151`](https://github.com/rudderlabs/rudder-sdk-js/pull/151)
- merge campaign and configurable queue [`#148`](https://github.com/rudderlabs/rudder-sdk-js/pull/148)
- Prod rebase [`#141`](https://github.com/rudderlabs/rudder-sdk-js/pull/141)
- Ga name tracker ---&gt; Production [`#139`](https://github.com/rudderlabs/rudder-sdk-js/pull/139)
- add visualizer [`#133`](https://github.com/rudderlabs/rudder-sdk-js/pull/133)
- TVSquared destination [`#134`](https://github.com/rudderlabs/rudder-sdk-js/pull/134)
- Merge prods ---&gt; master [`#132`](https://github.com/rudderlabs/rudder-sdk-js/pull/132)
- add query parse logic from url and send events ---&gt; Production [`#128`](https://github.com/rudderlabs/rudder-sdk-js/pull/128)
- Fix: page properties [`#122`](https://github.com/rudderlabs/rudder-sdk-js/pull/122)
- Update README.md [`#121`](https://github.com/rudderlabs/rudder-sdk-js/pull/121)
- copy changes from fullstory branch [`#116`](https://github.com/rudderlabs/rudder-sdk-js/pull/116)
- added bugsnag destination [`#114`](https://github.com/rudderlabs/rudder-sdk-js/pull/114)
- added https in scriptload for VWO,kissmetrics,chartbeat [`#112`](https://github.com/rudderlabs/rudder-sdk-js/pull/112)
- Revert "added https in scriptload for VWO,kissmetrics,chartbeat" [`#111`](https://github.com/rudderlabs/rudder-sdk-js/pull/111)
- Fix: Group traits after reset [`#110`](https://github.com/rudderlabs/rudder-sdk-js/pull/110)
- added https in scriptload for VWO,kissmetrics,chartbeat [`#108`](https://github.com/rudderlabs/rudder-sdk-js/pull/108)
- addressed issue related to script loading for cordova [`#107`](https://github.com/rudderlabs/rudder-sdk-js/pull/107)
- Optimizely Web [`#109`](https://github.com/rudderlabs/rudder-sdk-js/pull/109)
- Encrypt values [`#105`](https://github.com/rudderlabs/rudder-sdk-js/pull/105)
- Encrypt values [`#101`](https://github.com/rudderlabs/rudder-sdk-js/pull/101)
- Error handling if rudderanalytics is not initialized in script [`#104`](https://github.com/rudderlabs/rudder-sdk-js/pull/104)
- Send the events to server/destination that are made only after load call [`#102`](https://github.com/rudderlabs/rudder-sdk-js/pull/102)
- Missing writekey [`#100`](https://github.com/rudderlabs/rudder-sdk-js/pull/100)
- Master &lt;-- Production [`#99`](https://github.com/rudderlabs/rudder-sdk-js/pull/99)
- Production &lt;- Develop [`#98`](https://github.com/rudderlabs/rudder-sdk-js/pull/98)
- Changes for not tracking sensitive data [`#96`](https://github.com/rudderlabs/rudder-sdk-js/pull/96)
- Production to master [`#94`](https://github.com/rudderlabs/rudder-sdk-js/pull/94)
- Develop to production [`#92`](https://github.com/rudderlabs/rudder-sdk-js/pull/92)
- Handling version and module type in sourceconfigurl as user input [`#93`](https://github.com/rudderlabs/rudder-sdk-js/pull/93)
- Fix/version [`#91`](https://github.com/rudderlabs/rudder-sdk-js/pull/91)
- fix - pathname for canonical url [`#90`](https://github.com/rudderlabs/rudder-sdk-js/pull/90)
- mater --&gt; production [`#89`](https://github.com/rudderlabs/rudder-sdk-js/pull/89)
- Develop to master [`#88`](https://github.com/rudderlabs/rudder-sdk-js/pull/88)
- Ga change [`#87`](https://github.com/rudderlabs/rudder-sdk-js/pull/87)
- remove browser check [`#86`](https://github.com/rudderlabs/rudder-sdk-js/pull/86)
- Develop to master [`#85`](https://github.com/rudderlabs/rudder-sdk-js/pull/85)
- backward compatibility [`#84`](https://github.com/rudderlabs/rudder-sdk-js/pull/84)
- Google Analytics changes for Ecommerce and Enhanced Ecommerce support [`#83`](https://github.com/rudderlabs/rudder-sdk-js/pull/83)
- Ga lint [`#81`](https://github.com/rudderlabs/rudder-sdk-js/pull/81)
- Ga change work in progress [`#70`](https://github.com/rudderlabs/rudder-sdk-js/pull/70)
- changed for eventsToEvents [`#77`](https://github.com/rudderlabs/rudder-sdk-js/pull/77)
- Fb pixel fix [`#76`](https://github.com/rudderlabs/rudder-sdk-js/pull/76)
- Added iframe support for Lotame [`#75`](https://github.com/rudderlabs/rudder-sdk-js/pull/75)
- limit per limit retry in queue and max requests at a time [`#74`](https://github.com/rudderlabs/rudder-sdk-js/pull/74)
- Random parameter support for lotame [`#72`](https://github.com/rudderlabs/rudder-sdk-js/pull/72)
- Support for SDK as npm module [`#71`](https://github.com/rudderlabs/rudder-sdk-js/pull/71)
- fix anonymousId parsing [`#68`](https://github.com/rudderlabs/rudder-sdk-js/pull/68)
- don't reset anonId and check for adblocker [`#60`](https://github.com/rudderlabs/rudder-sdk-js/pull/60)
- GoogleAds Device Mode - empty page call handling [`#67`](https://github.com/rudderlabs/rudder-sdk-js/pull/67)
- changes for selective picking of destinations [`#65`](https://github.com/rudderlabs/rudder-sdk-js/pull/65)
- Misc updates [`#63`](https://github.com/rudderlabs/rudder-sdk-js/pull/63)
- Fb pixel dest [`#57`](https://github.com/rudderlabs/rudder-sdk-js/pull/57)
- Small improvements to the GA integration [`#58`](https://github.com/rudderlabs/rudder-sdk-js/pull/58)
- update logs and dist [`#55`](https://github.com/rudderlabs/rudder-sdk-js/pull/55)

### Commits

- remove autotrack [`4eb125b`](https://github.com/rudderlabs/rudder-sdk-js/commit/4eb125b1523613f4ce81f6517cab7f2fa627f472)
- add html file [`4f26abd`](https://github.com/rudderlabs/rudder-sdk-js/commit/4f26abdfde1c556fe47040cc7b96c0835bc7ddd3)
- make release of cdn version 1.1.12 [`57798ee`](https://github.com/rudderlabs/rudder-sdk-js/commit/57798eef266274908035f89c3447e1ae53406e0d)
- npm release 1.0.15 [`0def0de`](https://github.com/rudderlabs/rudder-sdk-js/commit/0def0de849a52fe71156bd609e81287d4818e188)
- formatting change [`9e8de43`](https://github.com/rudderlabs/rudder-sdk-js/commit/9e8de43697aee1ef327a436eba657f3d75de46e1)
- add file for build [`4af3d11`](https://github.com/rudderlabs/rudder-sdk-js/commit/4af3d115857a1204b02250372b19d9b69061b402)
- add tests [`9c96bf7`](https://github.com/rudderlabs/rudder-sdk-js/commit/9c96bf74a4f1f6c0868f549b1302179897d1cbf6)
- add autotrack [`fd66277`](https://github.com/rudderlabs/rudder-sdk-js/commit/fd66277a8f53667a8b0dc45255e3e308100d71a0)
- updated test file [`3933de1`](https://github.com/rudderlabs/rudder-sdk-js/commit/3933de180e2e144fb6b96bb4f422b450b89ef78a)
- added and rearranged config [`ca55bcb`](https://github.com/rudderlabs/rudder-sdk-js/commit/ca55bcbc1b97ff4004d8186109cfdfedeb7b05ec)
- added integration name mapping [`0d8fda6`](https://github.com/rudderlabs/rudder-sdk-js/commit/0d8fda659de5f2c78ff2260f11c64a04ffd920a3)
- initial commit for Posthog [`ce7311f`](https://github.com/rudderlabs/rudder-sdk-js/commit/ce7311f4a36f0bf3da06d54fc7f56eda419c5938)
- code refactor and update dist files [`fe0aef6`](https://github.com/rudderlabs/rudder-sdk-js/commit/fe0aef6150aede7985fab1fa258a15b08f2b51d9)
- code refactor and update dist files [`da7d7fa`](https://github.com/rudderlabs/rudder-sdk-js/commit/da7d7fa8d11c5fb0754600548d8783780df70073)
- move parts around [`66132f8`](https://github.com/rudderlabs/rudder-sdk-js/commit/66132f8dae73f4424adf2e8f799b97697d03a316)
- move parts around [`259b2b1`](https://github.com/rudderlabs/rudder-sdk-js/commit/259b2b1eb97ba7a38196c2f5b7f0d619196bb307)
- update dist files [`74045fa`](https://github.com/rudderlabs/rudder-sdk-js/commit/74045fa83b3f23b972ad8ad7ce36bedac1e25b37)
- stop GA require plugins if loadIntegration false [`f2f8daf`](https://github.com/rudderlabs/rudder-sdk-js/commit/f2f8daf6b03c4fa271ad9f4c3f17847c40bcb094)
- replay block once [`0189a7c`](https://github.com/rudderlabs/rudder-sdk-js/commit/0189a7c08fff30a13ff3bd5949507ec4e3cfe539)
- replay block once [`879a87c`](https://github.com/rudderlabs/rudder-sdk-js/commit/879a87c4e377b67700034def46fb5283bdfc9deb)
- reafctored code [`792101d`](https://github.com/rudderlabs/rudder-sdk-js/commit/792101dbf64c64b7146b8c50813f021b22c1467c)
- reafctored code [`e1f7fb7`](https://github.com/rudderlabs/rudder-sdk-js/commit/e1f7fb75fd627fdd325527b236cfe25a63942884)
- process analytics array after load() is executed [`0fb3de3`](https://github.com/rudderlabs/rudder-sdk-js/commit/0fb3de3de237fb9179e3de0a45e51b31292d24e5)
- process analytics array after load() is executed [`bbd6c25`](https://github.com/rudderlabs/rudder-sdk-js/commit/bbd6c25de8d75d24683de0f588a64aaafa3d9cb8)
- update npm dist [`d78cbfd`](https://github.com/rudderlabs/rudder-sdk-js/commit/d78cbfde9a95f7e41796f9e976568f0aebdc6a44)
- update readme [`51c2de6`](https://github.com/rudderlabs/rudder-sdk-js/commit/51c2de6a999f5cd7d8c1a0be09c380c1dd7165ee)
- extracted rs_amp_id [`60bb131`](https://github.com/rudderlabs/rudder-sdk-js/commit/60bb1316da8f63db3aa216bb3d3e1284010b8b4f)
- extracted rs_amp_id [`8d06d8a`](https://github.com/rudderlabs/rudder-sdk-js/commit/8d06d8acc2e47649104f159f1074669c272ad818)
- update dist files [`201692e`](https://github.com/rudderlabs/rudder-sdk-js/commit/201692ec42c01ee858b5fe81733bf63295010bde)
- update dist files [`37c98bf`](https://github.com/rudderlabs/rudder-sdk-js/commit/37c98bf7df317f8765c5ab44c6ea79adddb939b1)
- fix tests [`6635513`](https://github.com/rudderlabs/rudder-sdk-js/commit/66355132fd4eece5ac623b137732f3fb71b5e10a)
- move pieces [`9dadc82`](https://github.com/rudderlabs/rudder-sdk-js/commit/9dadc82f02e539716940e0a0f12613bfe6b68ac3)
- fixed UT [`aae7f66`](https://github.com/rudderlabs/rudder-sdk-js/commit/aae7f66c01230aa8b3f4c7c7d9b72a6b9e3c454a)
- initial commit for not to load integrations [`038d497`](https://github.com/rudderlabs/rudder-sdk-js/commit/038d49762d6dc227d2bfc490b42720cf1c935a4b)
- Added support for AMP linker [`c2c2a8b`](https://github.com/rudderlabs/rudder-sdk-js/commit/c2c2a8b9736bbf395be6b34eb5c6489951ede4f5)
- Added support for AMP linker [`b1a3b1f`](https://github.com/rudderlabs/rudder-sdk-js/commit/b1a3b1f3f92ea433a1215fe0f9cddad9b329b5ab)
- added amp linker utils [`ea49ea0`](https://github.com/rudderlabs/rudder-sdk-js/commit/ea49ea0c55996e0b7195b0a28820f90c95b71920)
- added amp linker utils [`368828d`](https://github.com/rudderlabs/rudder-sdk-js/commit/368828dece55ba8ce53ff96708a37a31f8b1d7a7)
- move the pieces around [`406a793`](https://github.com/rudderlabs/rudder-sdk-js/commit/406a7931d8842ecac16ba0b1a326f5525ea8921e)
- addressed review comments [`f1457f3`](https://github.com/rudderlabs/rudder-sdk-js/commit/f1457f3ed5c81ca08e2551e27a5015716d744e68)
- update dist files [`d2bcd18`](https://github.com/rudderlabs/rudder-sdk-js/commit/d2bcd182eb7464356d06e621d239be50790ad590)
- merge master [`83170c7`](https://github.com/rudderlabs/rudder-sdk-js/commit/83170c7f4925d206ca74735e6165608842d16d6f)
- added logic for showing warning when reserved keywords ae sent in properties/traits [`40a52c6`](https://github.com/rudderlabs/rudder-sdk-js/commit/40a52c6188622aa64a7b3c965927346d2d4716f2)
- format [`d864b29`](https://github.com/rudderlabs/rudder-sdk-js/commit/d864b298abc2e10ada11dc6dbb73a49e0f21ea57)
- resolve conflict and bump version [`dee0170`](https://github.com/rudderlabs/rudder-sdk-js/commit/dee0170521b573d5d3dfac8da4706fcffcd797b0)
- merge production [`68fbd77`](https://github.com/rudderlabs/rudder-sdk-js/commit/68fbd772f24f1cf0864cf0ab8f141c74e24478b8)
- GA4 Bug fixes- added logic to not send page view event when blockPageView is false [`ead5007`](https://github.com/rudderlabs/rudder-sdk-js/commit/ead50075ac40ffa857c554e2aaa07c1565fe3fdc)
- GA4 Bug fixes- added logic of sendUserId in init function when scripts is loading [`d05e725`](https://github.com/rudderlabs/rudder-sdk-js/commit/d05e725cfdf537641bf9400952036613e71dad55)
- Pushing Updated browser.js [`b0c1f11`](https://github.com/rudderlabs/rudder-sdk-js/commit/b0c1f11032f8777375d5f3b2a8994631b77bcf99)
- Made Minor Fixes and Added Appcues to integration_cname and client_server_name.js [`14f43be`](https://github.com/rudderlabs/rudder-sdk-js/commit/14f43bea972f606b92ed1604162bd64da3c1b811)
- Modified Testcases in tests/html/script-test.html [`69f0152`](https://github.com/rudderlabs/rudder-sdk-js/commit/69f0152c7e2316b18b1d9081eba59c8d29a7e435)
- Added Feature to send Appcues flow events to all destinations [`907f075`](https://github.com/rudderlabs/rudder-sdk-js/commit/907f07526c9e7f85e70bc1da5468019231ca0432)
- Implemented reset, handling Appcues default calls [`8efcb7c`](https://github.com/rudderlabs/rudder-sdk-js/commit/8efcb7cc69d52c13d39f06fc0e61b8a0e06ffe06)
- Compiled browser.js to tests/html [`8c45a1a`](https://github.com/rudderlabs/rudder-sdk-js/commit/8c45a1a88ae81b228fdcdde9f0efa0255dd7f55f)
- Implemented Identify,Track,Page [`11469b1`](https://github.com/rudderlabs/rudder-sdk-js/commit/11469b19a0b0c45cb218a4c8f6c78667a4b9b2e1)
- Added Appcues [`0cdea95`](https://github.com/rudderlabs/rudder-sdk-js/commit/0cdea959c5dba889ee7019f1af76e0d54f68c0cf)
- merge staging to this [`15b7f7f`](https://github.com/rudderlabs/rudder-sdk-js/commit/15b7f7f8ec4c3ba33da577b065185e174094946f)
- add comments [`7996e57`](https://github.com/rudderlabs/rudder-sdk-js/commit/7996e5728bd22d5a6ea763f94a5f96930666039a)
- Updated utils getDestinationEventName() to return only array instead of two values [`8f7eab6`](https://github.com/rudderlabs/rudder-sdk-js/commit/8f7eab6677f4c9ecb2816f0e613d3405d579810e)
- Replaced Find with Filter in getDestinationEventname() and removed hadMultiplepayload flag. Also includeList instead of onlyparams for Payment Info Entered. [`d912d0b`](https://github.com/rudderlabs/rudder-sdk-js/commit/d912d0bdb49538b0acb020a7600b7a4332c7dd0c)
- Added comments for future scope [`4c1b1f0`](https://github.com/rudderlabs/rudder-sdk-js/commit/4c1b1f00f35a622f6c2495ea31d95d601e89f5c3)
- Fixed extra param getting added in payload [`0953dad`](https://github.com/rudderlabs/rudder-sdk-js/commit/0953dadd64c098748f72435676e27e837db655c8)
- Fixed Prettier prob [`2d2d9c5`](https://github.com/rudderlabs/rudder-sdk-js/commit/2d2d9c56e0ba890465f96f589c472d2819017e36)
- Updated code with new modification as discussed [`217e8c9`](https://github.com/rudderlabs/rudder-sdk-js/commit/217e8c9d7ce247fe9a5628b33ec2f50e43e77668)
- add changes related to share etc [`5804064`](https://github.com/rudderlabs/rudder-sdk-js/commit/580406415b34de24cac4c645cf41df6ba974f1a2)
- Removed test file to GA4 folder [`a6cc5bc`](https://github.com/rudderlabs/rudder-sdk-js/commit/a6cc5bc0a9c1989987ef79b1d1ea536f211543d4)
- Added comments [`313dd45`](https://github.com/rudderlabs/rudder-sdk-js/commit/313dd45a16aab45f9c49ddebcd694e233fa42196)
- Logic Changes according to comments and improved readibility [`8848083`](https://github.com/rudderlabs/rudder-sdk-js/commit/8848083e834f24bb5ef2e4d1d07350ecf55531f9)
- updated logic, eventConfig and added comments [`5ee6d8c`](https://github.com/rudderlabs/rudder-sdk-js/commit/5ee6d8cc5309934a173f46e0c7eeb0cb2361f434)
- fixed wrong indentation [`366d838`](https://github.com/rudderlabs/rudder-sdk-js/commit/366d83887ae656931ebb4ad5c993d44dca32a72e)
- review commits  fixes 2 [`720b4ac`](https://github.com/rudderlabs/rudder-sdk-js/commit/720b4acd03c526b29852c48d66cf322df9c2a761)
- review commits  fixes [`a036105`](https://github.com/rudderlabs/rudder-sdk-js/commit/a036105362b97e69df9bf7fadce158ac4d3dd62b)
- resolved conflicts [`2bb0b3b`](https://github.com/rudderlabs/rudder-sdk-js/commit/2bb0b3bc0c5f7b0267bdcdbaabe91cd29be07aa8)
- Added GA4 ecommerce Event [`a821868`](https://github.com/rudderlabs/rudder-sdk-js/commit/a821868f0a825a625dacc15c53a3dc73c6549f3d)
- GA4 sdk comment updated [`222b325`](https://github.com/rudderlabs/rudder-sdk-js/commit/222b325241e418b422141ec9a42906c8afa61811)
- ga4 first commit [`923a803`](https://github.com/rudderlabs/rudder-sdk-js/commit/923a8039cb685eeb8e3551680145e2c3eb696d73)
- pendo-sdk/code fix [`7354fe4`](https://github.com/rudderlabs/rudder-sdk-js/commit/7354fe4759224a374f4e2178c0fabdd70106b64d)
- pendo-sdk/logic added related to analytics [`9408613`](https://github.com/rudderlabs/rudder-sdk-js/commit/940861327c1a5143bfe9757a636864d898a19606)
- pendo-sdk/added debug option [`accccf8`](https://github.com/rudderlabs/rudder-sdk-js/commit/accccf8c8017d9703fab5cfa512e01bdbd82fff6)
- pendo-sdk/commit for staging branch-added function in utils [`0c3b385`](https://github.com/rudderlabs/rudder-sdk-js/commit/0c3b3859953c0d9e5a48a7948fed23891303f994)
- Merge pull request #163 from rudderlabs/production-staging [`a5c9b82`](https://github.com/rudderlabs/rudder-sdk-js/commit/a5c9b8282d82470d4e7312380a3c7ffc545e9468)
- changed version [`ab3b96c`](https://github.com/rudderlabs/rudder-sdk-js/commit/ab3b96ce0bec0604f04cc6b184c86cf33a71011a)
- added version name [`4db0e25`](https://github.com/rudderlabs/rudder-sdk-js/commit/4db0e2572217ece124d3b91a76be8bd40e37fb1d)
- Merge pull request #154 from rudderlabs/production-staging [`ed46591`](https://github.com/rudderlabs/rudder-sdk-js/commit/ed46591c74e5d001d2105a0db93bda20d6453ea0)
- tostring fix [`6dd26e7`](https://github.com/rudderlabs/rudder-sdk-js/commit/6dd26e775df5f56f5660c2b371e0af26af0c567a)
- revenue_type key order [`9f40639`](https://github.com/rudderlabs/rudder-sdk-js/commit/9f406392f414040c39c4825c13bfba327873ad4f)
- added code comments [`334e935`](https://github.com/rudderlabs/rudder-sdk-js/commit/334e93551c2c6058d64b5a7c8eab8efcba2e0f95)
- refactoring and added code comments [`4433d47`](https://github.com/rudderlabs/rudder-sdk-js/commit/4433d4756b1e626b75d1b81b39ae81fa167daa9b)
- code refactoring and test file add [`a06aa3c`](https://github.com/rudderlabs/rudder-sdk-js/commit/a06aa3c5a4e3277e7136b78fefe19f4a74ffa105)
- change in page call [`b43289a`](https://github.com/rudderlabs/rudder-sdk-js/commit/b43289ad5ca95de2e328e02889f1f5af983e3bb8)
- revenue per product and all products at once refactoring [`84d19f6`](https://github.com/rudderlabs/rudder-sdk-js/commit/84d19f6509d5ee66cac759ac053944e7a1eece21)
- commented out hard-coded config [`4f7b86c`](https://github.com/rudderlabs/rudder-sdk-js/commit/4f7b86c09680895f0d82aa068079d499450a6dd6)
- added name mappings [`17d6086`](https://github.com/rudderlabs/rudder-sdk-js/commit/17d60862d9d2ee2fb726cdfe87545de63ff10753)
- added amplitude device mode integration [`1edd256`](https://github.com/rudderlabs/rudder-sdk-js/commit/1edd25636bab4072190596c5be3dee3b25699818)
- update npm build content [`c9dec01`](https://github.com/rudderlabs/rudder-sdk-js/commit/c9dec014e9a89570fb65e5664e884957a4617e64)
- remove intermediate file from source control [`6763dff`](https://github.com/rudderlabs/rudder-sdk-js/commit/6763dff3c2f4497e1fb011ed2150fb70116cff17)
- remove sourcemap ref from prod build file [`1abfac9`](https://github.com/rudderlabs/rudder-sdk-js/commit/1abfac9e39f72874d480fcd8411abd0b87abab0c)
- bump version [`4e0c185`](https://github.com/rudderlabs/rudder-sdk-js/commit/4e0c1850afda2dc9ae8f253c3066a2734b6c3c48)
- modified gitignore [`bf4ef41`](https://github.com/rudderlabs/rudder-sdk-js/commit/bf4ef4198611faf3698f0f83bbfc16492906250e)
- removed build files [`2443122`](https://github.com/rudderlabs/rudder-sdk-js/commit/2443122e1ee55bb7f4eb0e82d4841ce15a23ab14)
- test [`3e8818a`](https://github.com/rudderlabs/rudder-sdk-js/commit/3e8818a5001b32832c7105836d9c9103db08bb43)
- updated buildpsec file for staging [`944574b`](https://github.com/rudderlabs/rudder-sdk-js/commit/944574b19e7e3d38f56285c2d24e46f6e8a88eb9)
- added camel case for username [`ed61f49`](https://github.com/rudderlabs/rudder-sdk-js/commit/ed61f49d68b0eb86bb0435c56cf8649a4a50e9af)
- added buildspec file for staging [`7bcf3af`](https://github.com/rudderlabs/rudder-sdk-js/commit/7bcf3af39481573d31e21b941539382f7baea793)
- bug fixing for traits [`ceef7d7`](https://github.com/rudderlabs/rudder-sdk-js/commit/ceef7d7d1be79dc07e62d7d32301cf9a97d39628)
- addressed remaining comments [`b0ee668`](https://github.com/rudderlabs/rudder-sdk-js/commit/b0ee668041de28e4c697d2d385fd0ee48bada312)
- addressed review comments [`0635e15`](https://github.com/rudderlabs/rudder-sdk-js/commit/0635e1569cbc6918af538a42882f106ed600c3c5)
- added test cases for moengage [`65cc81d`](https://github.com/rudderlabs/rudder-sdk-js/commit/65cc81db0ad8c0c0f44299bcf6cd21de0ca79d2c)
- remove autotrack [`3b11a11`](https://github.com/rudderlabs/rudder-sdk-js/commit/3b11a11b32bdb531b1737e585f6beb2a70758a8a)
- Merge pull request #149 from rudderlabs/hubspot-https-fix [`9777852`](https://github.com/rudderlabs/rudder-sdk-js/commit/9777852c046bae360696ca5be49db819d22a446d)
- Forced hubspot to load on https [`bd199ea`](https://github.com/rudderlabs/rudder-sdk-js/commit/bd199ea5bb784a0b50911d42ce16f3306ec3af57)
- Forced hubspot to load on https [`cd85110`](https://github.com/rudderlabs/rudder-sdk-js/commit/cd85110caae6e84a9fc24562d426ea0cf9d99733)
- bump version [`b861f41`](https://github.com/rudderlabs/rudder-sdk-js/commit/b861f4190535aa6318775b97cb1c4bf48f197a02)
- bump version [`13f4311`](https://github.com/rudderlabs/rudder-sdk-js/commit/13f43112f968aad8a7c867ab092202261e3797d4)
- add support for queueOptions [`49c945c`](https://github.com/rudderlabs/rudder-sdk-js/commit/49c945cfe38d0696bdb7474dccc2a75179eddcd4)
- add support for queueOptions [`64cd4cd`](https://github.com/rudderlabs/rudder-sdk-js/commit/64cd4cd9f5f102d5bca3f125efb5477905845bf3)
- add deps [`b4cbd56`](https://github.com/rudderlabs/rudder-sdk-js/commit/b4cbd565e30103fc0a623c4660bb05aeaa4e85b4)
- add deps [`709bde0`](https://github.com/rudderlabs/rudder-sdk-js/commit/709bde08b04a67e05878fc2f734fb2552d235ade)
- send campaign parsed info [`5d4f34d`](https://github.com/rudderlabs/rudder-sdk-js/commit/5d4f34d835dcf1f12bc938e1c39b87f3ef80c097)
- send campaign parsed info [`fa07730`](https://github.com/rudderlabs/rudder-sdk-js/commit/fa0773020d8e650bafe6e1e592e7428f74f1477c)
- Bumped version [`631439c`](https://github.com/rudderlabs/rudder-sdk-js/commit/631439ccb443f646b93cd67071e52578b64faa20)
- resolve conflicts [`423bc35`](https://github.com/rudderlabs/rudder-sdk-js/commit/423bc3519b03f190c0d054f12ce1d7526107617f)
- resolve conflicts [`f54eadb`](https://github.com/rudderlabs/rudder-sdk-js/commit/f54eadb026f96a739d823599bace2ff16121db5b)
- rebase with production branch [`9eee0f4`](https://github.com/rudderlabs/rudder-sdk-js/commit/9eee0f4813eb2ab4b1e8b07064f565ca6be2c526)
- rebase with production branch [`4a833c7`](https://github.com/rudderlabs/rudder-sdk-js/commit/4a833c75593be1dafdd46cb0702f5cf326acee1b)
- bump version [`1e19367`](https://github.com/rudderlabs/rudder-sdk-js/commit/1e19367f487f3ec35bce9da99ab1cba80ce60c19)
- bump version [`f0435b6`](https://github.com/rudderlabs/rudder-sdk-js/commit/f0435b6d562e0824cc607ceeec97eeaf313d98cb)
- copy changes from dev [`6d49829`](https://github.com/rudderlabs/rudder-sdk-js/commit/6d498290ff7160c344e84c8d3b3cdcf696a26cb4)
- copy changes from dev [`9ef61ec`](https://github.com/rudderlabs/rudder-sdk-js/commit/9ef61ec09532fd20740fbcfc2f9509d298dbefe7)
- make event retry count configurable [`bdacb3c`](https://github.com/rudderlabs/rudder-sdk-js/commit/bdacb3cad70e69ee38b4bc9934eadab92ff28f32)
- make event retry count configurable [`66e9648`](https://github.com/rudderlabs/rudder-sdk-js/commit/66e964893f982b64750ad9d9a56fcd4e65864e16)
- NPM release version 1.0.11 [`da69458`](https://github.com/rudderlabs/rudder-sdk-js/commit/da694589333141b88c15b2c00dad6a1ddbc28f5f)
- NPM release version 1.0.11 [`0d127b5`](https://github.com/rudderlabs/rudder-sdk-js/commit/0d127b5a78fc19e018c0b1941be955474edc57fb)
- Bumped version [`d0d789f`](https://github.com/rudderlabs/rudder-sdk-js/commit/d0d789f0ec59278866dff4407a6ca3801d9e9dd9)
- Bumped version [`668baa0`](https://github.com/rudderlabs/rudder-sdk-js/commit/668baa08f5642063d19bd4670d9527eac023f2a6)
- update npm module [`ba24390`](https://github.com/rudderlabs/rudder-sdk-js/commit/ba24390f698de25d61f1e328919689a08abfe505)
- update npm module [`47a0433`](https://github.com/rudderlabs/rudder-sdk-js/commit/47a0433ccdc8c07c79f8ea60e23996ea289c0a25)
- update npm module [`f86128a`](https://github.com/rudderlabs/rudder-sdk-js/commit/f86128aa2205ca28b2be802567f1c71c350c5b76)
- update npm module [`743c63b`](https://github.com/rudderlabs/rudder-sdk-js/commit/743c63b613310207533e36492e186cc0bd8b539f)
- add querystring parse to npm module [`afe2a6c`](https://github.com/rudderlabs/rudder-sdk-js/commit/afe2a6c22e311fe72bb1d40d3d6b927d458f4efd)
- add querystring parse to npm module [`3023fa6`](https://github.com/rudderlabs/rudder-sdk-js/commit/3023fa6289dc13d79fd7600e3a0a95e5e159b5a9)
- add querystring parse to npm module [`0608d24`](https://github.com/rudderlabs/rudder-sdk-js/commit/0608d2432a85a3eca2ca2575974dfc733f7efbda)
- add querystring parse to npm module [`beed512`](https://github.com/rudderlabs/rudder-sdk-js/commit/beed512aca70d8b7760f82d3a8a06fd685d7618b)
- bump version [`7f153a1`](https://github.com/rudderlabs/rudder-sdk-js/commit/7f153a186e28f44ea59d2cb8fc5f9df6129c4971)
- bump version [`fe16ef5`](https://github.com/rudderlabs/rudder-sdk-js/commit/fe16ef564e270dcec755c471d9fa5d5f5f6f196b)
- Querystring api doc update [`fdfecbd`](https://github.com/rudderlabs/rudder-sdk-js/commit/fdfecbdb123a020fb648199e9f249aed4d2f6fe1)
- bug fix [`252c2e1`](https://github.com/rudderlabs/rudder-sdk-js/commit/252c2e1c39fd259892cb0a3751436a7cd1cedf6e)
- bug fix [`6b66558`](https://github.com/rudderlabs/rudder-sdk-js/commit/6b66558bcca58e9e76d0da0c1c10fa17c26ea67e)
- branch for npm and latest release [`b5437ec`](https://github.com/rudderlabs/rudder-sdk-js/commit/b5437ec64e6563d22bab26d005576017107ca062)
- branch for npm and latest release [`fedffc9`](https://github.com/rudderlabs/rudder-sdk-js/commit/fedffc91ae0361b440c143d28a091994c9c7f3de)
- branch for npm and latest release [`00da687`](https://github.com/rudderlabs/rudder-sdk-js/commit/00da687f9fad892c0d877092704c01a1e2923ef4)
- branch for npm and latest release [`603ad79`](https://github.com/rudderlabs/rudder-sdk-js/commit/603ad797dacc7f09f55b5ef59353a1b5fd7621a6)
- add query parse logic from url and send events [`591599b`](https://github.com/rudderlabs/rudder-sdk-js/commit/591599b232e3651b66e1392aa935efaef67103b0)
- add query parse logic from url and send events [`1faabd5`](https://github.com/rudderlabs/rudder-sdk-js/commit/1faabd5eeaabfef898d72f47befa47989d36ca29)
- change tostring for ie [`fdfdf8b`](https://github.com/rudderlabs/rudder-sdk-js/commit/fdfdf8b8f2dfece83944770a3ac353bfc92828d6)
- change tostring for ie [`406437a`](https://github.com/rudderlabs/rudder-sdk-js/commit/406437af7c5bef52e3ff9999fbbbc3b2dfb7e3d1)
- change tostring for ie [`26ba348`](https://github.com/rudderlabs/rudder-sdk-js/commit/26ba3482fa59bfce7dc57a6326324027519c883b)
- change tostring for ie [`ce0f45e`](https://github.com/rudderlabs/rudder-sdk-js/commit/ce0f45e700f8122bd88e7c7642255ec08f241a67)
- add node modules transpilation [`1284903`](https://github.com/rudderlabs/rudder-sdk-js/commit/128490337ec2f4b8da1a50b8391e17a623577bac)
- add node modules transpilation [`d2a505b`](https://github.com/rudderlabs/rudder-sdk-js/commit/d2a505b2962d5ef0ae66924a92cff23a832066b7)
- add polyfill and other changes [`c76c4f9`](https://github.com/rudderlabs/rudder-sdk-js/commit/c76c4f9e0b788abf91501e85cfbf1380ee27c9e4)
- add polyfill and other changes [`c1b5401`](https://github.com/rudderlabs/rudder-sdk-js/commit/c1b5401aa44b3e572f475c320763825cd135e96c)
- fix for page properties [`1390856`](https://github.com/rudderlabs/rudder-sdk-js/commit/1390856d79fbe3abafb9a2c083b5227d1e1cfd0d)
- fix for page properties [`6912a14`](https://github.com/rudderlabs/rudder-sdk-js/commit/6912a149ec0eae8a283f7bbfc738208305c997f1)
- init changes [`88345ef`](https://github.com/rudderlabs/rudder-sdk-js/commit/88345ef3361bb14586934ec2b942e354d63e6d37)
- init changes [`b6cacb7`](https://github.com/rudderlabs/rudder-sdk-js/commit/b6cacb79be19c416bd6d89bbf2e73c4cea9d5603)
- minor changes [`2163549`](https://github.com/rudderlabs/rudder-sdk-js/commit/2163549943c8d69045c69d936eeb7e0bb2d0db05)
- minor changes [`e03e816`](https://github.com/rudderlabs/rudder-sdk-js/commit/e03e8163a341ef7457fca7424d1c1ffa829a141e)
- changed return avlue for isloaded and isready [`88edb0f`](https://github.com/rudderlabs/rudder-sdk-js/commit/88edb0f06c3c8cb78499bb3eee5115ef3f7c643a)
- changed return avlue for isloaded and isready [`0b38d08`](https://github.com/rudderlabs/rudder-sdk-js/commit/0b38d082266ee933dca7c3eaab193e1d84823019)
- minor changes from review comment and formatting [`ac32b2d`](https://github.com/rudderlabs/rudder-sdk-js/commit/ac32b2d045d4d15b8573456cc1f7ae811604c362)
- minor changes from review comment and formatting [`214727b`](https://github.com/rudderlabs/rudder-sdk-js/commit/214727b4603ce0b7755bf6b81fafa6f21f3e01cf)
- added tvsquared as destination [`4020daf`](https://github.com/rudderlabs/rudder-sdk-js/commit/4020daf1446349410451c86bad15d518c1c6a5eb)
- added tvsquared as destination [`3a85480`](https://github.com/rudderlabs/rudder-sdk-js/commit/3a854809dfb89b355a6af576b4a2f21ef752f240)
- update npm module [`3626817`](https://github.com/rudderlabs/rudder-sdk-js/commit/3626817f06627a9f0dc69c9a2970aacbbd5ebd9e)
- update npm module [`83a96a4`](https://github.com/rudderlabs/rudder-sdk-js/commit/83a96a4ef728929af7e4fbdcece8e52c2e4dcc5f)
- update npm module [`038355c`](https://github.com/rudderlabs/rudder-sdk-js/commit/038355c2583df7b1c5da8933700454aa89521e12)
- update npm module [`8f4af93`](https://github.com/rudderlabs/rudder-sdk-js/commit/8f4af93b96f6009676e8728e62bebf4ee5a72c56)
- update npm module [`62020d6`](https://github.com/rudderlabs/rudder-sdk-js/commit/62020d638b540626748b74a2e684bd8e46a1083d)
- Updated npm distribution files [`09a3a63`](https://github.com/rudderlabs/rudder-sdk-js/commit/09a3a635275a974a75b199cbdad4306841b26a81)
- Updated npm distribution files [`056b671`](https://github.com/rudderlabs/rudder-sdk-js/commit/056b6713d9a88368e46bea3cc44c5666fecc3e57)
- Updated npm distribution files [`1b17b44`](https://github.com/rudderlabs/rudder-sdk-js/commit/1b17b447e2731dcbcf828cf2c9b167c0f1cca50a)
- Updated npm distribution files [`cb1b4ec`](https://github.com/rudderlabs/rudder-sdk-js/commit/cb1b4ecf5605522824f8f72c30a3cb144c4ec7c9)
- Merge pull request #118 from rudderlabs/master [`5f5d1eb`](https://github.com/rudderlabs/rudder-sdk-js/commit/5f5d1eb2671430a5c440fb40f88ffcdd767d9266)
- Merge pull request #117 from rudderlabs/develop [`8d7b45a`](https://github.com/rudderlabs/rudder-sdk-js/commit/8d7b45a9413a1c7e30d3fb405e8a480e18f01fc7)
- refactor replay logic [`d17de69`](https://github.com/rudderlabs/rudder-sdk-js/commit/d17de698d56cab1ab892692d31c5e4088ee5302c)
- replaced console.log with logger.debug [`71525fd`](https://github.com/rudderlabs/rudder-sdk-js/commit/71525fd989ec358295245c7e88988482fa2366ec)
- replaced console.log with logger.debug [`1dc8eda`](https://github.com/rudderlabs/rudder-sdk-js/commit/1dc8eda5774693f740f5a222e0593c92f475f588)
- addressed review comments [`a6b0100`](https://github.com/rudderlabs/rudder-sdk-js/commit/a6b010091e3f0f5788bc7376a49de0ab746bd186)
- fix of group traits after reset [`20d4f70`](https://github.com/rudderlabs/rudder-sdk-js/commit/20d4f702d5c40fa30a643ea003c3537ad79603a6)
- override properties with custom campaign properties [`24dea89`](https://github.com/rudderlabs/rudder-sdk-js/commit/24dea895a889921a67c368e29f537c141e82c750)
- bug fixing and code cleanup [`b11815e`](https://github.com/rudderlabs/rudder-sdk-js/commit/b11815e863c97beca22230f9258b4818bcb8eb7f)
- initial commit for optimizely web [`a769a0f`](https://github.com/rudderlabs/rudder-sdk-js/commit/a769a0fd03e3eac43ce6f5d5511cd1a71e964513)
- remove dist/browser.js [`cd3a284`](https://github.com/rudderlabs/rudder-sdk-js/commit/cd3a284f4aae233613b0d3a2a0b25eee6a0633d9)
- add test in pre-commit [`c7548ac`](https://github.com/rudderlabs/rudder-sdk-js/commit/c7548ac5d25d2acc73ea8091d60b348cf42a6337)
- change crypto version and loaded fix [`c734231`](https://github.com/rudderlabs/rudder-sdk-js/commit/c734231a4ac8a2a89db3337978163d9f8c5f6fef)
- resolve conflicts [`f9c3852`](https://github.com/rudderlabs/rudder-sdk-js/commit/f9c38520c17f7733f11755d10eb801d3fbadde4a)
- handled error if rudderanalytics is not initialized in script [`ddb853e`](https://github.com/rudderlabs/rudder-sdk-js/commit/ddb853efed87489f564be4fd56478219380b30b4)
- added writekey and server url validation [`a9e2a2a`](https://github.com/rudderlabs/rudder-sdk-js/commit/a9e2a2a5088fa7485790e89536126aad4d757e41)
- send the events to server/destination that are made only after load call [`e1e6ce0`](https://github.com/rudderlabs/rudder-sdk-js/commit/e1e6ce0f6ef8506874f007ecab1ea95085c2915a)
- change key [`d23a2d4`](https://github.com/rudderlabs/rudder-sdk-js/commit/d23a2d443c1480fa494657b2d0733b8218a9cae1)
- code cleanup [`eeb6587`](https://github.com/rudderlabs/rudder-sdk-js/commit/eeb658753bdd145dca5b0b3772375933f3e613d9)
- changing import to have tree-shaking [`ffd4934`](https://github.com/rudderlabs/rudder-sdk-js/commit/ffd4934b43b142ccea8a1572194049346df48ce8)
- add crpto-js for value encryption [`0f92728`](https://github.com/rudderlabs/rudder-sdk-js/commit/0f9272813ce343dc49b21197de6a38ea791ac43e)
- removed redundant checking and added check for empty serverUrl [`701d1ea`](https://github.com/rudderlabs/rudder-sdk-js/commit/701d1eaa891f27fb4790a730998f8fd3c1253d36)
- missing writekey fix [`0a7b9d8`](https://github.com/rudderlabs/rudder-sdk-js/commit/0a7b9d88df46ca92a004a25bef96ef936d9efc0b)
- Updated npm version [`17cfc07`](https://github.com/rudderlabs/rudder-sdk-js/commit/17cfc070826f74c0c3f6b70710876ec21a308359)
- updated documentation [`3e62368`](https://github.com/rudderlabs/rudder-sdk-js/commit/3e6236811c3976ba17fd9c0d6afafdd1823a496a)
- updated autotrack test html [`5d2e0ad`](https://github.com/rudderlabs/rudder-sdk-js/commit/5d2e0adb656483f10f6e03e0ba1219890a524a51)
- changes for not tracking sensitive data [`fcd0af3`](https://github.com/rudderlabs/rudder-sdk-js/commit/fcd0af377886d74779d6ec8ca3de7071d82a70d5)
- add ignore pattern [`4c0d59e`](https://github.com/rudderlabs/rudder-sdk-js/commit/4c0d59e44f21a15ee2ca34543ead2b76592c6f50)
- add ignore pattern [`782fa80`](https://github.com/rudderlabs/rudder-sdk-js/commit/782fa80ccc86a9a97d0aa87413c42307e9a411f8)
- handling version and module type in sourceconfigurl as user input [`b202a37`](https://github.com/rudderlabs/rudder-sdk-js/commit/b202a37205b389b484b37313c147a500763d14ad)
- updated npm version [`4addbfe`](https://github.com/rudderlabs/rudder-sdk-js/commit/4addbfeade86fd5ff15dc7f567c111f34e19bcd9)
- version and module type for npm [`12f2fff`](https://github.com/rudderlabs/rudder-sdk-js/commit/12f2fffd83779fe78bddb29d8189422bfcc4c92c)
- minor change [`4080801`](https://github.com/rudderlabs/rudder-sdk-js/commit/4080801cc8525338511b691dc19c035931c57992)
- minor change [`689e824`](https://github.com/rudderlabs/rudder-sdk-js/commit/689e824cdf396d6016bf6acf85dbd09a51736e1b)
- minor change [`7c36fa0`](https://github.com/rudderlabs/rudder-sdk-js/commit/7c36fa0356aa6f65e8a82d4e68d045abb4e479f4)
- minor change [`e0d914b`](https://github.com/rudderlabs/rudder-sdk-js/commit/e0d914b463a0255ad95a8391574ee9539fe81669)
- minor change [`ba489d2`](https://github.com/rudderlabs/rudder-sdk-js/commit/ba489d23720e602517d57e254f567c0e8ccdf4be)
- build for npm [`f8d7e32`](https://github.com/rudderlabs/rudder-sdk-js/commit/f8d7e32c776d1181bb73810b819b1f2d36f02b23)
- build for npm [`db03d79`](https://github.com/rudderlabs/rudder-sdk-js/commit/db03d7906ee6f825274c1c6a964b4f7e9383778e)
- dist/rudder-sdk-js/index.js [`d3465af`](https://github.com/rudderlabs/rudder-sdk-js/commit/d3465aff632be79913eed1475b209016de66fd2d)
- dist/rudder-sdk-js/index.js [`63ed67e`](https://github.com/rudderlabs/rudder-sdk-js/commit/63ed67e094e5937eb94dad30b3b6d2360433af05)
- update test command [`811e57d`](https://github.com/rudderlabs/rudder-sdk-js/commit/811e57d2666274a6d980116c4000ffb97c6909fd)
- lint change [`0004dd5`](https://github.com/rudderlabs/rudder-sdk-js/commit/0004dd501a56d8b9275a6f8a20aa6450495976ff)
- added logs [`520359d`](https://github.com/rudderlabs/rudder-sdk-js/commit/520359d56bfd7c879bd1db1d8ccd6a4c29523bb2)
- minor fix [`62b666e`](https://github.com/rudderlabs/rudder-sdk-js/commit/62b666e01a1e7343489053e3cb7df556cf774a82)
- path func [`70e1eb3`](https://github.com/rudderlabs/rudder-sdk-js/commit/70e1eb36c430f3dc1493a654e83e55c4fede5a7b)
- Fixes for static [`1035dd1`](https://github.com/rudderlabs/rudder-sdk-js/commit/1035dd1f01ca1acc3bfce75401c452703df20c06)
- Intermediate review update [`f9e2f92`](https://github.com/rudderlabs/rudder-sdk-js/commit/f9e2f926c29da78172491e0dd6798f44bb365761)
- change in variable [`f42a7c5`](https://github.com/rudderlabs/rudder-sdk-js/commit/f42a7c57b87168843f30bb708fa1a2414cfc2f63)
- Intermediate review update [`14e8948`](https://github.com/rudderlabs/rudder-sdk-js/commit/14e8948fc08c24ae43891d76c2f4e18758e5f17e)
- Intermediate review update [`a745f6d`](https://github.com/rudderlabs/rudder-sdk-js/commit/a745f6d8d9a3258c817a775605bcace7cd53239b)
- elint fixes [`a31de76`](https://github.com/rudderlabs/rudder-sdk-js/commit/a31de7671e392c5b05208348ddb9b97ff33a79f3)
- Result of npx eslint . --fix [`888f5e9`](https://github.com/rudderlabs/rudder-sdk-js/commit/888f5e9ce15f6771c10f18a66e53d7a3343a7af9)
- changed for in to for each [`a917bbb`](https://github.com/rudderlabs/rudder-sdk-js/commit/a917bbb0564f9ba0ab31a1749c43c65c83e55d66)
- removed most eslint errors [`a13939e`](https://github.com/rudderlabs/rudder-sdk-js/commit/a13939eec31faa9ae005e0023a5e702d7ba7e97d)
- rebased with unit_test_init [`6b36ee2`](https://github.com/rudderlabs/rudder-sdk-js/commit/6b36ee2f7acb3d356b0a378daef5ed2f8a9e76cd)
- updated index.test.js [`fd9fc18`](https://github.com/rudderlabs/rudder-sdk-js/commit/fd9fc18fa92dca2e2ff6ca424a9af7097dc88b48)
- change for reset custom dimensions [`1a28ccb`](https://github.com/rudderlabs/rudder-sdk-js/commit/1a28ccba923083911cb31f4f0f59014274e1ecd3)
- update files [`ece035d`](https://github.com/rudderlabs/rudder-sdk-js/commit/ece035d63a6952f8d86f0c7ba05de86f6ae8727f)
- change precommit [`8adfe76`](https://github.com/rudderlabs/rudder-sdk-js/commit/8adfe763150ddfc6f126fd4cc5bb898d79920a9f)
- missed changes [`2210954`](https://github.com/rudderlabs/rudder-sdk-js/commit/221095475b80280079a1d1310188340c8ddecbab)
- remove coverage [`68144db`](https://github.com/rudderlabs/rudder-sdk-js/commit/68144dbac8c399d10ad07d3630dfaf88b2a2a389)
- steps into the ut world [`09176b9`](https://github.com/rudderlabs/rudder-sdk-js/commit/09176b90bffbfc9d8e09a91af8b6d1b60d086e8d)
- init eslint config and run on GA code [`938ea9c`](https://github.com/rudderlabs/rudder-sdk-js/commit/938ea9c5995a925041b6d252c7216b7d6acba6f8)
- update package.json [`0a4d4b7`](https://github.com/rudderlabs/rudder-sdk-js/commit/0a4d4b731afc7fead1d02d95f220dce5e2694fbb)
- bug fixes [`21ab222`](https://github.com/rudderlabs/rudder-sdk-js/commit/21ab222ac0ff3baabe36f286074cc8cbbd57042e)
- fixed bugs [`36ef540`](https://github.com/rudderlabs/rudder-sdk-js/commit/36ef540c6923ce746a67dbdffb068109dd716f77)
- added test file for ecomm [`6d3a518`](https://github.com/rudderlabs/rudder-sdk-js/commit/6d3a5181ab3ce6b1872cef8461c8735b757a7c0c)
- bug change [`6580ac6`](https://github.com/rudderlabs/rudder-sdk-js/commit/6580ac6a77572bcdae085a03589185b4fab4ed43)
- changed payload and pageview [`cad5763`](https://github.com/rudderlabs/rudder-sdk-js/commit/cad5763a7d2442bf0f51c0b4e46a72d95c7f04b0)
- changed naming logic in page call [`de87fb4`](https://github.com/rudderlabs/rudder-sdk-js/commit/de87fb40bd2f8e6db9a33528f5a01ad159daad59)
- changed for bug [`a7884f3`](https://github.com/rudderlabs/rudder-sdk-js/commit/a7884f3a13a6af15dd047695742e3a0ef1d691af)
- add correct module name [`8e8e12b`](https://github.com/rudderlabs/rudder-sdk-js/commit/8e8e12bc3bf7e8704a8b5c43914eb44bf74ec1bd)
- add correct module name [`3744075`](https://github.com/rudderlabs/rudder-sdk-js/commit/3744075a422e32c87ab80dc2c0bf318f928b94d4)
- changed for bug [`915c848`](https://github.com/rudderlabs/rudder-sdk-js/commit/915c8486cfbcd2e65aef63731756103e4e39aa13)
- add map [`376e743`](https://github.com/rudderlabs/rudder-sdk-js/commit/376e74341cf69a1b9df32b80f8106fd5884b25d6)
- changed google tag manager [`0a4fee1`](https://github.com/rudderlabs/rudder-sdk-js/commit/0a4fee1c5c2506d3acc5ea3a73436f0271ff0b55)
- code clean up [`ddee861`](https://github.com/rudderlabs/rudder-sdk-js/commit/ddee86103bcc5816dce03d1d0c1048fc69800cdc)
- moved functions within the class [`42303eb`](https://github.com/rudderlabs/rudder-sdk-js/commit/42303eb2c0b7e40d75daf0e6e393f7de65a0489c)
- changed the way of comments [`a6369d2`](https://github.com/rudderlabs/rudder-sdk-js/commit/a6369d2696473616e6ba7903243cf62ebef3780e)
- changed the way of comments [`bb0531d`](https://github.com/rudderlabs/rudder-sdk-js/commit/bb0531db764b834c99c28f73fbcc989e4e8c46a6)
- added review comments [`7abdbca`](https://github.com/rudderlabs/rudder-sdk-js/commit/7abdbca45b07814d124f771d8f71ed536e30f208)
- addressed remaining comments [`71b64dd`](https://github.com/rudderlabs/rudder-sdk-js/commit/71b64dddda7c35583e3e08561350112929a1a18e)
- changed from if else to switch and shifted functions to util.js [`60a4f5d`](https://github.com/rudderlabs/rudder-sdk-js/commit/60a4f5dbb388286b82105cef4b4bbde365dfb0a4)
- changed from if else to switch and shifted functions to util.js [`4bd6c0a`](https://github.com/rudderlabs/rudder-sdk-js/commit/4bd6c0ab2578b9782197e34d1a8c64193d3f9110)
- add pre-commit [`10f5947`](https://github.com/rudderlabs/rudder-sdk-js/commit/10f59478d49beaf025e70afbfc357d8c0f4301de)
- rename [`4d97110`](https://github.com/rudderlabs/rudder-sdk-js/commit/4d9711070976f575819e2c64239f5d7154be75ae)
- Update index.js [`3ab9622`](https://github.com/rudderlabs/rudder-sdk-js/commit/3ab962266f546759c4db6900531ce0586c4bd55c)
- added comments and addressed some of the comments [`7bca60e`](https://github.com/rudderlabs/rudder-sdk-js/commit/7bca60ed9cae0188c1f70381f754a1e42e6cb59f)
- removed classic from ga [`b0673d0`](https://github.com/rudderlabs/rudder-sdk-js/commit/b0673d095bc2621430b0a1dd31f83093ea67e504)
- back to production to build [`616bfe9`](https://github.com/rudderlabs/rudder-sdk-js/commit/616bfe9eed5ddb5e2965b4fe5fd21679cd12f84a)
- test prod build [`abbf9b3`](https://github.com/rudderlabs/rudder-sdk-js/commit/abbf9b3d0509a839e6d805b2f1afd325100adf66)
- fix tests now [`b1434f9`](https://github.com/rudderlabs/rudder-sdk-js/commit/b1434f9d61e34b9be3850fd70c85ee7d1b176bfc)
- pushing everything into build [`5946bcd`](https://github.com/rudderlabs/rudder-sdk-js/commit/5946bcd4bdd34c548ec1a10c28907bb0064bd75c)
- adding an error to check pipeline [`c5e3775`](https://github.com/rudderlabs/rudder-sdk-js/commit/c5e3775413ebbd6bfe02189af3bcd175b2f2b0eb)
- update s3 cp [`c2d359e`](https://github.com/rudderlabs/rudder-sdk-js/commit/c2d359e5bc21b4540ad2064a623b52e29967d462)
- modify headers [`397290b`](https://github.com/rudderlabs/rudder-sdk-js/commit/397290b6384f256b9f9bd5d8bd4cdc55863c2e84)
- add metadata [`3aeb9b7`](https://github.com/rudderlabs/rudder-sdk-js/commit/3aeb9b7d560b0bec4d27ad74b6af02f2e07809e1)
- change extension [`249eb6c`](https://github.com/rudderlabs/rudder-sdk-js/commit/249eb6c690b47b2e1904e6c04ac87dd3a5edf767)
- update build file [`db0befd`](https://github.com/rudderlabs/rudder-sdk-js/commit/db0befdc8d8a54b1be44d151c815f6619d430709)
- change name [`0a2c670`](https://github.com/rudderlabs/rudder-sdk-js/commit/0a2c67016632b968b19ca5090399adf6704cd726)
- change bucket name [`f2bd52b`](https://github.com/rudderlabs/rudder-sdk-js/commit/f2bd52bb941367f2ca8099c04c5bd9c8d522e0bb)
- initial commit [`8ba06c4`](https://github.com/rudderlabs/rudder-sdk-js/commit/8ba06c48e441fd9bd6425693f15875ce3e181a7a)
- update npm module [`b6d9c1b`](https://github.com/rudderlabs/rudder-sdk-js/commit/b6d9c1baf31c5f6413f85b842b0a46eb176aa01b)
- built done [`23c042e`](https://github.com/rudderlabs/rudder-sdk-js/commit/23c042e1016b9fd44583490975638a5947ff56ce)
- bug fixes [`f9c0913`](https://github.com/rudderlabs/rudder-sdk-js/commit/f9c091320715a0ccd11b57390f763a99de14cb09)
- changed to arrow functions [`61a6482`](https://github.com/rudderlabs/rudder-sdk-js/commit/61a6482710b924cc992d618f9c719cd15a17dc66)
- Updated build files [`0d484f8`](https://github.com/rudderlabs/rudder-sdk-js/commit/0d484f80373301a8155816985121fcfd8d953b5f)
- Updated .gitignore [`961d3b6`](https://github.com/rudderlabs/rudder-sdk-js/commit/961d3b6b60dc65e3498d952949cfbb5595d00361)
- Added sourceConfigMap to min.js [`bb7a242`](https://github.com/rudderlabs/rudder-sdk-js/commit/bb7a242464c1ff6a2fd65a049b77cd87b2a53d49)
- Removed build files [`6d61065`](https://github.com/rudderlabs/rudder-sdk-js/commit/6d6106571d2566d0c515ce913390399c2e854572)
- Updated build files [`e71aac7`](https://github.com/rudderlabs/rudder-sdk-js/commit/e71aac7add6d85c7289762c5a51baa5a0fb7a2ec)
- Published npm version 1.0.1 [`dee6d9d`](https://github.com/rudderlabs/rudder-sdk-js/commit/dee6d9d3ffb1867b3cff11a72a7f0366c6c0d513)
- Updated dist/browser.js [`7feec24`](https://github.com/rudderlabs/rudder-sdk-js/commit/7feec24070e536ff425d3dc9163fbb19a840639c)
- Updated npm release files [`3825df6`](https://github.com/rudderlabs/rudder-sdk-js/commit/3825df695975fa146776c0e9342e6078ce6a18da)
- Updated distribution files [`5faf342`](https://github.com/rudderlabs/rudder-sdk-js/commit/5faf342a73e16c6c05424aa7f8da6c9d358f0558)
- added random support for lotame [`d0e6514`](https://github.com/rudderlabs/rudder-sdk-js/commit/d0e6514d3fe466b4b16bf553c7b764d72cdd4efb)
- update readme [`6f31f58`](https://github.com/rudderlabs/rudder-sdk-js/commit/6f31f586762d495951f63ae761172c52e0573696)
- update tests [`7ffc7b9`](https://github.com/rudderlabs/rudder-sdk-js/commit/7ffc7b93a35173516c3c0097b3776fc060786aaa)
- 1.add npm package in dist 2. Update build 3. update dist and readme [`c59f87e`](https://github.com/rudderlabs/rudder-sdk-js/commit/c59f87e998d0ec9b08003fa00c68e438761329fd)
- seperate sourcemap from dist file [`230e168`](https://github.com/rudderlabs/rudder-sdk-js/commit/230e168ce592659be57ecc65f5cefcff36a90c84)
- add sourcemap and cleanup [`775ab0c`](https://github.com/rudderlabs/rudder-sdk-js/commit/775ab0cbb61696d83963f40e7deef663123a1164)
- update module [`da9fd63`](https://github.com/rudderlabs/rudder-sdk-js/commit/da9fd630e097499db993968456a6f0c091162cd7)
- add anonymousId header [`bdeb1e4`](https://github.com/rudderlabs/rudder-sdk-js/commit/bdeb1e455ec5281c536c9ef1d69600b7cd332f07)
- change method param name [`7fe707c`](https://github.com/rudderlabs/rudder-sdk-js/commit/7fe707c4a484b9340aa48736f92f00415c7abd3c)
- make changes for GTM and Fb pixel cnames [`f55dd1f`](https://github.com/rudderlabs/rudder-sdk-js/commit/f55dd1f78398c0585fbee42f6b43ca4645942d7b)
- tested for identify and track calls and changed accordingly [`db204f3`](https://github.com/rudderlabs/rudder-sdk-js/commit/db204f311226c6792b301464539675c541bf557b)
- add support for global callbacks as input to load options [`4f7ee72`](https://github.com/rudderlabs/rudder-sdk-js/commit/4f7ee722ef18966020c1d5654f84bdb823997dcf)
- tested for page calls and changed accordingly [`5252817`](https://github.com/rudderlabs/rudder-sdk-js/commit/5252817a77e1016f0531e2a9893e7e8772d4c52d)
- tested for page calls and changed accordingly [`0ac7714`](https://github.com/rudderlabs/rudder-sdk-js/commit/0ac7714e284feee5c5a5a2c29307c8549033e69b)
- updated changes [`318a393`](https://github.com/rudderlabs/rudder-sdk-js/commit/318a3937b433834a146ff2103b9d0b17d96cf1c3)
- update dist [`418d00d`](https://github.com/rudderlabs/rudder-sdk-js/commit/418d00d71e73d7691e9f761145b42bd853df8452)
- add JS npm module and related tests [`8e89548`](https://github.com/rudderlabs/rudder-sdk-js/commit/8e89548af13dda02d0ac3e8acef1740f5fd49a54)
- init commit for npm module [`69518b7`](https://github.com/rudderlabs/rudder-sdk-js/commit/69518b728a2307ed9e1f9ba352537d626312d58b)
- updated changes [`13f1b39`](https://github.com/rudderlabs/rudder-sdk-js/commit/13f1b39704812c7018aaf442ab3e595e3d4b76cb)
- code formatted [`b37d564`](https://github.com/rudderlabs/rudder-sdk-js/commit/b37d564308b3edb5676f21c48b6adf4e30a789fb)
- for destinations that don't support or we havenot added support for the methods [`1d49e3d`](https://github.com/rudderlabs/rudder-sdk-js/commit/1d49e3d5944ca32fad4c5c04905a9f52bd0589f4)
- change default url and cleanup [`5a4a2d9`](https://github.com/rudderlabs/rudder-sdk-js/commit/5a4a2d95bf1f7380e653f8d6bf9597abb6b08878)
- fix [`3c93077`](https://github.com/rudderlabs/rudder-sdk-js/commit/3c9307725b4e2d1992c6583aecfbc547d8248e14)
- update dist files [`99c7069`](https://github.com/rudderlabs/rudder-sdk-js/commit/99c7069e141465fba7423b2b9c8c6f3518c299ad)
- add platform and version to default config backend url [`3ff4eed`](https://github.com/rudderlabs/rudder-sdk-js/commit/3ff4eed2d6a41e9455d2ebbd4893333d943beb9f)
- taking options for adblock request and dist files [`23066b0`](https://github.com/rudderlabs/rudder-sdk-js/commit/23066b0ad2d31341a7747100ae9b366f12763e2a)
- added empty page call handling [`109214b`](https://github.com/rudderlabs/rudder-sdk-js/commit/109214befeb64f9199960403f0992e83ba800ee9)
- added classic calls [`411eb74`](https://github.com/rudderlabs/rudder-sdk-js/commit/411eb74927411db9fad9dc6095fc2afc587355a4)
- update dist files [`4015a0f`](https://github.com/rudderlabs/rudder-sdk-js/commit/4015a0fb4b1d66049f712e4776f221beebb0e484)
- updated initialization in GA [`59bf825`](https://github.com/rudderlabs/rudder-sdk-js/commit/59bf8250757115790360bd36cc23a36e588dcaf2)
- update dist files [`f1d926c`](https://github.com/rudderlabs/rudder-sdk-js/commit/f1d926c7b58c2b54483d70f40b569623ae914add)
- change mapping [`33cec28`](https://github.com/rudderlabs/rudder-sdk-js/commit/33cec28d967b973095aeacc2cbec48dece7741a9)
- fix bug [`f3f13fe`](https://github.com/rudderlabs/rudder-sdk-js/commit/f3f13fe60ea77f39caa374c2db5a7e1149884eb6)
- log failed/unsupported native integrations [`1d36205`](https://github.com/rudderlabs/rudder-sdk-js/commit/1d36205c79ec2e90619a2db52c2bcf860fbff524)
- implement review comments [`b262f1e`](https://github.com/rudderlabs/rudder-sdk-js/commit/b262f1ea5925d569997c7ac17ce86a91ade434be)
- bug fix [`f30d8a9`](https://github.com/rudderlabs/rudder-sdk-js/commit/f30d8a9c54de9b5c3dbd58fefad092063d97d510)
- adding server identifiable names [`3dbe7ea`](https://github.com/rudderlabs/rudder-sdk-js/commit/3dbe7ea799d1a519ada012db3a9c8b9fb1018aab)
- update comments [`694d3bc`](https://github.com/rudderlabs/rudder-sdk-js/commit/694d3bc9d9ce3fbe892fade3d313094cd78b951b)
- dist files and few bug fixes [`2a649f2`](https://github.com/rudderlabs/rudder-sdk-js/commit/2a649f2e8762f18d4a2f0b0ace460839c9e743db)
- added enhanced ecommerce events [`42b2141`](https://github.com/rudderlabs/rudder-sdk-js/commit/42b21414e6b5d607cc78d4b15a22aca4dabb4bfe)
- added general ecommerce event in ga [`1094c12`](https://github.com/rudderlabs/rudder-sdk-js/commit/1094c128e07a6a0089f1ef10fe9a62cd8f1d1f99)
- update dist files [`4da44fe`](https://github.com/rudderlabs/rudder-sdk-js/commit/4da44fe690652ac39eabeca1c7845c2f492ad2ca)
- wrong import path fix and update dependency [`237fc02`](https://github.com/rudderlabs/rudder-sdk-js/commit/237fc02c77a787bc7315bfed99075ab84af8e151)
- Revert "added empty page call handling for GTM" [`f05a957`](https://github.com/rudderlabs/rudder-sdk-js/commit/f05a957019306c19bed6c71ac1943d8105b4c37d)
- changes in page,identify,track calls in ga [`96562b9`](https://github.com/rudderlabs/rudder-sdk-js/commit/96562b97c3687e5494dac0708648779db8944bc8)
- Removed console.log statements [`a2a126a`](https://github.com/rudderlabs/rudder-sdk-js/commit/a2a126a3d5cf4d9e32fdb2aa90bee8cec4dcc74a)
- Removed console.log statements [`086fdca`](https://github.com/rudderlabs/rudder-sdk-js/commit/086fdcaaa907858952e529f3907c6db41b0127a8)
- Merged with origin/master [`6f66752`](https://github.com/rudderlabs/rudder-sdk-js/commit/6f667526a67418ba5cc6d65ed9fbc12a5fc78011)
- change for empty input clean up [`558c066`](https://github.com/rudderlabs/rudder-sdk-js/commit/558c0668b70bd2390df879ab4671e22be49fefbd)
- change for empty input [`5744823`](https://github.com/rudderlabs/rudder-sdk-js/commit/5744823a8947638af8096f4a58406e1467471cf4)
- explicit association [`8ae1c8c`](https://github.com/rudderlabs/rudder-sdk-js/commit/8ae1c8c6fca43d00195c2dac194c6dcbd46df3cc)
- add google adsense script [`e4de8fc`](https://github.com/rudderlabs/rudder-sdk-js/commit/e4de8fcf57258ad75736d266ee7e50b578bc7055)
- unique anonId and adblock request [`9e33e85`](https://github.com/rudderlabs/rudder-sdk-js/commit/9e33e85d9d6877b30f4bb0b223acd96411efb60e)
- AllowLinker must be false by default [`e9d2db0`](https://github.com/rudderlabs/rudder-sdk-js/commit/e9d2db07f62c6377513bd8775104b02db2dc3dba)
- added empty page call handling [`b9a93c3`](https://github.com/rudderlabs/rudder-sdk-js/commit/b9a93c39325b7c8d380039175b04e3fc8e024745)
- Set allowLinker to true [`bc3cb6c`](https://github.com/rudderlabs/rudder-sdk-js/commit/bc3cb6c74f0091f6cba0d0352cd531a146b434ba)
- change for empty input [`8c98432`](https://github.com/rudderlabs/rudder-sdk-js/commit/8c98432ae49b191768eb102524470c25f4c35741)
- Updated Facebook Pixel settings [`f480af1`](https://github.com/rudderlabs/rudder-sdk-js/commit/f480af1a60a4e8fb924bf73a40ff921b7dff93fc)
- code clean up [`069ea8d`](https://github.com/rudderlabs/rudder-sdk-js/commit/069ea8d034f9ae22b3d9c17f59cf8ddef52bf9ea)
- Code cleanups [`efa6b53`](https://github.com/rudderlabs/rudder-sdk-js/commit/efa6b5348196d438a82f811be90368bb89cf1718)
- if currency not present made default usd [`9e0a375`](https://github.com/rudderlabs/rudder-sdk-js/commit/9e0a375f55b90bc85ee42e5930b98e2322724155)
- added advancemapping for identify call [`6acc32a`](https://github.com/rudderlabs/rudder-sdk-js/commit/6acc32a0af3a41cca3d37851f7ac37a844992e13)
- chacking substring [`ca8cd92`](https://github.com/rudderlabs/rudder-sdk-js/commit/ca8cd923147e7aa053cac4da73639feaa1c3c9f6)
- change props in adblock page call [`b1e0cdb`](https://github.com/rudderlabs/rudder-sdk-js/commit/b1e0cdbab34309e15f4c74422fc34ea6fe57925f)
- test-adblock [`97bf2a5`](https://github.com/rudderlabs/rudder-sdk-js/commit/97bf2a537a05c66b30326edef13ca6d0f1061137)
- Read userId from cookie, only set on GA if user non anonymous [`101367f`](https://github.com/rudderlabs/rudder-sdk-js/commit/101367f57ee5611d5a32a754e9392b070efedaf5)
- Fix userId tracking in GA + configure allowLinker [`039242e`](https://github.com/rudderlabs/rudder-sdk-js/commit/039242e9158a1e2f68fb6e3a4273a7ed72326ae9)
- updated ecommerce events [`19072a1`](https://github.com/rudderlabs/rudder-sdk-js/commit/19072a16ac499e9aa796aa6bd82a33e6194bf791)
- add version in path [`d8f53c7`](https://github.com/rudderlabs/rudder-sdk-js/commit/d8f53c7f3ffa741ba70fa1a917ff1b0c70a120e8)
- Update dist files [`01fcbf2`](https://github.com/rudderlabs/rudder-sdk-js/commit/01fcbf25075fbddb543a67461494219172119277)
- add tracker name [`5487657`](https://github.com/rudderlabs/rudder-sdk-js/commit/5487657f31eb5883c21656accf0466d6781f5dd7)
- add fields for easier validation [`2225673`](https://github.com/rudderlabs/rudder-sdk-js/commit/2225673675dcbb73c1e2922afb5f6db77cd530bc)
