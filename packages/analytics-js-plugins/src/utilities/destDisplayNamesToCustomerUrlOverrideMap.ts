import type {
  Destination,
  DestinationConfig,
} from '@rudderstack/analytics-js-common/types/Destination';
import { DISPLAY_NAME as AppcuesDisplayName } from '@rudderstack/analytics-js-integrations/integrations/Appcues/constants';
import { DISPLAY_NAME as GA4DisplayName } from '@rudderstack/analytics-js-integrations/integrations/GA4/constants';
import { DISPLAY_NAME as GA4_V2DisplayName } from '@rudderstack/analytics-js-integrations/integrations/GA4_V2/constants';
import { DISPLAY_NAME as GoogleAdsDisplayName } from '@rudderstack/analytics-js-integrations/integrations/GoogleAds/constants';
import { DISPLAY_NAME as RockerboxDisplayName } from '@rudderstack/analytics-js-integrations/integrations/Rockerbox/constants';
import { DISPLAY_NAME as MixpanelDisplayName } from '@rudderstack/analytics-js-integrations/integrations/Mixpanel/constants';

declare const MIXPANEL_CUSTOM_LIB_URL: unknown;

const hasSdkBaseUrl = (config: DestinationConfig): boolean =>
  typeof config.sdkBaseUrl === 'string' && config.sdkBaseUrl.replace(/\/+$/, '').length > 0;

const customerUrlOverrides: Partial<Record<string, (config: DestinationConfig) => boolean>> =
  Object.assign(Object.create(null), {
    [AppcuesDisplayName]: (config: DestinationConfig) =>
      typeof config.nativeSdkUrl === 'string' && config.nativeSdkUrl.length > 0,
    [GA4DisplayName]: hasSdkBaseUrl,
    [GA4_V2DisplayName]: hasSdkBaseUrl,
    [GoogleAdsDisplayName]: hasSdkBaseUrl,
    [RockerboxDisplayName]: (config: DestinationConfig) => Boolean(config.customDomain),
    [MixpanelDisplayName]: () => typeof MIXPANEL_CUSTOM_LIB_URL !== 'undefined',
  });

export const hasCustomerUrlOverride = (destination: Destination): boolean =>
  customerUrlOverrides[destination.displayName]?.(destination.config) ?? false;
