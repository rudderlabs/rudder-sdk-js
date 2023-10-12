declare const DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR: (
  context: string,
  displayName: string,
  reason: string,
  action: string,
) => string;
declare const DMT_REQUEST_FAILED_ERROR: (
  context: string,
  displayName: string,
  status: number | undefined,
  action: string,
) => string;
declare const DMT_EXCEPTION: (displayName: string) => string;
declare const DMT_SERVER_ACCESS_DENIED_WARNING: (context: string) => string;
export {
  DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR,
  DMT_REQUEST_FAILED_ERROR,
  DMT_EXCEPTION,
  DMT_SERVER_ACCESS_DENIED_WARNING,
};
