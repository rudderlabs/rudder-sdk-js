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

RudderStack JavaScript SDK utility for cookies.

## APIs

### `getDecryptedCookie`

This function decrypts and returns the RudderStack JavaScript SDK cookie values.

The return type is either a `string` or an `object` as some cookies like user ID, anonymous user ID have string values while user traits are objects.

It returns `null` in either of the following scenarios:

- If the cookie is not present.
- If the cookie is not properly encrypted.
  - It only decrypts the cookies that are created by the RudderStack JavaScript SDK encryption version "v3".
- If the decrypted cookie value is not a valid JSON string.
- If the provided cookie name is not a valid RudderStack JavaScript SDK cookie name.

> If unencrypted, the cookie value will be returned as is.

> Any errors during decryption are swallowed by the function, returning `null`.

```javascript
import {
  getDecryptedCookie,
  anonymousUserIdKey,
  userTraitsKey,
} from '@rudderstack/analytics-js-cookies';

const anonymousId = getDecryptedCookie(anonymousUserIdKey);
console.log('Anonymous User ID: ', anonymousId);
// Output: Anonymous User ID: 2c5b6d48-ea90-43a2-a2f6-457d27f90328

const userTraits = getDecryptedCookie(userTraitsKey);
console.log('User Traits: ', userTraits);
// Output: User Traits: {"email":"abc@xyz.com","name":"John Doe"}

const invalidCookie = getDecryptedCookie('invalid-cookie-name');
console.log('Invalid Cookie: ', invalidCookie);
// Output: Invalid Cookie: null
```

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).
