import { LoadOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
declare const normalizeLoadOptions: (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
) => LoadOptions;
declare const getSourceConfigURL: (
  configUrl: string,
  writeKey: string,
  lockIntegrationsVersion: boolean,
  logger?: ILogger,
) => string;
export { normalizeLoadOptions, getSourceConfigURL };
