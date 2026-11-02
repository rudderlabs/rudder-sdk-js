// Appended to the packed-types consumer modules by scripts/check-packed-types.mjs
import { RudderAnalytics as PackedRudderAnalytics } from '@rudderstack/analytics-js';

// The global type must accept the SDK instance from whichever module format the consumer loads
window.rudderanalytics = new PackedRudderAnalytics();
window.rudderanalytics?.load('writeKey', 'https://dataplane.example.com');

// @ts-expect-error window.rudderanalytics must stay typed, not any
const packedNotAny: number = window.rudderanalytics;
void packedNotAny;
