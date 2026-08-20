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
