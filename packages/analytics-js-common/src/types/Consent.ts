export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type ConsentManagement = {
  deniedConsents: Consents;
  deniedConsentIds: Consents; // For backward compatibility
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
  allowedConsents?: Consents;
  deniedConsents?: Consents;
};

export type ConsentsInfo = {
  allowedConsents?: Consents;
  deniedConsents?: Consents;
};

export type KetchConsentPurpose = {
  purpose: string;
};
