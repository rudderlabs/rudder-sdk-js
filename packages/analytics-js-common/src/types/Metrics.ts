import type { Event, Stackframe, User } from '@bugsnag/js';
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

// https://bugsnagerrorreportingapi.docs.apiary.io/#reference/0/notify/send-error-reports
export type ErrorEventPayload = {
  payloadVersion: string;
  notifier: {
    name: string;
    version: string;
    url: string;
  };
  events: ErrorEvent[];
};

export type ErrorEvent = Pick<Event, 'severity' | 'app' | 'device' | 'request' | 'context'> & {
  exceptions: Exception[];
  unhandled: boolean;
  severityReason: { type: string };
  breadcrumbs: Breadcrumb[];
  metaData: {
    [index: string]: any;
  };
  user: User;
};

export interface Exception {
  message: string;
  errorClass: string;
  type: string;
  stacktrace: Stackframe[];
}
