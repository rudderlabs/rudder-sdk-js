import { ApiObject } from './ApiObject';

/**
 * Represents a traits object in the Identify API
 */
export type IdentifyTraits = {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  age?: number;
  email?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  company?: string;
  createdAt?: string;
  description?: string;
  gender?: string;
  title?: string;
  username?: string;
  website?: string;
  avatar?: string;
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | null
    | (string | number | boolean | null | ApiObject)[]
    | undefined;
};
