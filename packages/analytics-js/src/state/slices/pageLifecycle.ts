import { signal } from '@preact/signals-core';
import type { PageLifecycleState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const pageLifecycleState: PageLifecycleState = {
  visitId: signal(undefined),
  pageLoadedTimestamp: signal(undefined),
};

export { pageLifecycleState };
