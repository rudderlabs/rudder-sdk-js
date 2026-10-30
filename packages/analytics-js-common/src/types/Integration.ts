import type { ApiObject } from './ApiObject';

export type VendorSdkVersionPolicy = 'pinned' | 'floating' | 'strict';
export type VendorSdkPinSupport = 'full' | 'none' | 'no-script';
export type DestinationIntegrationOptions = ApiObject & {
  vendorSdkVersionPolicy?: VendorSdkVersionPolicy;
};
export type DestinationIntgConfig = boolean | undefined | DestinationIntegrationOptions;

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
  All?: DestinationIntgConfig;
  // Destination name: true/false/integration specific information
  [index: string]: DestinationIntgConfig;
};
