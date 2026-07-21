type CustomContextValue = string | number | boolean | CustomContext | CustomContextValue[];

interface CustomContext {
  [key: string]: CustomContextValue;
}

type CustomContextDeletionPath = string[];

type PreparedCustomContextUpdate = {
  context: CustomContext;
  deletionPaths: CustomContextDeletionPath[];
};

type CustomContextSnapshotProvider = () => CustomContext;

export type {
  CustomContext,
  CustomContextDeletionPath,
  CustomContextSnapshotProvider,
  CustomContextValue,
  PreparedCustomContextUpdate,
};
