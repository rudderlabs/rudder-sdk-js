/**
 * A helper function that will take rudderEelement as an event and generate
 * a batch payload that will be sent to transformation server
 *
 */
const createPayload = (event, token) => {
  const orderNo = Date.now();
  const payload = {
    metadata: {
      "Custom-Authorization": token
    },
    batch: [
      {
        orderNo,
        event: event.message,
      },
    ],
  };
  return payload;
};

export { createPayload };
