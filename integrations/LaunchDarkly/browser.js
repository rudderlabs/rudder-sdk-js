import {
    isArray,
    isObject,
} from "../../utils/utils"; import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
const isString = function isString(val) {
    return toStr$1.call(val) === "[object String]";
};
class LaunchDarkly {
    constructor(config) {
        this.name = "LaunchDarkly";
        this.clientSideId = config.clientSideId;
    }
    init() {
        logger.debug("===in init LaunchDarkly===");
        if (!this.clientSideId) {
            logger.debug("clientSideId is missing");
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
        if (window.LDClient)
            return true;
        else
            return false;
    }
    identify(rudderElement) {
        var user = {};
        const { message } = rudderElement;
        user.key = message.userId || message.anonymousId;
        const { traits } = message.context;
        if (traits.anonymous !== undefined)
            user.anonymous = traits.anonymous;
        if (traits.avatar !== undefined)
            user.avatar = traits.avatar
        if (traits.country != undefined)
            user.country = traits.country
        if (traits.custom != undefined && isObject(traits.custom))
            user.custom = traits.custom;
        if (traits.email != undefined)
            user.email = traits.email;
        if (traits.ip != undefined && isString(traits.ip))
            user.ip = traits.ip;
        if (traits.lastName != undefined && isString(traits.lastName))
            user.lastName = traits.lastName;
        if (traits.name != undefined && isString(traits.name))
            user.name = traits.name;
        if (traits.privateAttributeNames != undefined && isArray(traits.privateAttributeNames))
            user.privateAttributeNames = traits.privateAttributeNames;
        if (traits.secondary != undefined && isString(traits.secondary))
            user.secondary = traits.secondary;
        if (window.ldclient) {
            ldclient.identify(user);
        }
        else {
            window.ldclient = LDClient.initialize(this.clientSideId, user);
        }
    }
    track(rudderElement) {
        const { message } = rudderElement.message;
        if (window.ldclient) {
            ldclient.track(message.event, message.properties);
        }
        else
            logger.debug("=== In LaunchDarkly, track is not supported before identify ===");
    }
    alias(rudderElement) {
        const { message } = rudderElement.message;
        var newUser = { key: message.userId };

        if (window.ldclient) {
            ldclient.alias(newUser, user);
        }
        else
            logger.debug("=== In LaunchDarkly, alias is not supported before identify ===");
    }
}
export default LaunchDarkly;