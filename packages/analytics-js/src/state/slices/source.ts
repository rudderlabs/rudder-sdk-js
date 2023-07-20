import { signal } from '@preact/signals-core';
import { SourceConfigState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const sourceConfigState: SourceConfigState = signal(undefined);

export { sourceConfigState };
