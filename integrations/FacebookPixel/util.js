/* eslint-disable no-param-reassign */
import get from "get-value";

const constructPayload = (object, mapper) => {
  const payload = {};
  if (object)
    mapper.forEach((element) => {
      if (!Array.isArray(element.sourceKeys)) {
        payload[element.destKey] = get(object, element.sourceKeys);
      } else {
        for (let i = 0; i < element.sourceKeys.length; i += 1) {
          if (get(object, element.sourceKeys[i])) {
            payload[element.destKey] = get(object, element.sourceKeys[i]);
            break;
          }
        }
      }
    });
  return payload;
};
export default constructPayload;
