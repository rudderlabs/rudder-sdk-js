import { ConsentInfo } from '../types/plugins';

export type KetchPurposeValue = {
  status: string;
};

export type KetchConsentData = {
  [purposeCode: string]: KetchPurposeValue;
};

export type KetchConsentPurposes = {
  [purposeCode: string]: boolean;
};

export type ConsentData = Pick<ConsentInfo, 'allowedConsents' | 'deniedConsentIds'>;
