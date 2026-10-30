import type { VendorSdkPinSupport } from '@rudderstack/analytics-js-common/types/Integration';
import {
  DISPLAY_NAME as BugsnagDisplayName,
  VENDOR_SDK_PIN_SUPPORT as BugsnagPinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Bugsnag/constants';
import {
  DISPLAY_NAME as IterableDisplayName,
  VENDOR_SDK_PIN_SUPPORT as IterablePinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Iterable/constants';
import {
  DISPLAY_NAME as KeenDisplayName,
  VENDOR_SDK_PIN_SUPPORT as KeenPinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Keen/constants';
import {
  DISPLAY_NAME as LaunchDarklyDisplayName,
  VENDOR_SDK_PIN_SUPPORT as LaunchDarklyPinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/LaunchDarkly/constants';
import {
  DISPLAY_NAME as AmplitudeDisplayName,
  VENDOR_SDK_PIN_SUPPORT as AmplitudePinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Amplitude/constants';
import {
  DISPLAY_NAME as SentryDisplayName,
  VENDOR_SDK_PIN_SUPPORT as SentryPinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Sentry/constants';
import {
  DISPLAY_NAME as LotameDisplayName,
  VENDOR_SDK_PIN_SUPPORT as LotamePinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Lotame/constants';
import {
  DISPLAY_NAME as NinetailedDisplayName,
  VENDOR_SDK_PIN_SUPPORT as NinetailedPinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Ninetailed/constants';
import {
  DISPLAY_NAME as OptimizelyDisplayName,
  VENDOR_SDK_PIN_SUPPORT as OptimizelyPinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Optimizely/constants';
import {
  DISPLAY_NAME as ShynetDisplayName,
  VENDOR_SDK_PIN_SUPPORT as ShynetPinSupport,
} from '@rudderstack/analytics-js-integrations/integrations/Shynet/constants';

export const destDisplayNamesToPinSupportMap: Partial<Record<string, VendorSdkPinSupport>> =
  Object.assign(Object.create(null), {
    [BugsnagDisplayName]: BugsnagPinSupport,
    [IterableDisplayName]: IterablePinSupport,
    [KeenDisplayName]: KeenPinSupport,
    [LaunchDarklyDisplayName]: LaunchDarklyPinSupport,
    [AmplitudeDisplayName]: AmplitudePinSupport,
    [SentryDisplayName]: SentryPinSupport,
    [LotameDisplayName]: LotamePinSupport,
    [NinetailedDisplayName]: NinetailedPinSupport,
    [OptimizelyDisplayName]: OptimizelyPinSupport,
    [ShynetDisplayName]: ShynetPinSupport,
  });
