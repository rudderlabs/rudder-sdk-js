/* eslint-disable class-methods-use-this */
import get from 'get-value';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Mixpanel/constants';
import Logger from '../../utils/logger';
import { pick, removeUndefinedAndNullValues, isNotEmpty } from '../../utils/commonUtils';
import {
  mapTraits,
  unionArrays,
  formatTraits,
  extendTraits,
  extractTraits,
  parseConfigArray,
  inverseObjectArrays,
  getConsolidatedPageCalls,
  generatePageCustomEventName,
} from './util';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Mixpanel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.accountId = config.accountId;
    this.token = config.token;
    this.people = config.people || false;
    this.dataResidency = config.dataResidency || 'us';
    this.setAllTraitsByDefault = config.setAllTraitsByDefault || false;
    this.superProperties = config.superProperties || [];
    this.setOnceProperties = config.setOnceProperties || [];
    this.eventIncrements = config.eventIncrements || [];
    this.propIncrements = config.propIncrements || [];
    this.sourceName = config.sourceName;
    this.consolidatedPageCalls = getConsolidatedPageCalls(config);
    this.trackCategorizedPages = config.trackCategorizedPages || false;
    this.trackNamedPages = config.trackNamedPages || false;
    this.groupKeySettings = config.groupKeySettings || [];
    this.peopleProperties = config.peopleProperties || [];
    this.crossSubdomainCookie = config.crossSubdomainCookie || false;
    this.secureCookie = config.secureCookie || false;
    this.persistenceType = config.persistenceType || 'cookie';
    this.persistenceName = config.persistenceName;
    this.traitAliases = {
      created: '$created',
      email: '$email',
      firstName: '$first_name',
      lastName: '$last_name',
      lastSeen: '$last_seen',
      name: '$name',
      username: '$username',
      phone: '$phone',
    };
    this.identityMergeApi = config.identityMergeApi || 'original';
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
    this.ignoreDnt = config.ignoreDnt || false;
    this.useUserDefinedPageEventName = config.useUserDefinedPageEventName || false;
    this.userDefinedPageEventTemplate = config.userDefinedPageEventTemplate;
    this.isNativeSDKLoaded = false;
  }

  init() {
    // eslint-disable-next-line no-var
    loadNativeSdk();
    const options = {
      cross_subdomain_cookie: this.crossSubdomainCookie || false,
      secure_cookie: this.secureCookie || false,
    };

    if (this.persistenceName) {
      options.persistence_name = this.persistenceName;
    }

    if (this.persistenceType !== 'none') {
      options.persistence = this.persistenceType;
    } else {
      options.disable_persistence = true;
    }

    if (this.dataResidency === 'eu') {
      // https://developer.mixpanel.com/docs/implement-mixpanel#section-implementing-mixpanel-in-the-european-union-eu
      options.api_host = 'https://api-eu.mixpanel.com';
    }
    if (this.ignoreDnt) {
      options.ignore_dnt = true;
    }
    options.loaded = () => {
      this.isNativeSDKLoaded = true;
    };
    window.mixpanel.init(this.token, options);
    window.mixpanel.register({ mp_lib: 'Rudderstack: web' });
  }

  isLoaded() {
    return this.isNativeSDKLoaded;
  }

  isReady() {
    return this.isLoaded();
  }

  /**
   * Identify
   * @param {*} rudderElement
   */
  identify(rudderElement) {
    let peopleProperties = parseConfigArray(this.peopleProperties, 'property');
    peopleProperties = extendTraits(peopleProperties);
    const superProperties = parseConfigArray(this.superProperties, 'property');
    const setOnceProperties = parseConfigArray(this.setOnceProperties, 'property');

    let userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    if (this.identityMergeApi === 'simplified') {
      // calling mixpanel .identify() only for known users
      userId = rudderElement.message.userId;
    }
    const traitsInfo = formatTraits(rudderElement.message, setOnceProperties);
    // id
    if (userId) window.mixpanel.identify(userId);

    // name tag
    const nametag = traitsInfo.email || traitsInfo.username;
    if (nametag) window.mixpanel.name_tag(nametag);

    let traits = extractTraits(traitsInfo.setTraits, this.traitAliases);
    traits = removeUndefinedAndNullValues(traits);
    let setOnceTraits = extractTraits(traitsInfo.setOnce, this.traitAliases);
    setOnceTraits = removeUndefinedAndNullValues(setOnceTraits);

    // determine which traits to union to existing properties and which to set as new properties
    const traitsToUnion = {};
    const traitsToSet = {};
    Object.keys(traits).forEach(trait => {
      if (Object.prototype.hasOwnProperty.call(traits, trait)) {
        const value = traits[trait];
        if (Array.isArray(value) && value.length > 0) {
          traitsToUnion[trait] = value;
          // since mixpanel doesn't offer a union method for super properties we have to do it manually by retrieving the existing list super property
          // from mixpanel and manually unioning to it ourselves
          const existingTrait = window.mixpanel.get_property(trait);
          if (existingTrait && Array.isArray(existingTrait)) {
            traits[trait] = unionArrays(existingTrait, value);
          }
        } else {
          traitsToSet[trait] = value;
        }
      }
    });

    // ref: https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#:~:text=mixpanel.people.set_once%20%2D%20set%20properties%20if%20they%20don%27t%20exist
    if (this.people && setOnceTraits && Object.keys(setOnceTraits).length > 0) {
      window.mixpanel.people.set_once(setOnceTraits);
    }

    if (this.setAllTraitsByDefault) {
      window.mixpanel.register(traits);
      if (this.people) {
        window.mixpanel.people.set(traitsToSet);
        window.mixpanel.people.union(traitsToUnion);
      }
    } else {
      // explicitly set select traits as people and super properties
      const mappedSuperProps = mapTraits(superProperties);
      const superProps = pick(traits, mappedSuperProps || []);
      if (isNotEmpty(superProps)) window.mixpanel.register(superProps);
      if (this.people) {
        const mappedPeopleProps = mapTraits(peopleProperties);
        const peoplePropsToSet = pick(traitsToSet, mappedPeopleProps || []);
        const peoplePropsToUnion = pick(traitsToUnion, mappedPeopleProps || []);
        if (isNotEmpty(peoplePropsToSet)) window.mixpanel.people.set(peoplePropsToSet);
        if (isNotEmpty(peoplePropsToUnion)) window.mixpanel.people.union(peoplePropsToUnion);
      }
    }
  }

  /**
   * Page
   * @param {*} rudderElement
   */
  page(rudderElement) {
    const { properties } = rudderElement.message;

    if (this.useUserDefinedPageEventName) {
      if (!this.userDefinedPageEventTemplate) {
        logger.error(
          'Event name template is not configured. Please provide a valid value for the `Page Event Name Template` in the destination dashboard.',
        );
        return;
      }
      const eventName = generatePageCustomEventName(
        rudderElement.message,
        this.userDefinedPageEventTemplate,
      );
      window.mixpanel.track(eventName, properties);
      return;
    }

    const { name } = rudderElement.message;
    const { category } = properties;
    // consolidated Page Calls
    if (this.consolidatedPageCalls) {
      window.mixpanel.track('Loaded a Page', properties);
      return;
    }

    // categorized pages
    if (this.trackCategorizedPages && category) {
      // If this option is checked and name was also passed, used the full name which includes both category & name
      if (name) {
        window.mixpanel.track(`Viewed ${category} ${name} Page`, properties);
        return;
      }
      window.mixpanel.track(`Viewed ${category} Page `, properties);
      return;
    }

    // named pages
    if (name && this.trackNamedPages) {
      window.mixpanel.track(`Viewed ${name} Page`, properties);
    }
  }

  /**
   * Track
   * https://mixpanel.com/help/reference/javascript#sending-events
   * https://mixpanel.com/help/reference/javascript#tracking-revenue
   * @param {*} rudderElement
   */
  track(rudderElement) {
    const { message } = rudderElement;
    const eventIncrements = parseConfigArray(this.eventIncrements, 'property');
    const propIncrements = parseConfigArray(this.propIncrements, 'property');
    const event = get(message, 'event');
    const revenue = get(message, 'properties.revenue') || get(message, 'properties.total');
    const { sourceName, people } = this;
    let props = get(message, 'properties');
    if (isNotEmpty(props)) {
      props = inverseObjectArrays(props);
    }
    if (sourceName) {
      props = { ...props };
      props.rudderstack_source_name = sourceName;
    }

    // delete mixpanel's reserved prosperties, so they don't conflict
    delete props.distinct_id;
    delete props.ip;
    delete props.mp_name_tag;
    delete props.mp_note;
    delete props.token;

    // Mixpanel People operations
    if (people) {
      // increment event count, check if the current event exists in eventIncrements
      if (eventIncrements.indexOf(event) !== -1) {
        window.mixpanel.people.increment(event);
        window.mixpanel.people.set(`Last ${event}`, new Date());
      }
      // increment property counts
      Object.keys(props).forEach(prop => {
        const value = props[prop];
        if (value && propIncrements.includes(prop)) {
          window.mixpanel.people.increment(prop, value);
        }
      });

      // track revenue
      if (revenue) {
        window.mixpanel.people.track_charge(revenue);
      }
    }

    // track the event
    let query;
    if (props.link_query) {
      // DOM query
      query = props.link_query;
      delete props.link_query;
      window.mixpanel.track_links(query, event, props);
    } else if (props.form_query) {
      // DOM query
      query = props.form_query;
      delete props.form_query;
      window.mixpanel.track_forms(query, event, props);
    } else {
      window.mixpanel.track(event, props);
    }
  }

  /**
   * @param {*} rudderElement
   */
  group(rudderElement) {
    const { userId, groupId, traits } = rudderElement.message;
    if (!userId) {
      logger.error('valid userId is required for group');
      return;
    }
    if (!groupId) {
      logger.error('valid groupId is required for group');
      return;
    }
    if (!this.groupKeySettings || this.groupKeySettings.length === 0) {
      logger.error('groupIdentifierTraits is required for group');
      return;
    }
    /**
     * groupIdentifierTraits: [ {trait: "<trait_value>"}, ... ]
     */
    const identifierTraitsList = parseConfigArray(this.groupKeySettings, 'groupKey');
    if (traits && Object.keys(traits).length > 0) {
      identifierTraitsList.forEach(trait => {
        window.mixpanel.get_group(trait, groupId).set_once(traits);
      });
    }
    identifierTraitsList.forEach(trait => window.mixpanel.set_group(trait, [groupId]));
  }

  /**
   * https://github.com/mixpanel/mixpanel-js/blob/master/doc/readme.io/javascript-full-api-reference.md#mixpanelalias
   * @param {*} rudderElement
   */
  alias(rudderElement) {
    if (this.identityMergeApi === 'simplified') {
      logger.error("Alias call is deprecated in 'Simplified ID Merge'");
      return;
    }

    const { previousId, userId } = rudderElement.message;
    const newId = userId;
    if (!previousId) {
      logger.error('previousId is required for alias call');
      return;
    }
    if (!newId) {
      logger.error('userId is required for alias call');
      return;
    }

    if (window.mixpanel.get_distinct_id && window.mixpanel.get_distinct_id() === newId) {
      logger.error('userId is same as previousId. Skipping alias');
      return;
    }
    window.mixpanel.alias(newId, previousId);
  }
}
export default Mixpanel;
