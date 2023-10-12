import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
const DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR = (context, displayName, reason, action) =>
  `${context}${LOG_CONTEXT_SEPARATOR}Event transformation unsuccessful for destination "${displayName}". Reason: ${reason}. ${action}.`;
const DMT_REQUEST_FAILED_ERROR = (context, displayName, status, action) =>
  `${context}${LOG_CONTEXT_SEPARATOR}[Destination: ${displayName}].Transformation request failed with status: ${status}. Retries exhausted. ${action}.`;
const DMT_EXCEPTION = displayName => `[Destination:${displayName}].`;
const DMT_SERVER_ACCESS_DENIED_WARNING = context =>
  `${context}${LOG_CONTEXT_SEPARATOR}Transformation server access is denied. The configuration data seems to be out of sync. Sending untransformed event to the destination.`;
export {
  DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR,
  DMT_REQUEST_FAILED_ERROR,
  DMT_EXCEPTION,
  DMT_SERVER_ACCESS_DENIED_WARNING,
};
