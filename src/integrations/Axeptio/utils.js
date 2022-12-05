import { isDefinedAndNotNull } from '../../utils/commonUtils';

/**
 * This function is used to trigger a callback.
 * @param {*} event - naem fo the event triggered
 * @param {*} payload - payload of the triggered event
 */
const makeACall = (event, payload) => {
  if (isDefinedAndNotNull(payload)) {
    window.rudderanalytics.track(event, payload);
  } else {
    window.rudderanalytics.track(event);
  }
};
export default makeACall;
