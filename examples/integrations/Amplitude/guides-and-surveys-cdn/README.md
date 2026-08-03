# Amplitude Guides & Surveys with RudderStack CDN

This self-testing page demonstrates the supported initialization order for Amplitude Guides &
Surveys with the RudderStack JavaScript SDK:

1. Load RudderStack from the production v3 CDN.
2. Let the Amplitude device-mode destination initialize Browser SDK v2.
3. Wait for `rudderanalytics.ready()`.
4. Load `API_KEY.engagement.js`.
5. Register `window.engagement.plugin()` with the existing `window.amplitude` instance.

The default test uses an in-page RudderStack source configuration, so it does not require a
RudderStack control-plane source or send RudderStack events. Pass an Amplitude client-side API key
in the page URL; the example uses it for both the device-mode destination and Engagement bundle.

## Run

From the repository root:

```sh
python3 -m http.server 4173 --directory examples/integrations/Amplitude/guides-and-surveys-cdn
```

Open the page with an Amplitude client-side API key:

```text
http://127.0.0.1:4173/?apiKey=YOUR_AMPLITUDE_API_KEY
```

The page verifies the CDN assets, plugin registration, and that the Amplitude device and user
identifiers do not change when the Engagement plugin is added.

The full machine-readable result is also available as:

```js
await window.__AMPLITUDE_GUIDES_SURVEYS_TEST__;
```

## Test with a real RudderStack source

Configure an Amplitude device-mode destination with Browser SDK v2 and the same Amplitude API key,
then pass the source details as query parameters:

```text
http://127.0.0.1:4173/?apiKey=YOUR_AMPLITUDE_API_KEY&writeKey=YOUR_WRITE_KEY&dataPlaneUrl=https%3A%2F%2FYOUR_DATA_PLANE_URL
```

When both parameters are present, the page fetches the real source configuration instead of using
the local test fixture. Keep **Replace device ID with anonymous ID** disabled when validating
identity continuity with an existing Amplitude Browser SDK device ID.
