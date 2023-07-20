/**
 * Represents a generic object in the APIs
 * Use for parameters like properties, traits etc.
 */
export type ApiObject = {
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | null
    | (string | number | boolean | null | ApiObject)[]
    | undefined;
};
