import md5 from "md5";
import { getHashFromArray, isDefinedAndNotNull } from "../utils/commonUtils";

const handleCommonFields = (rudderElement, hashMethod) => {
  const { message } = rudderElement;
  const { properties } = message;

  const setEmail = {};
  const setZipcode = {};

  const finalRequest = [
    { event: "setCustomerId", id: md5(message.userId) },
    { event: "setRetailerVisitorId", id: md5(message.anonymousId) },
  ];

  if (properties && properties.email) {
    const email = properties.email.trim().toLowerCase();
    setEmail.event = "setEmail";
    setEmail.hash_method = hashMethod;
    setEmail.email = hashMethod === "md5" ? md5(email) : email;
    finalRequest.push(setEmail);
  }

  if (properties && properties.zipCode) {
    setZipcode.event = "setZipcode";
    setZipcode.zipCode = properties.zipCode || properties.zip;
    finalRequest.push(setZipcode);
  }

  return finalRequest;
};
const generateExtraData = (rudderElement, fieldMapping) => {
  const { message } = rudderElement;
  const extraData = {};
  const fieldMapHashmap = getHashFromArray(fieldMapping, "from", "to", false);

  Object.keys(fieldMapHashmap).forEach((field) => {
    if (isDefinedAndNotNull(message.properties[field])) {
      extraData[fieldMapHashmap[field]] = message.properties[field];
    }
  });
  return extraData;
};

export { handleCommonFields, generateExtraData };
