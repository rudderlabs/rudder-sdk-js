export type IubendaConsentCookieData = {
  timestamp: string; // ISO 8601 format date string
  version: string; // Version number in string format
  purposes: IubendaConsentData; // Object holding purpose consent data
  id: number; // Unique ID number
  cons: Consent; // Additional consent details
};

export type IubendaConsentData = {
  [purposeId: string]: boolean;
};

export type Consent = {
  rand: string; // A random string associated with consent
};
