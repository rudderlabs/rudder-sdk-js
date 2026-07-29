import type {
  CustomContext,
  CustomContextValue,
} from '@rudderstack/analytics-js-common/types/CustomContext';

type CustomContextDeletionPath = string[];

type UnknownContext = Record<string, unknown>;

type PreparedCustomContextUpdate = {
  context: CustomContext;
  deletionPaths: CustomContextDeletionPath[];
};

type CustomContextSnapshot = CustomContext;

export type {
  CustomContext,
  CustomContextDeletionPath,
  CustomContextSnapshot,
  CustomContextValue,
  PreparedCustomContextUpdate,
  UnknownContext,
};
