declare const KETCH_CONSENT_COOKIE_READ_ERROR: (context: string) => string;
declare const KETCH_CONSENT_COOKIE_PARSE_ERROR: (context: string) => string;
declare const DESTINATION_CONSENT_STATUS_ERROR =
  'Failed to determine the consent status for the destination. Please check the destination configuration and try again.';
export {
  KETCH_CONSENT_COOKIE_READ_ERROR,
  KETCH_CONSENT_COOKIE_PARSE_ERROR,
  DESTINATION_CONSENT_STATUS_ERROR,
};
