import { ApiObject } from './ApiObject';

export type DestinationIntgConfig = boolean | undefined | ApiObject;

/**
 * Represents the integration options object
 * Example usages:
 * integrationOptions { All: false, "Google Analytics": true, "Braze": true}
 * integrationOptions { All: true, "Chartbeat": false, "Customer.io": false}
 * integrationOptions { All: true, "GA4": { "clientId": "1234" }, "Google Analytics": false }
 */
export type IntegrationOpts = {
  // Defaults to true
  // If set to false, specific integration should be set to true to send the event
  All?: boolean;
  // Destination name: true/false/integration specific information
  [index: string]: DestinationIntgConfig;
};
