import { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { StatsCollection } from '@rudderstack/analytics-js-common/types/Source';
import {
  RegionDetails,
  ResidencyServerRegion,
} from '@rudderstack/analytics-js-common/types/DataResidency';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';

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
  deleted: boolean;
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
    dataplanes?: Record<ResidencyServerRegion, RegionDetails[]>;
  };
};

export interface IConfigManager {
  httpClient: IHttpClient;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  init: () => void;
  getConfig: () => void;
  processConfig: () => void;
}
