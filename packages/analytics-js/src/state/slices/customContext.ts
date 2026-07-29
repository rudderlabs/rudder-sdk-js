import { signal } from '@preact/signals-core';
import type { CustomContext } from '@rudderstack/analytics-js-common/types/CustomContext';
import type { CustomContextState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const customContextState: CustomContextState = signal<CustomContext>({});

export { customContextState };
