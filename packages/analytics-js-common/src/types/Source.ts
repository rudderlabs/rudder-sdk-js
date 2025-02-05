import type { ConsentManagementMetadata } from './Consent';
import type { DestinationConfig } from './Destination';
import type { Nullable } from './Nullable';

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

export type StatsCollection = {
  errors: {
    enabled: boolean;
    provider?: string;
  };
  metrics: {
    enabled: boolean;
  };
};

export type SourceConfig = {
  statsCollection?: StatsCollection;
};

export type Source = {
  id: string;
  config?: SourceConfig;
  name: string;
  workspaceId: string;
};
