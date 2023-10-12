import { getEnrichedEvent, getUpdatedPageProperties } from './utilities';
class RudderEventFactory {
  constructor(logger) {
    this.logger = logger;
  }
  /**
   * Generate a 'page' event based on the user-input fields
   * @param category Page's category
   * @param name Page name
   * @param properties Page properties
   * @param options API options
   */
  generatePageEvent(category, name, properties, options) {
    let props = properties !== null && properties !== void 0 ? properties : {};
    props.name = name;
    props.category = category;
    props = getUpdatedPageProperties(props, options);
    const pageEvent = {
      properties: props,
      name,
      category,
      type: 'page',
    };
    return getEnrichedEvent(pageEvent, options, props, this.logger);
  }
  /**
   * Generate a 'track' event based on the user-input fields
   * @param event The event name
   * @param properties Event properties
   * @param options API options
   */
  generateTrackEvent(event, properties, options) {
    const trackEvent = {
      properties,
      event,
      type: 'track',
    };
    return getEnrichedEvent(trackEvent, options, undefined, this.logger);
  }
  /**
   * Generate an 'identify' event based on the user-input fields
   * @param userId New user ID
   * @param traits new traits
   * @param options API options
   */
  generateIdentifyEvent(userId, traits, options) {
    const identifyEvent = {
      userId,
      type: 'identify',
      context: {
        traits,
      },
    };
    return getEnrichedEvent(identifyEvent, options, undefined, this.logger);
  }
  /**
   * Generate an 'alias' event based on the user-input fields
   * @param to New user ID
   * @param from Old user ID
   * @param options API options
   */
  generateAliasEvent(to, from, options) {
    const aliasEvent = {
      previousId: from,
      type: 'alias',
    };
    const enrichedEvent = getEnrichedEvent(aliasEvent, options, undefined, this.logger);
    // override the User ID from the API inputs
    enrichedEvent.userId = to !== null && to !== void 0 ? to : enrichedEvent.userId;
    return enrichedEvent;
  }
  /**
   * Generate a 'group' event based on the user-input fields
   * @param groupId New group ID
   * @param traits new group traits
   * @param options API options
   */
  generateGroupEvent(groupId, traits, options) {
    const groupEvent = {
      type: 'group',
    };
    if (groupId) {
      groupEvent.groupId = groupId;
    }
    if (traits) {
      groupEvent.traits = traits;
    }
    return getEnrichedEvent(groupEvent, options, undefined, this.logger);
  }
  /**
   * Generates a new RudderEvent object based on the user-input fields
   * @param event API event parameters object
   * @returns A RudderEvent object
   */
  create(event) {
    let eventObj;
    switch (event.type) {
      case 'page':
        eventObj = this.generatePageEvent(
          event.category,
          event.name,
          event.properties,
          event.options,
        );
        break;
      case 'track':
        eventObj = this.generateTrackEvent(event.name, event.properties, event.options);
        break;
      case 'identify':
        eventObj = this.generateIdentifyEvent(event.userId, event.traits, event.options);
        break;
      case 'alias':
        eventObj = this.generateAliasEvent(event.to, event.from, event.options);
        break;
      case 'group':
        eventObj = this.generateGroupEvent(event.groupId, event.traits, event.options);
        break;
      default:
        // Do nothing
        break;
    }
    return eventObj;
  }
}
export { RudderEventFactory };
