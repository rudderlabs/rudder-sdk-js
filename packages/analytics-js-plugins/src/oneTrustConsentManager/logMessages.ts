import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const ONETRUST_ACCESS_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack SDK.`;

export { ONETRUST_ACCESS_ERROR };
