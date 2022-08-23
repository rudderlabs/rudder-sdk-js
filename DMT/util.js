/**
 * A helper function that will take rudderEelement as an event and generate
 * a batch payload that will be sent to transformation server
 *
 */
const createPayload = (event) => {
  const orderNo = Date.now();
  const payload = {
    batch: [
      {
        orderNo,
        event,
      },
    ],
  };
  return payload;
};

export { createPayload };
