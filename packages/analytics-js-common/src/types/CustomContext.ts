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

export type InputCustomContextValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | InputCustomContext
  | InputCustomContextValue[];

export interface InputCustomContext {
  [key: string]: InputCustomContextValue;
}
