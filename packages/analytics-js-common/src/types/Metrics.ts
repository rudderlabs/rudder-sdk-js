import type { BreadCrumb } from './ApplicationState';

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
  notifier: {
    name: string;
    version: string;
    url: string;
  };
  events: ErrorEventType[];
};

export type ErrorEventType = {
  payloadVersion: string;
  exceptions: Exception[];
  severity: string;
  unhandled: boolean;
  severityReason: { type: string };
  app: {
    version: string;
    releaseStage: string;
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
  breadcrumbs: BreadCrumb[] | [];
  context: string;
  metaData: {
    [index: string]: any;
  };
  user: {
    id: string;
  };
};

export interface Exception {
  errorClass: string;
  errorMessage: string;
  stacktrace: Stackframe[];
  type: string;
}
export interface Stackframe {
  file: string;
  method?: string;
  lineNumber?: number;
  columnNumber?: number;
  code?: Record<string, string>;
  inProject?: boolean;
}
