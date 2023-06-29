import { signal } from '@preact/signals-core';
import { SourceConfigState } from '@rudderstack/common/types/ApplicationState';

const sourceConfigState: SourceConfigState = signal(undefined);

export { sourceConfigState };
