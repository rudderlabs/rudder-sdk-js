export type OneTrustGroup = {
  CustomGroupId: string;
  GroupName: string;
  [key: string]: any;
};

export type ConsentInfo = {
  consentProviderInitialized: boolean;
  allowedConsents?: Record<string, string>;
  deniedConsentIds?: string[];
};

export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type DestinationConsentConfig = {
  oneTrustCookieCategories: OneTrustCookieCategory[];
  [key: string]: any;
};
