# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.21.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.20.0...@rudderstack/analytics-js-common@3.21.0) (2025-06-20)


### Features

* **analytics-js:** reduce error noise from CSP/adblocker ([#2296](https://github.com/rudderlabs/rudder-sdk-js/issues/2296)) ([c187816](https://github.com/rudderlabs/rudder-sdk-js/commit/c187816b2cfafb706670824001140e464e3d90d8))

## [3.20.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.19.0...@rudderstack/analytics-js-common@3.20.0) (2025-06-11)


### Features

* add support to dynamically override destinations status ([#2266](https://github.com/rudderlabs/rudder-sdk-js/issues/2266)) ([5af2f22](https://github.com/rudderlabs/rudder-sdk-js/commit/5af2f22ebdcac4eb04d57ecb51efa427607bc849))
* dynamically clone destinations ([#2276](https://github.com/rudderlabs/rudder-sdk-js/issues/2276)) ([f136454](https://github.com/rudderlabs/rudder-sdk-js/commit/f1364541743b15d240ceed6d8f403c23b6984086))
* enhance retry headers with RSA-prefixed naming ([#2279](https://github.com/rudderlabs/rudder-sdk-js/issues/2279)) ([c25b2bc](https://github.com/rudderlabs/rudder-sdk-js/commit/c25b2bc5bb4b5b41469065138eef88c2fa21a460))
* set proper grouping hash for all errors ([#2246](https://github.com/rudderlabs/rudder-sdk-js/issues/2246)) ([430c497](https://github.com/rudderlabs/rudder-sdk-js/commit/430c49782b95bf3e8de1f6a62b442b363208a66b))

## [3.19.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.18.0...@rudderstack/analytics-js-common@3.19.0) (2025-05-09)


### Features

* add new event mapping for tik tok ([#2210](https://github.com/rudderlabs/rudder-sdk-js/issues/2210)) ([1a4bf9d](https://github.com/rudderlabs/rudder-sdk-js/commit/1a4bf9d488d54dc22b322b271e4a22ccb510bd12))
* group errors by message ([#2229](https://github.com/rudderlabs/rudder-sdk-js/issues/2229)) ([b448874](https://github.com/rudderlabs/rudder-sdk-js/commit/b448874fc39972576ebaf4d30f0bbd4883f69b7e))
* onboarding userpilot integration ([#2103](https://github.com/rudderlabs/rudder-sdk-js/issues/2103)) ([9065069](https://github.com/rudderlabs/rudder-sdk-js/commit/90650693cd477ff3987174f8f6ec5972b034f2cb))
* user session cut off ([#2209](https://github.com/rudderlabs/rudder-sdk-js/issues/2209)) ([8b7bcfd](https://github.com/rudderlabs/rudder-sdk-js/commit/8b7bcfd70155beb6f162a3b8ceec5735b67cce10))


### Bug Fixes

* load api options boolean inputs normalization ([#2236](https://github.com/rudderlabs/rudder-sdk-js/issues/2236)) ([4c3532c](https://github.com/rudderlabs/rudder-sdk-js/commit/4c3532c9b9e34903c2f975d95cfa516324bbee04))

## [3.18.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.17.2...@rudderstack/analytics-js-common@3.18.0) (2025-04-25)


### Features

* remove page loaded event ([#2088](https://github.com/rudderlabs/rudder-sdk-js/issues/2088)) ([ec1d604](https://github.com/rudderlabs/rudder-sdk-js/commit/ec1d604f70d4e476a751f5207df09eef69220be2))


### Bug Fixes

* recursively migrate persisted entries ([#2187](https://github.com/rudderlabs/rudder-sdk-js/issues/2187)) ([3dd07ea](https://github.com/rudderlabs/rudder-sdk-js/commit/3dd07ea1bde4655124fc02850a022bcb550b8c07))
* rename view id to visit id ([#2086](https://github.com/rudderlabs/rudder-sdk-js/issues/2086)) ([51c8dd9](https://github.com/rudderlabs/rudder-sdk-js/commit/51c8dd94b2e25f42a116cb72d209d41729c165c0))

## [3.17.2](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.17.1...@rudderstack/analytics-js-common@3.17.2) (2025-03-03)


### Bug Fixes

* avoid premature execution before sdk initialization ([#2056](https://github.com/rudderlabs/rudder-sdk-js/issues/2056)) ([9c7e2a6](https://github.com/rudderlabs/rudder-sdk-js/commit/9c7e2a6011e34ec2cd20925c1f8d79427297263a))
* handle edge cases in retry queue ([#2074](https://github.com/rudderlabs/rudder-sdk-js/issues/2074)) ([f9263b2](https://github.com/rudderlabs/rudder-sdk-js/commit/f9263b24170680023dfa1687c778b97557ef5e1b))

## [3.17.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.17.0...@rudderstack/analytics-js-common@3.17.1) (2025-02-20)


### Bug Fixes

* replace vulnerable package with custom implementation ([#2046](https://github.com/rudderlabs/rudder-sdk-js/issues/2046)) ([9199de2](https://github.com/rudderlabs/rudder-sdk-js/commit/9199de2b855169376802a318a7a21d1c503fc62f))
* retry status code logic and error messages ([#2050](https://github.com/rudderlabs/rudder-sdk-js/issues/2050)) ([28fd410](https://github.com/rudderlabs/rudder-sdk-js/commit/28fd410f90fe2c0e5c9071d7151ac2e297340573))

## [3.17.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.16.0...@rudderstack/analytics-js-common@3.17.0) (2025-02-17)


### Features

* avoid reporting non-actionable errors ([#2041](https://github.com/rudderlabs/rudder-sdk-js/issues/2041)) ([60345fb](https://github.com/rudderlabs/rudder-sdk-js/commit/60345fb604109e509f9cd4eb45f76ebd3c756fc2))


### Bug Fixes

* set default log level to warn ([#2039](https://github.com/rudderlabs/rudder-sdk-js/issues/2039)) ([f5387e0](https://github.com/rudderlabs/rudder-sdk-js/commit/f5387e0a9aeb0940e07a6a60d25c8df146153bea))

## [3.16.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.15.0...@rudderstack/analytics-js-common@3.16.0) (2025-01-31)


### Features

* move error reporting functionality to the core module ([#2011](https://github.com/rudderlabs/rudder-sdk-js/issues/2011)) ([78c50c7](https://github.com/rudderlabs/rudder-sdk-js/commit/78c50c7a6e4169560f3182be93148f4512d313ca)), closes [#2001](https://github.com/rudderlabs/rudder-sdk-js/issues/2001) [#2002](https://github.com/rudderlabs/rudder-sdk-js/issues/2002) [#2005](https://github.com/rudderlabs/rudder-sdk-js/issues/2005) [#2006](https://github.com/rudderlabs/rudder-sdk-js/issues/2006) [#2007](https://github.com/rudderlabs/rudder-sdk-js/issues/2007)

## [3.15.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.15...@rudderstack/analytics-js-common@3.15.0) (2025-01-24)


### Features

* lock plugins and integrations version by default ([#1956](https://github.com/rudderlabs/rudder-sdk-js/issues/1956)) ([45e716e](https://github.com/rudderlabs/rudder-sdk-js/commit/45e716e6df3d6e665c25aa907531adb746961d50))

## [3.14.15](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.14...@rudderstack/analytics-js-common@3.14.15) (2025-01-03)


### Bug Fixes

* update destination constants ([#1968](https://github.com/rudderlabs/rudder-sdk-js/issues/1968)) ([fbd3b3f](https://github.com/rudderlabs/rudder-sdk-js/commit/fbd3b3fd82441f50092326765c58bfdacd314876))

## [3.14.14](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.13...@rudderstack/analytics-js-common@3.14.14) (2024-12-17)


### Bug Fixes

* remove circular dependency in packages ([#1973](https://github.com/rudderlabs/rudder-sdk-js/issues/1973)) ([e525496](https://github.com/rudderlabs/rudder-sdk-js/commit/e5254964310c2c73baaf4d0655c3e4025c5e7d2b))

## [3.14.13](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.12...@rudderstack/analytics-js-common@3.14.13) (2024-12-06)


### Bug Fixes

* integration constants file type ([#1958](https://github.com/rudderlabs/rudder-sdk-js/issues/1958)) ([e0f6ff2](https://github.com/rudderlabs/rudder-sdk-js/commit/e0f6ff28f3b02d56e862e01d308653e2178eec43))

## [3.14.12](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.11...@rudderstack/analytics-js-common@3.14.12) (2024-11-22)


### Bug Fixes

* revert temp utility ([2f60cae](https://github.com/rudderlabs/rudder-sdk-js/commit/2f60caeea0dc9944bf9434d5981952c8e85eef38))

## [3.14.11](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.10...@rudderstack/analytics-js-common@3.14.11) (2024-11-22)


### Bug Fixes

* add extra temporary import for testing ([a865344](https://github.com/rudderlabs/rudder-sdk-js/commit/a8653447fea5913421ab9c9cb36fd66611f68657))
* undefined property ([db84fda](https://github.com/rudderlabs/rudder-sdk-js/commit/db84fda21fb6a21a4c19c085e9214fa2ee2cff0f))

## [3.14.10](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.9...@rudderstack/analytics-js-common@3.14.10) (2024-11-22)


### Bug Fixes

* restore data sanitization changes but avoid using api overloads ([d0913ae](https://github.com/rudderlabs/rudder-sdk-js/commit/d0913ae32a8c63def26c081c7570a9960dcd1ebf))

## [3.14.9](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.8...@rudderstack/analytics-js-common@3.14.9) (2024-11-22)


### Bug Fixes

* restore data sanitization changes ([2a13e7c](https://github.com/rudderlabs/rudder-sdk-js/commit/2a13e7c463b2d480f6d9a23f32abe4e56f6557d4))

## [3.14.8](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.7...@rudderstack/analytics-js-common@3.14.8) (2024-11-22)


### Bug Fixes

* sanitize data directly in plugins ([d8cc780](https://github.com/rudderlabs/rudder-sdk-js/commit/d8cc7808e21baeb26782596efb542713bd38a09f))

## [3.14.7](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.6...@rudderstack/analytics-js-common@3.14.7) (2024-11-21)


### Bug Fixes

* restore event api overloads changes ([ebb1f7c](https://github.com/rudderlabs/rudder-sdk-js/commit/ebb1f7ca924972993e2da25036ae994f24c229dd))

## [3.14.6](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.5...@rudderstack/analytics-js-common@3.14.6) (2024-11-21)


### Bug Fixes

* use utility in a different method ([4b9e0cc](https://github.com/rudderlabs/rudder-sdk-js/commit/4b9e0ccd85ef33c00e41072a10a7e27b479c3c43))

## [3.14.5](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.4...@rudderstack/analytics-js-common@3.14.5) (2024-11-21)


### Bug Fixes

* remove replacer ([e42ba9f](https://github.com/rudderlabs/rudder-sdk-js/commit/e42ba9f92b2d021f27ac2dc300624db6e029ff0e))

## [3.14.4](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.3...@rudderstack/analytics-js-common@3.14.4) (2024-11-21)


### Bug Fixes

* remove recursive traversal ([26f2468](https://github.com/rudderlabs/rudder-sdk-js/commit/26f2468510050885b159704ad06d28b69d582340))

## [3.14.3](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.2...@rudderstack/analytics-js-common@3.14.3) (2024-11-21)


### Bug Fixes

* revert api sanitization ([4e5a1ce](https://github.com/rudderlabs/rudder-sdk-js/commit/4e5a1ce9326f946d05c9250740244d8fcea23115))
* sanitize api inputs ([ad9ed2b](https://github.com/rudderlabs/rudder-sdk-js/commit/ad9ed2b1eab60960aea333a8da93af06d21ce25b))

## [3.14.2](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.1...@rudderstack/analytics-js-common@3.14.2) (2024-11-21)


### Bug Fixes

* avoid using 'this' and prevent cache ([ab60ea4](https://github.com/rudderlabs/rudder-sdk-js/commit/ab60ea4a047c676fa774bb7ec9fdb1dbcc5ecf77))

## [3.14.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.14.0...@rudderstack/analytics-js-common@3.14.1) (2024-11-19)


### Bug Fixes

* don't sanitize event method overload inputs ([b819d61](https://github.com/rudderlabs/rudder-sdk-js/commit/b819d61ea278c2f553c63495ecf5bd0305550dfe))

## [3.14.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.13.0...@rudderstack/analytics-js-common@3.14.0) (2024-11-18)


### Features

* error handle public apis ([295793a](https://github.com/rudderlabs/rudder-sdk-js/commit/295793a2cc60172b001c3fb1bc2624bb19fa8546))

## [3.13.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.12.1...@rudderstack/analytics-js-common@3.13.0) (2024-11-18)


### Features

* add more utilities ([7bd0cc9](https://github.com/rudderlabs/rudder-sdk-js/commit/7bd0cc98d5de1e9c20aaee4400263da12f2943d1))

## [3.12.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.12.0...@rudderstack/analytics-js-common@3.12.1) (2024-11-12)


### Bug Fixes

* revert sanitization changes ([#1916](https://github.com/rudderlabs/rudder-sdk-js/issues/1916)) ([890fb7b](https://github.com/rudderlabs/rudder-sdk-js/commit/890fb7b615535992290f5008b93d77b540c03955)), closes [#1907](https://github.com/rudderlabs/rudder-sdk-js/issues/1907) [#1902](https://github.com/rudderlabs/rudder-sdk-js/issues/1902)

## [3.12.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.11.1...@rudderstack/analytics-js-common@3.12.0) (2024-11-08)


### Features

* add error handling to all public apis ([#1907](https://github.com/rudderlabs/rudder-sdk-js/issues/1907)) ([9fbaf81](https://github.com/rudderlabs/rudder-sdk-js/commit/9fbaf819bb02320d2f8ae82a869ad2b85090ea34))
* sanitize input data ([#1902](https://github.com/rudderlabs/rudder-sdk-js/issues/1902)) ([b71c44a](https://github.com/rudderlabs/rudder-sdk-js/commit/b71c44ae61f6c35cadc6523b918e1a574e32bc23))

## [3.11.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.11.0...@rudderstack/analytics-js-common@3.11.1) (2024-11-07)


### Bug Fixes

* fixing display name issues ([#1909](https://github.com/rudderlabs/rudder-sdk-js/issues/1909)) ([633d887](https://github.com/rudderlabs/rudder-sdk-js/commit/633d8873a2e3c660573681608acf8ba5c431be3d))
* move page visit id to context ([#1904](https://github.com/rudderlabs/rudder-sdk-js/issues/1904)) ([76bbd16](https://github.com/rudderlabs/rudder-sdk-js/commit/76bbd16bd764baa00df2995fa9fb287800fd68d3))

## [3.11.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.10.0...@rudderstack/analytics-js-common@3.11.0) (2024-10-25)


### Features

* gainsight PX destination ([#1852](https://github.com/rudderlabs/rudder-sdk-js/issues/1852)) ([#1889](https://github.com/rudderlabs/rudder-sdk-js/issues/1889)) ([3a705f0](https://github.com/rudderlabs/rudder-sdk-js/commit/3a705f063bcae99c7964495ff83ad9ce8d4eb5a3))
* track time spent on a page ([#1876](https://github.com/rudderlabs/rudder-sdk-js/issues/1876)) ([5590af7](https://github.com/rudderlabs/rudder-sdk-js/commit/5590af712dd951ce9182c06d8042794c4fe6df2f))

## [3.10.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.9.5...@rudderstack/analytics-js-common@3.10.0) (2024-10-21)


### Features

* iubenda consent manager plugin ([#1809](https://github.com/rudderlabs/rudder-sdk-js/issues/1809)) ([7ea300c](https://github.com/rudderlabs/rudder-sdk-js/commit/7ea300c61ead9cc094c3f1985e0ef3165b0fcb59))

## [3.9.5](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.9.4...@rudderstack/analytics-js-common@3.9.5) (2024-10-18)


### Bug Fixes

* add xpixel missing name mapping ([#1895](https://github.com/rudderlabs/rudder-sdk-js/issues/1895)) ([0800f36](https://github.com/rudderlabs/rudder-sdk-js/commit/0800f361b6a9b9866ba47d9a393cf7c2063b3815))

## [3.9.4](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.9.3...@rudderstack/analytics-js-common@3.9.4) (2024-10-17)


### Bug Fixes

* renamed june destination display name ([324ba5d](https://github.com/rudderlabs/rudder-sdk-js/commit/324ba5d87184215cd1699fac66dff7ab79acc88a))

## [3.9.3](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.9.2...@rudderstack/analytics-js-common@3.9.3) (2024-09-27)


### Bug Fixes

* upgrade all packages to latest to fix vulnerabilities ([#1867](https://github.com/rudderlabs/rudder-sdk-js/issues/1867)) ([389348c](https://github.com/rudderlabs/rudder-sdk-js/commit/389348cfa61f2111c5ac4f9e2bad5851a466484d))

## [3.9.2](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.9.1...@rudderstack/analytics-js-common@3.9.2) (2024-09-12)


### Bug Fixes

* gracefully handle cross sdk version cookies and warn ([#1847](https://github.com/rudderlabs/rudder-sdk-js/issues/1847)) ([408a838](https://github.com/rudderlabs/rudder-sdk-js/commit/408a8389be845883c35045fdb61695db5414ad21))

## [3.9.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.9.0...@rudderstack/analytics-js-common@3.9.1) (2024-08-28)


### Bug Fixes

* handle blur and focus events to detect page leave ([#1837](https://github.com/rudderlabs/rudder-sdk-js/issues/1837)) ([57e735c](https://github.com/rudderlabs/rudder-sdk-js/commit/57e735ced4fb51ec895fbb196b1b879996cc10dd))

## [3.9.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.8.1...@rudderstack/analytics-js-common@3.9.0) (2024-08-16)


### Features

* onboarded XPixel Integration ([#1783](https://github.com/rudderlabs/rudder-sdk-js/issues/1783)) ([cf9b8cc](https://github.com/rudderlabs/rudder-sdk-js/commit/cf9b8cc41de341be781fae3108e4a07f2b553dda))

## [3.8.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.8.0...@rudderstack/analytics-js-common@3.8.1) (2024-08-02)


### Bug Fixes

* error filtering of non-errors ([#1811](https://github.com/rudderlabs/rudder-sdk-js/issues/1811)) ([7b83e16](https://github.com/rudderlabs/rudder-sdk-js/commit/7b83e1661b1e0ce0b6b5ae45d3a2e08db97ddcb3))
* npm sanity suites ([#1810](https://github.com/rudderlabs/rudder-sdk-js/issues/1810)) ([22e43da](https://github.com/rudderlabs/rudder-sdk-js/commit/22e43da01f750a5cb23a2fce50de3744c54a197e))

## [3.8.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.7.0...@rudderstack/analytics-js-common@3.8.0) (2024-07-24)


### Features

* **analytics-js-integrations:** onboard ga4 v2 hybrid mode ([#1802](https://github.com/rudderlabs/rudder-sdk-js/issues/1802)) ([2c8c3be](https://github.com/rudderlabs/rudder-sdk-js/commit/2c8c3bea8ada300c62729eb114dbe8ff84ae9269))

## [3.7.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.6.1...@rudderstack/analytics-js-common@3.7.0) (2024-07-19)


### Features

* error reporting plugin ([#1601](https://github.com/rudderlabs/rudder-sdk-js/issues/1601)) ([1f2629e](https://github.com/rudderlabs/rudder-sdk-js/commit/1f2629e594740763ce9bd54a21213b92d80ae085))


### Bug Fixes

* event API overloads ([#1782](https://github.com/rudderlabs/rudder-sdk-js/issues/1782)) ([02c5b47](https://github.com/rudderlabs/rudder-sdk-js/commit/02c5b47d0a83250fb5180e9ed467a92361663dab))

## [3.6.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.6.0...@rudderstack/analytics-js-common@3.6.1) (2024-07-05)


### Bug Fixes

* package lint issues ([#1773](https://github.com/rudderlabs/rudder-sdk-js/issues/1773)) ([8e45d05](https://github.com/rudderlabs/rudder-sdk-js/commit/8e45d052bd6366d647d06226aa89b1fa2e512f9d))

## [3.6.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.5.0...@rudderstack/analytics-js-common@3.6.0) (2024-07-04)


### Features

* update itp implementation based on load options ([#1777](https://github.com/rudderlabs/rudder-sdk-js/issues/1777)) ([75aa117](https://github.com/rudderlabs/rudder-sdk-js/commit/75aa117911b1811b21576c95d2692d7f8580176c))

## [3.5.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.4.0...@rudderstack/analytics-js-common@3.5.0) (2024-06-21)


### Features

* add the ability to lock plugins version ([#1749](https://github.com/rudderlabs/rudder-sdk-js/issues/1749)) ([e2e1620](https://github.com/rudderlabs/rudder-sdk-js/commit/e2e1620677c90169fca35ed3e9057ced3b88a299))


### Bug Fixes

* improve flushing events on page leave ([#1754](https://github.com/rudderlabs/rudder-sdk-js/issues/1754)) ([1be420f](https://github.com/rudderlabs/rudder-sdk-js/commit/1be420fae16b68629789d2ba37e16e6a6e00017c))
* remove data residency feature ([#1748](https://github.com/rudderlabs/rudder-sdk-js/issues/1748)) ([870a7ec](https://github.com/rudderlabs/rudder-sdk-js/commit/870a7ecf3cd251d88c207d9815c2f16c6e9a6883))

## [3.4.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.3.0...@rudderstack/analytics-js-common@3.4.0) (2024-06-07)


### Features

* add install type to context ([#1740](https://github.com/rudderlabs/rudder-sdk-js/issues/1740)) ([3d25b65](https://github.com/rudderlabs/rudder-sdk-js/commit/3d25b654a70b0f39c412e80465e29e2bdb578aa7))


### Bug Fixes

* handle cross domain server-side cookie requests ([#1741](https://github.com/rudderlabs/rudder-sdk-js/issues/1741)) ([68a2d3b](https://github.com/rudderlabs/rudder-sdk-js/commit/68a2d3b025a45311cc3639b140d33a9659e93e8f))
* improve sdk loading snippet ([#1745](https://github.com/rudderlabs/rudder-sdk-js/issues/1745)) ([d4e0f66](https://github.com/rudderlabs/rudder-sdk-js/commit/d4e0f663a4d0cdb55563ed380166d55e99cf3fc8))
* url validation ([#1730](https://github.com/rudderlabs/rudder-sdk-js/issues/1730)) ([3a3e105](https://github.com/rudderlabs/rudder-sdk-js/commit/3a3e1057f2db91ef5cbf652a664db9443fee9843))

## [3.3.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.2.0...@rudderstack/analytics-js-common@3.3.0) (2024-05-24)


### Features

* set server side cookies ([#1649](https://github.com/rudderlabs/rudder-sdk-js/issues/1649)) ([8b8ac8f](https://github.com/rudderlabs/rudder-sdk-js/commit/8b8ac8fb2b7fe0903fa383cfcd0388fe3022330c))

## [3.2.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.1.0...@rudderstack/analytics-js-common@3.2.0) (2024-04-26)


### Features

* supporting add to cart for criteo ([#1696](https://github.com/rudderlabs/rudder-sdk-js/issues/1696)) ([bb7e1df](https://github.com/rudderlabs/rudder-sdk-js/commit/bb7e1df9a1e5a1ffe4e8a81c3d9fdf18d9ef2744))
* warn users on missing plugins ([#1691](https://github.com/rudderlabs/rudder-sdk-js/issues/1691)) ([c57cf82](https://github.com/rudderlabs/rudder-sdk-js/commit/c57cf820346a7fede352f2f346db37ad51413cf8))

## [3.1.0](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.1...@rudderstack/analytics-js-common@3.1.0) (2024-03-22)


### Features

* add date type in apiobject and apioptions ([#1666](https://github.com/rudderlabs/rudder-sdk-js/issues/1666)) ([a1771e8](https://github.com/rudderlabs/rudder-sdk-js/commit/a1771e8015a38a1edc2a3c24dc700a5fa5b00796))


### Bug Fixes

* optimize localstorage transactions ([#1651](https://github.com/rudderlabs/rudder-sdk-js/issues/1651)) ([1289217](https://github.com/rudderlabs/rudder-sdk-js/commit/12892176578dd3628fded2311ea2548e3ff5802c))
* type issues ([#1663](https://github.com/rudderlabs/rudder-sdk-js/issues/1663)) ([1f114a1](https://github.com/rudderlabs/rudder-sdk-js/commit/1f114a19ac14ffd9af6ae876a54d4d19afd80d65))

## [3.0.1](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.19...@rudderstack/analytics-js-common@3.0.1) (2024-03-21)

## [3.0.0-beta.19](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.18...@rudderstack/analytics-js-common@3.0.0-beta.19) (2024-03-01)


### Features

* fetch anonymous id by cookie name provided in load option ([#1625](https://github.com/rudderlabs/rudder-sdk-js/issues/1625)) ([d8ccb10](https://github.com/rudderlabs/rudder-sdk-js/commit/d8ccb109f82398db8f53c51c0ac8f24cd1fd872e))
* onboard new destination ninetailed ([#1617](https://github.com/rudderlabs/rudder-sdk-js/issues/1617)) ([080155a](https://github.com/rudderlabs/rudder-sdk-js/commit/080155a74655aeb4b413cc1a90cfa6d66ce3dfbb))

## [3.0.0-beta.18](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.17...@rudderstack/analytics-js-common@3.0.0-beta.18) (2024-02-16)


### Features

* onboard new destination commandbar ([#1610](https://github.com/rudderlabs/rudder-sdk-js/issues/1610)) ([a034c21](https://github.com/rudderlabs/rudder-sdk-js/commit/a034c21929bd1d7bdc8c6d27d3f92b2d3c421ae3))

## [3.0.0-beta.17](https://github.com/rudderlabs/rudder-sdk-js/compare/@rudderstack/analytics-js-common@3.0.0-beta.16...@rudderstack/analytics-js-common@3.0.0-beta.17) (2024-02-02)

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
