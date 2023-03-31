import { signal, Signal } from '@preact/signals-core';
import { Source } from '@rudderstack/analytics-js/state/types';

export type SourceConfigState = Signal<Source | undefined>;

const sourceConfigState: SourceConfigState = signal(undefined);

export { sourceConfigState };
