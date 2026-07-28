export type CustomContextValue =
  | string
  | number
  | boolean
  | Date
  | CustomContext
  | CustomContextValue[];

export interface CustomContext {
  [key: string]: CustomContextValue;
}

export type CustomContextUpdateValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | CustomContextUpdate
  | CustomContextValue[];

export interface CustomContextUpdate {
  [key: string]: CustomContextUpdateValue;
}
