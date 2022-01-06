import { isArray, isObject } from "../../utils/utils";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import isString from "./utils";
class LaunchDarkly {
  constructor(config) {
    this.name = "LaunchDarkly";
    this.clientSideId = config.clientSideId;
  }
  init() {
    logger.debug("===in init LaunchDarkly===");
    if (!this.clientSideId) {
      logger.error("clientSideId is missing");
      return;
    }
    ScriptLoader(null, "https://unpkg.com/launchdarkly-js-client-sdk@2");
  }
  isLoaded() {
    logger.debug("===In isLoaded LaunchDarkly===");
    return !!window.LDClient;
  }
  isReady() {
    logger.debug("===In isReady LaunchDarkly===");
    if (window.LDClient) return true;
    else return false;
  }
  identify(rudderElement) {
    window.user = {};
    const { message } = rudderElement;
    user.key = message.userId || message.anonymousId;
    const { traits } = message.context;
    if (traits.anonymous !== undefined) user.anonymous = traits.anonymous;
    if (traits.avatar !== undefined && isString(traits.avatar))
      user.avatar = traits.avatar;
    if (traits.country != undefined && isString(traits.country))
      user.country = traits.country;
    if (traits.custom != undefined && isObject(traits.custom))
      user.custom = traits.custom;
    if (traits.email != undefined && isString(traits.email))
      user.email = traits.email;
    if (traits.firstName != undefined && isString(traits.firstName))
      user.firstName = traits.firstName;
    if (traits.ip != undefined && isString(traits.ip)) user.ip = traits.ip;
    if (traits.lastName != undefined && isString(traits.lastName))
      user.lastName = traits.lastName;
    if (traits.name != undefined && isString(traits.name))
      user.name = traits.name;
    if (
      traits.privateAttributeNames != undefined &&
      isArray(traits.privateAttributeNames)
    )
      user.privateAttributeNames = traits.privateAttributeNames;
    if (traits.secondary != undefined && isString(traits.secondary))
      user.secondary = traits.secondary;
    if (window.ldclient) {
      ldclient.identify(user);
    } else {
      window.ldclient = LDClient.initialize(this.clientSideId, user);
    }
  }
  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    if (window.ldclient) {
      ldclient.track(event, properties);
    } else
      logger.error(
        "=== In LaunchDarkly, track is not supported before identify ==="
      );
  }
  alias(rudderElement) {
    const { message } = rudderElement;
    var newUser = { key: message.userId };

    if (window.ldclient) {
      ldclient.alias(newUser, user);
    } else
      logger.error(
        "=== In LaunchDarkly, alias is not supported before identify ==="
      );
  }
}
export default LaunchDarkly;
