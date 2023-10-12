import { signal } from '@preact/signals-core';
const metricsState = {
  retries: signal(0),
  dropped: signal(0),
  sent: signal(0),
  queued: signal(0),
  triggered: signal(0),
};
export { metricsState };
