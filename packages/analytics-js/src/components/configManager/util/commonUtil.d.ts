import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { SourceConfigResponse } from '../types';
/**
 * Determines the SDK url
 * @returns sdkURL
 */
declare const getSDKUrl: () => string | undefined;
/**
 * Updates the reporting state variables from the source config data
 * @param res Source config
 * @param logger Logger instance
 */
declare const updateReportingState: (res: SourceConfigResponse, logger?: ILogger) => void;
declare const updateStorageState: (logger?: ILogger) => void;
declare const updateConsentsState: (logger?: ILogger) => void;
export { getSDKUrl, updateReportingState, updateStorageState, updateConsentsState };
