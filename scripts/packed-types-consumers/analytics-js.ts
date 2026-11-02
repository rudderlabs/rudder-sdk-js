// Appended to the packed-types consumer modules by scripts/check-packed-types.mjs
import { RudderAnalytics as PackedRudderAnalytics } from '@rudderstack/analytics-js';

// The global type must accept the SDK instance from whichever module format the consumer loads
window.rudderanalytics = new PackedRudderAnalytics();
window.rudderanalytics?.load('writeKey', 'https://dataplane.example.com', {
  vendorSdkVersionPolicy: 'strict',
  integrations: { All: false, GA4: true },
});

window.rudderanalytics?.load('writeKey', 'https://dataplane.example.com', {
  // @ts-expect-error only strict is a public load policy
  vendorSdkVersionPolicy: 'floating',
});
window.rudderanalytics?.load('writeKey', 'https://dataplane.example.com', {
  // @ts-expect-error All must remain boolean for cloud-mode event routing
  integrations: { All: { vendorSdkVersionPolicy: 'strict' } },
});
// @ts-expect-error vendor SDK policy is load-only
window.rudderanalytics?.consent({ vendorSdkVersionPolicy: 'strict' });

// @ts-expect-error window.rudderanalytics must stay typed, not any
const packedNotAny: number = window.rudderanalytics;
void packedNotAny;
