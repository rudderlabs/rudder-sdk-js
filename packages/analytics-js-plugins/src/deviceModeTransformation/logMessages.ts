import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';

const DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR = (
  context: string,
  displayName: string,
  reason: string,
  action: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Event transformation unsuccessful for destination "${displayName}". Reason: ${reason}. ${action}.`;

const DMT_REQUEST_FAILED_ERROR = (
  context: string,
  displayName: string,
  status: number | undefined,
  action: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}[Destination: ${displayName}].Transformation request failed with status: ${status}. Retries exhausted. ${action}.`;

const DMT_EXCEPTION = (displayName: string): string =>
  `Unexpected error occurred [Destination:${displayName}].`;

const DMT_SERVER_ACCESS_DENIED_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Transformation server access is denied. The configuration data seems to be out of sync. Sending untransformed event to the destination.`;

const INVALID_RESPONSE = `Invalid response received from the transformation server.`;

export {
  DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR,
  DMT_REQUEST_FAILED_ERROR,
  DMT_EXCEPTION,
  DMT_SERVER_ACCESS_DENIED_WARNING,
  INVALID_RESPONSE,
};
