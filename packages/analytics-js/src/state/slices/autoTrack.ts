import { signal } from '@preact/signals-core';
import type { AutoTrackState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const autoTrackState: AutoTrackState = {
  enabled: signal(false),
  pageLifecycle: {
    enabled: signal(false),
    pageViewId: signal(undefined),
    pageLoadedTimestamp: signal(undefined),
  },
};

export { autoTrackState };
