import { signal } from '@preact/signals-core';
import type { CustomIntegrationsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const customIntegrationsState: CustomIntegrationsState = signal([]);

export { customIntegrationsState };
