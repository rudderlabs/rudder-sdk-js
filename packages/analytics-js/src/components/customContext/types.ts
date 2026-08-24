import type { CustomContext } from '@rudderstack/analytics-js-common/types/CustomContext';

export type { CustomContextValue } from '@rudderstack/analytics-js-common/types/CustomContext';

type UnknownContext = Record<string, unknown>;

type CustomContextSnapshot = CustomContext;

export type { CustomContext, CustomContextSnapshot, UnknownContext };
