import { signal, Signal } from '@preact/signals-core';

// TODO: define the metrics that we need to track
export type MetricsState = {
  retries: Signal<number>;
  dropped: Signal<number>;
  sent: Signal<number>;
  queued: Signal<number>;
  triggered: Signal<number>;
};

const metricsState: MetricsState = {
  retries: signal(0),
  dropped: signal(0),
  sent: signal(0),
  queued: signal(0),
  triggered: signal(0),
};

export { metricsState };
