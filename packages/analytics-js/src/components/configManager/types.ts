import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { StatsCollection } from '@rudderstack/analytics-js-common/types/Source';
import type {
  IHttpClient,
  ResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ConsentManagementMetadata } from '@rudderstack/analytics-js-common/types/Consent';

export type DestinationDefinition = {
  name: string;
  displayName: string;
  updatedAt: string;
};

export type ConfigResponseDestinationItem = {
  shouldApplyDeviceModeTransformation: boolean;
  propagateEventsUntransformedOnError: boolean;
  config: DestinationConfig;
  updatedAt: string;
  destinationDefinition: DestinationDefinition;
  enabled: boolean;
  id: string;
  name: string;
};

export type Connection = {
  createdAt: string;
  deleted: boolean;
  destinationId: string;
  enabled: boolean;
  id: string;
  sourceId: string;
  updatedAt: string;
};

export type SourceDefinition = {
  category: Nullable<any>;
  config: Nullable<any>;
  configSchema: Nullable<any>;
  createdAt: string;
  displayName: string;
  id: string;
  name: string;
  options: Nullable<any>;
  uiConfig: Nullable<any>;
  updatedAt: string;
};

export type SourceConfigResponse = {
  consentManagementMetadata?: ConsentManagementMetadata;
  source: {
    destinations: ConfigResponseDestinationItem[];
    sourceDefinitionId: string;
    transient: boolean;
    updatedAt: string;
    workspaceId: string;
    writeKey: string;
    enabled: boolean;
    id: string;
    liveEventsConfig: {
      eventUpload: boolean;
      eventUploadTS: number;
    };
    name: string;
    secretVersion: Nullable<string>;
    sourceDefinition: SourceDefinition;
    config: {
      statsCollection: StatsCollection;
    };
    connections: Connection[];
    createdAt: string;
    createdBy: string;
    deleted: boolean;
  };
};

export interface IConfigManager {
  httpClient: IHttpClient;
  errorHandler: IErrorHandler;
  logger: ILogger;
  init: () => void;
  getConfig: () => void;
  processConfig: (
    response: SourceConfigResponse | string | undefined,
    details?: ResponseDetails,
  ) => void;
}
