const DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR = (
  displayName: string,
  reason: string,
  action: string,
): string =>
  `[DMT]:: Event transformation unsuccessful for destination "${displayName}". Reason:  ${reason}. ${action}.`;

const DMT_REQUEST_FAILED_ERROR = (displayName: string, status: number, action: string): string =>
  `[DMT]::[Destination: ${displayName}] :: Transformation request failed with status: ${status}. Retries exhausted. ${action}.`;

const DMT_EXCEPTION = (displayName: string, message: string): string =>
  `[DMT]::[Destination:${displayName}]:: ${message}`;
const DMT_SERVER_ACCESS_DENIED_WARNING = (): string =>
  `[DMT]:: Transformation server access is denied. The configuration data seems to be out of sync. Sending untransformed event to the destination.`;

export {
  DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR,
  DMT_REQUEST_FAILED_ERROR,
  DMT_EXCEPTION,
  DMT_SERVER_ACCESS_DENIED_WARNING,
};
