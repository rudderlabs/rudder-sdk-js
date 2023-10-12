declare const DESTINATION_NOT_SUPPORTED_ERROR: (destUserFriendlyId: string) => string;
declare const DESTINATION_SDK_LOAD_ERROR: (context: string, destUserFriendlyId: string) => string;
declare const DESTINATION_INIT_ERROR: (destUserFriendlyId: string) => string;
declare const DESTINATION_INTEGRATIONS_DATA_ERROR: (destUserFriendlyId: string) => string;
declare const DESTINATION_READY_TIMEOUT_ERROR: (
  timeout: number,
  destUserFriendlyId: string,
) => string;
export {
  DESTINATION_NOT_SUPPORTED_ERROR,
  DESTINATION_SDK_LOAD_ERROR,
  DESTINATION_INIT_ERROR,
  DESTINATION_INTEGRATIONS_DATA_ERROR,
  DESTINATION_READY_TIMEOUT_ERROR,
};
