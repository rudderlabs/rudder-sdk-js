export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type ConsentManagement = {
  deniedConsentIds: string[];
};

export type CookieConsentOptions = {
  // OneTrust
  [key: string]: {
    enabled: boolean;
  };
};

export type ConsentInfo = {
  initialized: boolean;
  allowedConsents?: Record<string, string> | string[];
  deniedConsentIds?: string[];
};

export type KetchConsentPurpose = {
  purpose: string;
};
