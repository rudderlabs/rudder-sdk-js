import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/PinterestTag/constants';
import Logger from '../../utils/logger';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { isDefinedAndNotNull } from '../../utils/utils';
import { eventMapping } from './propertyMappingConfig';

const logger = new Logger(NAME);

function getDestinationEventName(event, userDefinedEventsMapping, sendAsCustomEvent) {
  let eventNames;
  /*
    Step 1: At first we will look for
            the event mapping in the UI. In case it is similar, will map to that.
     */
  if (userDefinedEventsMapping.length > 0) {
    const keyMap = getHashFromArrayWithDuplicate(userDefinedEventsMapping, 'from', 'to', false);
    eventNames = keyMap[event];
  }
  if (eventNames) {
    return eventNames;
  }
  /*
    Step 2: To find if the particular event is amongst the list of standard
            Rudderstack ecommerce events, used specifically for Pinterest Conversion API
            mappings.
    */
  const eventMapInfo = eventMapping.find(eventMap => eventMap.src.includes(event.toLowerCase()));
  if (isDefinedAndNotNull(eventMapInfo)) {
    return [eventMapInfo.dest];
  }

  /*
    Step 3: In case both of the above stated cases fail, will check if sendAsCustomEvent toggle is enabled in UI.
            If yes, then we will send it as custom event
    */
  if (sendAsCustomEvent) {
    return ['Custom'];
  }

  /*
    Step 4: In case all of the above stated cases fail, will send the event name as it is.
          This is going to be reflected as "unknown" event in pinterest tag dashboard.
    */
  logger.warn(
    `${DISPLAY_NAME} : '${event}' is not mapped in UI. Make sure to mapped the event in UI or enable the 'send as custom event' setting`,
  );
  return [event];
}

export { getDestinationEventName };
