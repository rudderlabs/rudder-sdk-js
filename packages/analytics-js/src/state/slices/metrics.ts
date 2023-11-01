import { signal } from '@preact/signals-core';
import type { MetricsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const metricsState: MetricsState = {
  retries: signal(0),
  dropped: signal(0),
  sent: signal(0),
  queued: signal(0),
  triggered: signal(0),
};

export { metricsState };
