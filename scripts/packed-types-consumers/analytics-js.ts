// Appended to the packed-types consumer modules by scripts/check-packed-types.mjs
import { RudderAnalytics as PackedRudderAnalytics } from '@rudderstack/analytics-js';

// The global type must accept the SDK instance from whichever module format the consumer loads
window.rudderanalytics = new PackedRudderAnalytics();
window.rudderanalytics?.load('writeKey', 'https://dataplane.example.com');

// @ts-expect-error window.rudderanalytics must stay typed, not any
const packedNotAny: number = window.rudderanalytics;
void packedNotAny;

const policyAnalytics = new PackedRudderAnalytics();
policyAnalytics.load('writeKey', 'https://dataplane.example.com', {
  integrations: {
    All: { vendorSdkVersionPolicy: 'strict' },
    Bugsnag: { apiKey: 'key' },
  },
});
policyAnalytics.load('writeKey', 'https://dataplane.example.com', {
  integrations: { All: false, Bugsnag: true },
});
policyAnalytics.load('writeKey', 'https://dataplane.example.com', {
  integrations: {
    // @ts-expect-error only strict is supported
    All: { vendorSdkVersionPolicy: 'latest' },
    // @ts-expect-error policy values must be strict
    Bugsnag: { vendorSdkVersionPolicy: 1 },
  },
});

policyAnalytics.load('writeKey', 'https://dataplane.example.com', {
  integrations: {
    // @ts-expect-error pinned is the default, not a public option
    All: { vendorSdkVersionPolicy: 'pinned' },
  },
});
policyAnalytics.load('writeKey', 'https://dataplane.example.com', {
  integrations: {
    // @ts-expect-error floating is internal, not a public option
    All: { vendorSdkVersionPolicy: 'floating' },
  },
});
