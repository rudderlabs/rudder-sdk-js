import get from "get-value";
import logger from "../../utils/logUtil";
import { isDefinedAndNotNull, isNotEmpty } from "../utils/commonUtils";

/**
 * transform webapp dynamicForm custom floodlight variable
 * [
      {
        "from": "1",
        "to": "value1"
      },
      {
        "from": "2",
        "to": "value2"
      }
  ]
 * into {u1: [value1], u2: [value2], ...}
 * Ref - https://support.google.com/campaignmanager/answer/2823222?hl=en
 * @param {*} customFloodlightVariable
 * @returns
 */
const transformCustomVariable = (customFloodlightVariable, message) => {
  const customVariable = {};
  customFloodlightVariable.forEach((item) => {
    if (item && isNotEmpty(item.from) && isNotEmpty(item.to)) {
      // remove u if already there
      // first we consider taking custom variable from properties
      // if not found we will take it from root level i.e message.*
      let itemValue = get(message, `properties.${item.to.trim()}`);
      // this condition adds support for numeric 0
      if (!isDefinedAndNotNull(itemValue)) {
        const traits = message.traits || message.context?.traits;
        if (traits) {
          itemValue = traits[item.to.trim()];
        }
      }
      if (
        itemValue &&
        typeof itemValue === "string" &&
        ['"', "<", ">", "#"].some((key) => itemValue.includes(key))
      ) {
        logger.info('", < , > or # string variable is not acceptable');
        itemValue = undefined;
      }
      // supported data types are number and string
      if (isDefinedAndNotNull(itemValue) && typeof itemValue !== "boolean") {
        customVariable[`u${item.from.trim().replace(/u/g, "")}`] =
          encodeURIComponent(itemValue);
      }
    }
  });

  return customVariable;
};

// valid flag should be provided [1|true] or [0|false]
const mapFlagValue = (key, value) => {
  if (["true", "1"].includes(value.toString())) {
    return 1;
  }
  if (["false", "0"].includes(value.toString())) {
    return 0;
  }

  throw Error(
    `[DCM Floodlight]:: ${key}: valid parameters are [1|true] or [0|false]`
  );
};

export { transformCustomVariable, mapFlagValue };
