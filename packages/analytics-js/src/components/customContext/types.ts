import type {
  CustomContext,
  CustomContextValue,
} from '@rudderstack/analytics-js-common/types/CustomContext';

type UnknownContext = Record<string, unknown>;

type CustomContextSnapshot = CustomContext;

export type { CustomContext, CustomContextSnapshot, CustomContextValue, UnknownContext };
