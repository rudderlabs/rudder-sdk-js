import { isDefinedAndNotNull } from '../../utils/utils';

/**
 * This function is used to trigger a callback.
 * @param {*} event name fo the event triggered
 * @param {*} payload payload of the triggered event
 * @param {*} analytics rudderanalytics object
 */
const makeACall = (event, payload, analytics) => {
  if (isDefinedAndNotNull(payload)) {
    analytics.track(event, payload);
  } else {
    analytics.track(event);
  }
};
export default makeACall;
