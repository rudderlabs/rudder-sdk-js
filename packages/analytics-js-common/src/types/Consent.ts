export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type ConsentManagement = {
  deniedConsents: string[];
  deniedConsentIds: string[]; // For backward compatibility
};

export type ConsentProvider = 'oneTrust' | 'ketch' | 'custom';

export type ConsentManagementOptions = {
  enabled: boolean;
  provider: ConsentProvider;
  allowedConsents?: string[];
  deniedConsents?: string[];
};

export type ConsentInfo = {
  initialized: boolean;
  allowedConsents?: Record<string, string> | string[];
  deniedConsents?: string[];
};

export type KetchConsentPurpose = {
  purpose: string;
};
