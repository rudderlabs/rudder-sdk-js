export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type ConsentManagement = {
  deniedConsentIds: Consents;
};

export type CookieConsentOptions = {
  // OneTrust
  [key: string]: {
    enabled: boolean;
  };
};

export type ConsentProvider = 'oneTrust' | 'ketch' | 'custom';

export type Consents = Record<string, string> | string[];

export type ConsentManagementOptions = {
  enabled: boolean;
  provider: ConsentProvider;
  allowedConsentIds?: Consents;
  deniedConsentIds?: Consents;
};

export type ConsentsInfo = {
  allowedConsentIds?: Consents;
  deniedConsentIds?: Consents;
};

export type KetchConsentPurpose = {
  purpose: string;
};
