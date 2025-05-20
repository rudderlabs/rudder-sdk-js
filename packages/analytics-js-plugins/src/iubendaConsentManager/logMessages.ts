import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const IUBENDA_CONSENT_COOKIE_READ_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to read the consent cookie.`;

const IUBENDA_CONSENT_COOKIE_PARSE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to parse the consent cookie.`;

export { IUBENDA_CONSENT_COOKIE_READ_ERROR, IUBENDA_CONSENT_COOKIE_PARSE_ERROR };
