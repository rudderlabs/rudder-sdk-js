type CustomContextValue = string | number | boolean | Date | CustomContext | CustomContextValue[];

interface CustomContext {
  [key: string]: CustomContextValue;
}

type CustomContextDeletionPath = string[];

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
};
