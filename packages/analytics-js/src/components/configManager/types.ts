import { Nullable } from '@rudderstack/analytics-js/types';
import {
  DestinationConfig,
  RegionDetails,
  ResidencyServerRegion,
} from '@rudderstack/analytics-js/state/types';

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
  workspaceId: string;
  destinationDefinitionId: string;
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

export type StatsCollection = {
  errorReports: {
    enabled: boolean;
  };
  metrics: {
    enabled: boolean;
  };
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
    dataplanes?: Record<ResidencyServerRegion, RegionDetails>;
  };
};
