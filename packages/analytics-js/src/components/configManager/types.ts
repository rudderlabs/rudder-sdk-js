import { Nullable } from '@rudderstack/analytics-js/types';
import {
  DestinationConfig,
  RegionDetails,
  ResidencyServerRegion,
  StatsCollection,
} from '@rudderstack/analytics-js/state/types';
import { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { PluginName } from '../pluginsManager/types';

export type DestinationDefinition = {
  name: string;
  displayName: string;
  updatedAt: string;
};

export type ConfigResponseDestinationItem = {
  areTransformationsConnected: boolean;
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
  isHosted: boolean;
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

export const ConsentManagersToPluginNameMap: Record<string, PluginName> = {
  oneTrust: PluginName.OneTrust,
};
