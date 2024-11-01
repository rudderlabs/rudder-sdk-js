import type { AxiosError } from 'axios';

/**
 * Represents a generic object in the APIs
 * Use for parameters like context, traits etc.
 */
export interface ApiObject {
  [index: string]:
    | string
    | number
    | boolean
    | undefined
    | ApiObject
    | unknown
    | Date
    | (string | number | boolean | ApiObject | Date)[];
}

/**
 * Represents the integration options object
 * Example usages:
 * IntegrationOptions { All: false, "Google Analytics": true, "Braze": true}
 * IntegrationOptions { All: true, "Chartbeat": false, "Customer.io": false}
 */
export interface IntegrationOptions {
  // Defaults to true
  // If set to false, specific integration should be set to true to send the event
  All?: boolean;
  // Destination name: true/false/integration specific information
  [index: string]: boolean | ApiObject | undefined;
}

/**
 * Represents the first argument object for flushOverride method
 */
export type FlushOverrideMessage = {
  host: string;
  writeKey: string;
  data: {
    batch: Record<string, any>[];
    sentAt: Date;
  };
  headers: Record<string, string>;
  reqTimeout?: number;
  flush: (callback?: ApiCallback) => void;
  done: (error?: Error) => void;
  isErrorRetryable: (error: AxiosError) => boolean;
};

/**
 * Represents the constructor options object
 * Example usages:
 * ConstructorOptions { flushAt: 20, "flushInterval": 20000, "enable": true, "maxInternalQueueSize":20000, "logLevel": "info"/"debug"/"error"/"silly"/"off"}
 */
export interface ConstructorOptions {
  timeout?: number;
  flushAt?: number;
  flushInterval?: number;
  enable?: boolean;
  maxInternalQueueSize?: number;
  logLevel?: 'silly' | 'debug' | 'info' | 'error' | 'off';
  flushOverride?: (message: FlushOverrideMessage) => void;
}

/**
 * Represents the callback in the APIs
 */
export type ApiCallback = (err?: any, data?: any) => void;
