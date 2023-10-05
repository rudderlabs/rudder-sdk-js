import { ApiObject } from './ApiObject';

type Address = {
  city?: string;
  country?: string;
  postalCode?: string;
  state?: string;
  street?: string;
};

type Company = {
  name?: string;
  id?: string;
  industry?: string;
  employee_count?: string;
  plan?: string;
};

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
  address?: Address;
  birthday?: string;
  company?: Company;
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
