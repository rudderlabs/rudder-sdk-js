import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { TransformationRequestPayload } from './types';
/**
 * A helper function that will take rudderEvent and generate
 * a batch payload that will be sent to transformation server
 *
 */
declare const createPayload: (
  event: RudderEvent,
  destinationIds: string[],
  token: Nullable<string>,
) => TransformationRequestPayload;
declare const sendTransformedEventToDestinations: (
  state: ApplicationState,
  pluginsManager: IPluginsManager,
  destinationIds: string[],
  result: any,
  status: number | undefined,
  event: RudderEvent,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
) => void;
export { createPayload, sendTransformedEventToDestinations };
