import { signal } from '@preact/signals-core';
import type { AutoTrackState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const autoTrackState: AutoTrackState = {
  pageLifecycle: {
    visitId: signal(undefined),
    pageLoadedTimestamp: signal(undefined),
  },
};

export { autoTrackState };
