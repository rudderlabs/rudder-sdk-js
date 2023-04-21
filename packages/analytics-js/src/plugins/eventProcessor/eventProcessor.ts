import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import {
  RudderEvent,
  RudderEventType,
} from '@rudderstack/analytics-js/components/eventManager/types';
import { state } from '@rudderstack/analytics-js/state';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js/components/utilities/timestamp';
import { generateUUID } from '@rudderstack/analytics-js/components/utilities/uuId';
import { mergeDeepRight } from '@rudderstack/analytics-js/components//utilities/object';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { Nullable } from '@rudderstack/analytics-js/types';
import { CHANNEL } from './constants';
import { checkForReservedElements, getContextPageProperties, processOptions } from './utilities';

const eventProcessor = (): ExtensionPlugin => ({
  name: 'eventProcessor',
  deps: [],
  event: {
    /**
     * Appends the common event data to the rudder event
     * @param rudderEvent Generate rudder event
     * @param pageProps Page properties
     * @returns Complete Rudder Event object
     */
    process: (
      rudderEvent: Partial<RudderEvent>,
      options?: Nullable<ApiOptions>,
      pageProps?: ApiObject,
    ): RudderEvent => {
      const commonEventData = {
        // Type casting to string as the user session manager will take care of initializing the value
        anonymousId: state.session.rl_anonymous_id.value as string,
        channel: CHANNEL,
        context: {
          traits: { ...state.session.rl_trait.value },
          sessionId: state.session.rl_session.value.id,
          sessionStart: state.session.rl_session.value.sessionStart,
          consentManagement: {
            deniedConsentIds: state.consents.deniedConsentIds.value,
          },
          'ua-ch': state.context['ua-ch'].value,
          app: state.context.app.value,
          library: state.context.library.value,
          userAgent: state.context.userAgent.value,
          os: state.context.os.value,
          locale: state.context.locale.value,
          screen: state.context.screen.value,
          campaign: state.context.campaign.value,
          page: getContextPageProperties(pageProps),
        },
        originalTimestamp: getCurrentTimeFormatted(),
        integrations: { All: true },
        messageId: generateUUID(),
        userId: state.session.rl_user_id.value,
      } as Partial<RudderEvent>;

      if (rudderEvent.type === RudderEventType.Group) {
        commonEventData.groupId = state.session.rl_group_id.value;
        commonEventData.traits = { ...state.session.rl_group_trait.value };
      }

      const processedEvent = mergeDeepRight(rudderEvent, commonEventData) as RudderEvent;

      processOptions(processedEvent, options);
      // TODO: We might not need this check altogether
      checkForReservedElements(processedEvent, defaultLogger);

      return processedEvent;
    },
  },
});

export { eventProcessor };
