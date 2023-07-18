export type KetchPurpose = {
  status: string;
};

export type KetchConsentCookieData = {
  [purposeCode: string]: KetchPurpose | undefined;
};

export type KetchConsentData = {
  [purposeCode: string]: boolean;
};
