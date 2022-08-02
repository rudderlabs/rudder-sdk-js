/* eslint-disable no-underscore-dangle */
import get from "get-value";
import { isDefinedAndNotNull } from "../utils/commonUtils";
import { NAME } from "./constants";

/*
 * Here, we are iterating each key-value pair of object 'Obj' and
 * checks if typeof value is string then we pass it as custom variable in mouseflow.
 */
const setCustomVariables = (userProperties) => {
  if (userProperties && typeof userProperties === "object") {
    Object.entries(userProperties).forEach((item) => {
      const [key, value] = item;
      if (typeof value === "string")
        window._mfq.push(["setVariable", key, value]);
    });
  }
};

/*
 * Add tags
 * Set custom Variables
 * Ref: https://js-api-docs.mouseflow.com/#setting-a-custom-variable
 */
const addTags = (message) => {
  const tags = get(message, `integrations.${NAME}.tags`);
  if (isDefinedAndNotNull(tags) && Array.isArray(tags)) {
    tags.forEach((value) => {
      if (typeof value === "string") window._mfq.push(["tag", value]);
    });
  }
};

export { setCustomVariables, addTags };
