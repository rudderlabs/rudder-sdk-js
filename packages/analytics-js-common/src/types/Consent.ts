export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type ConsentManagement = {
  deniedConsents: ConsentData;
  deniedConsentIds: ConsentData; // For backward compatibility
};

export type CookieConsentOptions = {
  // OneTrust
  [key: string]: {
    enabled: boolean;
  };
};

export type ConsentProvider = 'oneTrust' | 'ketch' | 'custom';

export type ConsentData = Record<string, string> | string[];

export type ConsentManagementOptions = {
  enabled: boolean;
  provider: ConsentProvider;
  allowedConsents?: ConsentData;
  deniedConsents?: ConsentData;
};

export type ConsentsInfo = {
  allowedConsents?: ConsentData;
  deniedConsents?: ConsentData;
};

export type KetchConsentPurpose = {
  purpose: string;
};
