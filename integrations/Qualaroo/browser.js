/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";
import { NAME } from "./constants";
import ScriptLoader from "../ScriptLoader";
import { recordQualarooEvents, transformUserTraits } from "./utils";

class Qualaroo {
  constructor(config, analytics) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.customerId = config.customerId;
    this.siteToken = config.siteToken;
    this.recordQualarooEvents = config.recordQualarooEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
    this.eventsList = config.eventsList;
  }

  loadScript() {
    window._kiq = window._kiq || [];
    ScriptLoader(
      "qualaroo-integration",
      `https://cl.qualaroo.com/ki.js/${this.customerId}/${this.siteToken}.js`
    );
  }

  init() {
    logger.debug("===In init Qualaroo===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded Qualaroo===");
    return !!window._kiq && typeof window._kiq === "object";
  }

  isReady() {
    logger.debug("===In isReady Qualaroo===");
    if (this.recordQualarooEvents) {
      recordQualarooEvents(
        this.updateEventNames,
        this.eventsList,
        this.eventsToStandard
      );
    }
    return !!window._kiq && typeof window._kiq === "object";
  }

  identify(rudderElement) {
    logger.debug("===In Qualaroo identify===");
    const { message } = rudderElement;
    const userId =
      get(message, "context.traits.email") ||
      get(message, "userId") ||
      get(message, "context.traits.userId") ||
      get(message, "context.traits.Id") ||
      "";
    const traits = get(message, "context.traits");
    const transformedTraits = transformUserTraits(traits);

    // If userId is not passed in the request, an empty string will be send for unknown visitors.
    // ref :- https://help.qualaroo.com/hc/en-us/articles/201956628-Using-the-Identity-API-call#:~:text=echo%20%24current_user%2D%3Eemail%20%3F%3E%27%5D)%3B-,Note,-%3A%20Our%20system
    window._kiq.push(["identify", userId]);

    window._kiq.push(["set", transformedTraits]);
  }

  track(rudderElement) {
    logger.debug("===In Qualaroo track===");
    const { message } = rudderElement;
    const event = get(message, "event");
    if (!event) {
      logger.error("[Qualaroo]:: event is required for track call");
      return;
    }

    const integrationName = get(message, "context.integration.name");
    if (integrationName === "Qualaroo") {
      logger.debug(`[Qualaroo]:: dropping callback event: ${event}`);
      return;
    }

    window._kiq.push(["set", { "Triggered Event": event }]);
  }

  page(rudderElement) {
    logger.debug("===In Qualaroo page===");
    const { name, category } = rudderElement.message;
    let pageFullName;
    if (name && category) {
      pageFullName = `${category} ${name}`;
    } else if (name) {
      pageFullName = name;
    } else if (category) {
      pageFullName = category;
    }

    if (pageFullName) {
      window._kiq.push(["set", { "Viewed Page": pageFullName }]);
    }
  }
}

export default Qualaroo;
