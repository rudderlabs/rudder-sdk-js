export type OneTrustGroup = {
  CustomGroupId: string;
  GroupName: string;
  [key: string]: any;
};

export type ConsentInfo = {
  consentManagerInitialized: boolean;
  allowedConsentIds?: string[];
  deniedConsentIds?: string[];
};
