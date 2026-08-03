# Amplitude Guides & Surveys with the RudderStack CDN

This Vite and TypeScript sample demonstrates how to add Amplitude Guides & Surveys to the Amplitude
Browser SDK v2 instance initialized by a RudderStack device-mode destination.

The app presents a small product-adoption journey instead of a synthetic test screen. Its actions
send `page` and `track` calls through RudderStack so they can be used as targeting signals for
Guides & Surveys content configured in Amplitude.

## Prerequisites

Create or use a RudderStack JavaScript source with an Amplitude destination configured as follows:

- Connection mode: **Device mode**
- Amplitude Browser SDK version: **v2**
- Replace device ID with anonymous ID: **Disabled** when preserving Amplitude's native device ID
- API key: The same client-side key used by the Engagement bundle

Do not initialize a second Amplitude Analytics instance. In particular, do not add another
`amplitude.init()`, `engagement.init()`, or `engagement.boot()` call.

## Run the app

Install the dependencies and create a local environment file:

```sh
npm install
cp .env.example .env
```

Complete `.env` with the source and destination values:

```text
VITE_RUDDERSTACK_WRITE_KEY=YOUR_WRITE_KEY
VITE_RUDDERSTACK_DATA_PLANE_URL=https://YOUR_DATA_PLANE_URL
VITE_RUDDERSTACK_CONFIG_URL=https://api.rudderstack.com
VITE_AMPLITUDE_API_KEY=YOUR_AMPLITUDE_API_KEY
```

Then start Vite:

```sh
npm run dev
```

Open the local URL printed by Vite. Once the integrations are ready, use the three journey actions
to send events that can target Amplitude content.

## Integration sequence

RudderStack loads Amplitude Browser SDK v2 as a device-mode destination. Only after the
RudderStack ready callback fires does the sample load the project-specific Engagement bundle and
register its plugin:

```ts
rudderanalytics.ready(async () => {
  await loadScript(`https://cdn.amplitude.com/script/${AMPLITUDE_API_KEY}.engagement.js`);

  await amplitude.add(window.engagement.plugin()).promise;
});
```

The app's developer view reports the loaded SDK version, available targeted content, and Amplitude
identity before and after plugin registration. The machine-readable initialization result is also
available in the browser console:

```js
await window.__AMPLITUDE_GUIDES_SURVEYS_TEST__;
```

Guides and surveys still need to be created, published, and targeted to this user or these events in
the Amplitude project before content appears in the page.
