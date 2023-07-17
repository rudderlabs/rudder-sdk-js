/* eslint-disable no-continue */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable block-scoped-var */
/* eslint-disable no-use-before-define */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-template */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable yoda */
/* eslint-disable no-nested-ternary */
/* eslint-disable vars-on-top */
/* eslint-disable one-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';
import { pick, removeUndefinedAndNullValues, isNotEmpty } from '../../utils/commonUtils';
import {
  parseConfigArray,
  inverseObjectArrays,
  extractTraits,
  unionArrays,
  extendTraits,
  mapTraits,
  formatTraits,
} from './util';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

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
    this.eventIncrements = config.eventIncrements || [];
    this.propIncrements = config.propIncrements || [];
    this.sourceName = config.sourceName;
    this.consolidatedPageCalls = Object.prototype.hasOwnProperty.call(
      config,
      'consolidatedPageCalls',
    )
      ? config.consolidatedPageCalls
      : true;
    this.trackCategorizedPages = config.trackCategorizedPages || false;
    this.trackNamedPages = config.trackNamedPages || false;
    this.groupKeySettings = config.groupKeySettings || [];
    this.peopleProperties = config.peopleProperties || [];
    this.crossSubdomainCookie = config.crossSubdomainCookie || false;
    this.secureCookie = config.secureCookie || false;
    this.persistence = config.persistence || 'none';
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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Mixpanel===');
    // eslint-disable-next-line no-var
    loadNativeSdk(document, window.mixpanel || []);
    const options = {
      cross_subdomain_cookie: this.crossSubdomainCookie || false,
      secure_cookie: this.secureCookie || false,
    };
    if (this.persistence !== 'none') {
      options.persistence_name = this.persistence;
    }
    if (this.dataResidency == 'eu') {
      // https://developer.mixpanel.com/docs/implement-mixpanel#section-implementing-mixpanel-in-the-european-union-eu
      options.api_host = 'https://api-eu.mixpanel.com';
    }
    window.mixpanel.init(this.token, options);
  }

  isLoaded() {
    logger.debug('in Mixpanel isLoaded');
    logger.debug(!!(window.mixpanel && window.mixpanel.config));
    window.mixpanel.register({ mp_lib: 'Rudderstack: web' });
    return !!(window.mixpanel && window.mixpanel.config);
  }

  isReady() {
    logger.debug('in Mixpanel isReady');
    return !!(window.mixpanel && window.mixpanel.config);
  }

  /**
   * Identify
   * @param {*} rudderElement
   */
  identify(rudderElement) {
    logger.debug('in Mixpanel identify');

    let peopleProperties = parseConfigArray(this.peopleProperties, 'property');
    peopleProperties = extendTraits(peopleProperties);
    const superProperties = parseConfigArray(this.superProperties, 'property');

    // eslint-disable-next-line camelcase
    const user_id = rudderElement.message.userId || rudderElement.message.anonymousId;
    let traits = formatTraits(rudderElement.message);
    const { email, username } = traits;
    // id
    if (user_id) window.mixpanel.identify(user_id);

    // name tag
    const nametag = email || username;
    if (nametag) window.mixpanel.name_tag(nametag);

    traits = extractTraits(traits, this.traitAliases);
    traits = removeUndefinedAndNullValues(traits);

    // determine which traits to union to existing properties and which to set as new properties
    const traitsToUnion = {};
    const traitsToSet = {};
    for (const key in traits) {
      if (!traits.hasOwnProperty(key)) continue;

      const trait = traits[key];
      if (Array.isArray(trait) && trait.length > 0) {
        traitsToUnion[key] = trait;
        // since mixpanel doesn't offer a union method for super properties we have to do it manually by retrieving the existing list super property
        // from mixpanel and manually unioning to it ourselves
        const existingTrait = window.mixpanel.get_property(key);
        if (existingTrait && Array.isArray(existingTrait)) {
          traits[key] = unionArrays(existingTrait, trait);
        }
      } else {
        traitsToSet[key] = trait;
      }
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
    logger.debug('in Mixpanel page');
    const { name, properties } = rudderElement.message;
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
    logger.debug('in Mixpanel track');
    const { message } = rudderElement;
    const eventIncrements = parseConfigArray(this.eventIncrements, 'property');
    const propIncrements = parseConfigArray(this.propIncrements, 'property');
    const event = get(message, 'event');
    const revenue = get(message, 'properties.revenue') || get(message, 'properties.total');
    const sourceName = this.sourceName;
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
    if (this.people) {
      // increment event count, check if the current event exists in eventIncrements
      if (eventIncrements.indexOf(event) !== -1) {
        window.mixpanel.people.increment(event);
        window.mixpanel.people.set('Last ' + event, new Date());
      }
      // increment property counts
      // eslint-disable-next-line guard-for-in
      for (const key in props) {
        const prop = props[key];
        if (prop && propIncrements.indexOf(key) != -1) {
          window.mixpanel.people.increment(key, prop);
        }
      }
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
    logger.debug('in Mixpanel group');
    const { userId, groupId, traits } = rudderElement.message;
    if (!userId) {
      logger.debug('===Mixpanel: valid userId is required for group===');
      return;
    }
    if (!groupId) {
      logger.debug('===Mixpanel: valid groupId is required for group===');
      return;
    }
    if (!this.groupKeySettings || this.groupKeySettings.length === 0) {
      logger.debug('===Mixpanel: groupIdentifierTraits is required for group===');
      return;
    }
    /**
     * groupIdentifierTraits: [ {trait: "<trait_value>"}, ... ]
     */
    const identifierTraitsList = parseConfigArray(this.groupKeySettings, 'groupKey');
    if (traits && Object.keys(traits).length) {
      identifierTraitsList.forEach((trait) => {
        window.mixpanel.get_group(trait, groupId).set_once(traits);
      });
    }
    identifierTraitsList.forEach((trait) => window.mixpanel.set_group(trait, [groupId]));
  }

  /**
   * @param {*} rudderElement
   */
  alias(rudderElement) {
    logger.debug('in Mixpanel alias');
    const { previousId, userId } = rudderElement.message;
    if (!previousId) {
      logger.debug('===Mixpanel: previousId is required for alias call===');
      return;
    }
    if (!userId) {
      logger.debug('===Mixpanel: userId is required for alias call===');
      return;
    }

    if (window.mixpanel.get_distinct_id && window.mixpanel.get_distinct_id() === userId) {
      logger.debug('===Mixpanel: userId is same as previousId. Skipping alias ===');
      return;
    }
    window.mixpanel.alias(userId, previousId);
  }
}
export default Mixpanel;
