export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type ConsentManagement = {
  deniedConsentIds: Consents;
  allowedConsentIds: Consents;
  provider: ConsentManagementProvider;
};

export type CookieConsentOptions = {
  // OneTrust
  [key: string]: {
    enabled: boolean;
  };
};

export type ConsentManagementMetadata = {
  providers: ConsentManagementProviderMetadata[];
};

export type ConsentManagementProviderMetadata = {
  provider: ConsentManagementProvider;
  resolutionStrategy: ConsentResolutionStrategy;
};

export type ConsentManagementProvider = 'iubenda' | 'oneTrust' | 'ketch' | 'custom';

export type ConsentResolutionStrategy = 'and' | 'or';

export type Consents = string[];

export type ConsentManagementOptions = {
  enabled: boolean;
  provider: ConsentManagementProvider;
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

export type IubendaConsentPurpose = {
  purpose: string;
};
