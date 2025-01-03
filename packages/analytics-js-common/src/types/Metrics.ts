import type { Breadcrumb } from './ApplicationState';

export type MetricServicePayload = {
  version: string;
  message_id: string;
  source: {
    name: string;
    sdk_version: string;
    write_key: string;
    install_type: string;
  };
  errors?: ErrorEventPayload;
};

export type ErrorEventPayload = {
  payloadVersion: string;
  notifier: {
    name: string;
    version: string;
    url: string;
  };
  events: ErrorEvent[];
};

export type ErrorEvent = {
  exceptions: Exception[];
  severity: string;
  unhandled: boolean;
  severityReason: { type: string };
  app: {
    version: string;
    releaseStage: string;
    type: string;
  };
  device: {
    locale?: string;
    userAgent?: string;
    time?: Date;
  };
  request: {
    url: string;
    clientIp: string;
  };
  breadcrumbs: Breadcrumb[] | [];
  context: string;
  metaData: {
    [index: string]: any;
  };
  user: {
    id: string;
    name: string;
  };
};

export type GeneratedEventType = {
  errors: Exception[];
};

export interface Stackframe {
  file: string;
  method?: string;
  lineNumber?: number;
  columnNumber?: number;
  code?: Record<string, string>;
  inProject?: boolean;
}

export interface Exception {
  message: string;
  errorClass: string;
  type: string;
  stacktrace: Stackframe[];
}
