export type OneTrustGroup = {
  CustomGroupId: string;
  GroupName: string;
  [key: string]: any;
};

export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type DestinationConsentConfig = {
  oneTrustCookieCategories: OneTrustCookieCategory[];
  [key: string]: any;
};
