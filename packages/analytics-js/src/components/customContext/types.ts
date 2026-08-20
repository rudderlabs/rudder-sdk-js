type CustomContextValue = string | number | boolean | Date | CustomContext | CustomContextValue[];

interface CustomContext {
  [key: string]: CustomContextValue;
}

type UnknownContext = Record<string, unknown>;

type CustomContextSnapshot = CustomContext;

export type { CustomContext, CustomContextSnapshot, CustomContextValue, UnknownContext };
