## [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://rudderstack.com/">
    <img alt="RudderStack" width="512" src="https://raw.githubusercontent.com/rudderlabs/rudder-sdk-js/develop/assets/rs-logo-full-light.jpg">
  </a>
  <br />
  <caption>The Customer Data Platform for Developers</caption>
</p>
<p align="center">
  <b>
    <a href="https://rudderstack.com">Website</a>
    ·
    <a href="https://rudderstack.com/docs/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk/">Documentation</a>
    ·
    <a href="https://rudderstack.com/join-rudderstack-slack-community">Community Slack</a>
  </b>
</p>

---

# @rudderstack/analytics-js-cookies

[RudderStack JavaScript SDK](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/) utilities for cookies in browser and Node.js environments. Use the appropriate functions for your environment.

## APIs

### `getDecryptedValueBrowser`

> :warning: Only for browser environments

This function decrypts the provided encrypted RudderStack JavaScript cookie value using the RudderStack JavaScript SDK encryption version "v3".

> If the provided value is either not encrypted or not properly encrypted, the function returns `null`.

> :warning: Any errors during decryption are swallowed by the function, returning `null`.

```javascript
import { getDecryptedValueBrowser } from '@rudderstack/analytics-js-cookies';

const encryptedCookieValue = 'RS_ENC_v3_InRlc3QtZGF0YSI=';
const decryptedCookieValue = getDecryptedValueBrowser(encryptedCookieValue);
console.log('Decrypted Cookie Value: ', decryptedCookieValue);
// Output: 
// Decrypted Cookie Value: test-data
```

### `getDecryptedValue`

> :warning: Only for Node.js environments

This function decrypts the provided encrypted RudderStack JavaScript cookie value using the RudderStack JavaScript SDK encryption version "v3".

> If the provided value is either not encrypted or not properly encrypted, the function returns `null`.

> :warning: Any errors during decryption are swallowed by the function, returning `null`.

```javascript
import { getDecryptedValue } from '@rudderstack/analytics-js-cookies';

const encryptedCookieValue = 'RS_ENC_v3_InRlc3QtZGF0YSI=';
const decryptedCookieValue = getDecryptedValue(encryptedCookieValue);
console.log('Decrypted Cookie Value: ', decryptedCookieValue);
// Output: 
// Decrypted Cookie Value: test-data
```

### `getDecryptedCookieBrowser`

> :warning: Only for browser environments

This function takes the name of the RudderStack JavaScript SDK cookie and returns the decrypted value.

The return type is either a `string` or an `object` as some cookies like user ID, anonymous user ID have string values while user traits are objects.

It returns `null` in either of the following scenarios:

- If the cookie is not present.
- If the cookie is not properly encrypted.
  - It only decrypts the cookies that are created by the RudderStack JavaScript SDK encryption version "v3".
- If the decrypted cookie value is not a valid JSON string.
- If the provided cookie name is not a valid RudderStack JavaScript SDK cookie name.

> :warning: Any errors during decryption are swallowed by the function, returning `null`.

The following cookie keys are exported which can be used with this function:

- `userIdKey`: The key for the user ID cookie.
- `userTraitsKey`: The key for the user traits cookie.
- `anonymousUserIdKey`: The key for the anonymous user ID cookie.
- `groupIdKey`: The key for the group ID cookie.
- `groupTraitsKey`: The key for the group traits cookie.
- `pageInitialReferrerKey`: The key for the page initial referrer cookie.
- `pageInitialReferringDomainKey`: The key for the page initial referring domain cookie.
- `sessionInfoKey`: The key for the session ID cookie.
- `authTokenKey`: The key for the auth token cookie.

```javascript
import {
  getDecryptedCookieBrowser,
  anonymousUserIdKey,
  userTraitsKey,
} from '@rudderstack/analytics-js-cookies';

const anonymousId = getDecryptedCookieBrowser(anonymousUserIdKey);
console.log('Anonymous User ID: ', anonymousId);
// Output: 
// Anonymous User ID: 2c5b6d48-ea90-43a2-a2f6-457d27f90328

const userTraits = getDecryptedCookieBrowser(userTraitsKey);
console.log('User Traits: ', userTraits);
// Output: 
// User Traits: {"email":"abc@xyz.com","name":"John Doe"}

const invalidCookie = getDecryptedCookieBrowser('invalid-cookie-name');
console.log('Invalid Cookie: ', invalidCookie);
// Output: 
// Invalid Cookie: null
```

## Debugging

As all the above APIs swallow the errors, you can set the `debug` argument to `true` to log the errors.

```javascript
import { getDecryptedValue } from '@rudderstack/analytics-js-cookies';

const encryptedCookieValue = 'RS_ENC_v3_InRlc3QtZGF0YSI-some-random-data';

// Set the debug flag to true
const decryptedCookieValue = getDecryptedValue(encryptedCookieValue, true);
console.log('Decrypted Cookie Value: ', decryptedCookieValue);

// Output:
// Error occurred during decryption: Unexpected non-whitespace character after JSON at position 11
// Decrypted Cookie Value: null
```

## License

This project is licensed under the Elastic License 2.0. See the [LICENSE.md](LICENSE.md) file for details. Review the license terms to understand your permissions and restrictions.

If you have any questions about licensing, please [contact us](#contact-us) or refer to the [official Elastic licensing](https://www.elastic.co/licensing/elastic-license) page.

## Contribute

We invite you to contribute to this project. For more information on how to contribute, please see [**here**](../../CONTRIBUTING.md).

## Contact us

For more information on any of the sections covered in this readme, you can [**contact us**](mailto:%20docs@rudderstack.com) or start a conversation on our [**Slack**](https://resources.rudderstack.com/join-rudderstack-slack) channel.

## Follow Us

- [RudderStack Blog][rudderstack-blog]
- [Slack][slack]
- [Twitter][twitter]
- [LinkedIn][linkedin]
- [dev.to][devto]
- [Medium][medium]
- [YouTube][youtube]
- [HackerNews][hackernews]
- [Product Hunt][producthunt]

## :clap: Our Supporters

[![Stargazers repo roster for @rudderlabs/rudder-sdk-js](https://reporoster.com/stars/rudderlabs/rudder-sdk-js)](https://github.com/rudderlabs/rudder-sdk-js/stargazers)

[![Forkers repo roster for @rudderlabs/rudder-sdk-js](https://reporoster.com/forks/rudderlabs/rudder-sdk-js)](https://github.com/rudderlabs/rudder-sdk-js/network/members)

<!----variables---->

[rudderstack-blog]: https://rudderstack.com/blog/
[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[twitter]: https://twitter.com/rudderstack
[linkedin]: https://www.linkedin.com/company/rudderlabs/
[devto]: https://dev.to/rudderstack
[medium]: https://rudderstack.medium.com/
[youtube]: https://www.youtube.com/channel/UCgV-B77bV_-LOmKYHw8jvBw
[hackernews]: https://news.ycombinator.com/item?id=21081756
[producthunt]: https://www.producthunt.com/posts/rudderstack
