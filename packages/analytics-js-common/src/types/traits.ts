import type { ApiObject } from './ApiObject';

type Address = {
  city?: string;
  City?: string;
  country?: string;
  Country?: string;
  postalCode?: string;
  state?: string;
  State?: string;
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
  userId?: string;
  firstName?: string;
  firstname?: string;
  first_name?: string;
  lastName?: string;
  lastname?: string;
  last_name?: string;
  name?: string;
  Name?: string;
  age?: number;
  email?: string;
  Email?: string;
  'E-mail'?: string;
  phone?: string;
  address?: string | Address;
  birthday?: string;
  company?: Company;
  createdAt?: string;
  description?: string;
  gender?: string;
  title?: string;
  username?: string;
  website?: string;
  avatar?: string;
  zip?: string | number;
  state?: string;
  State?: string;
  dob?: string;
  employed?: string | boolean;
  education?: string;
  married?: string | boolean;
  customerType?: string | number;
  euConsent?: string;
  euConsentMessage?: string;
  newEmail?: string;
  tags?: string | string[];
  removeTags?: string | string[];
  prospect?: string | boolean;
  doubleOptin?: string | boolean;
  event_id?: string;
  constructor?: Record<string, string>;
  organization?: string;
  region?: string;
  anonymous?: string | boolean;
  country?: string;
  custom?: string;
  ip?: string;
  privateAttributeNames?: any;
  secondary?: any;
  customPageId?: string;
  isRudderEvents?: boolean;
  optOutType?: boolean | string | number;
  groupType?: string | number;
  anonymousId?: string | number;
  ip_address?: string;
  number?: string | number;
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | null
    | (string | number | boolean | null | ApiObject)[]
    | undefined;
};
