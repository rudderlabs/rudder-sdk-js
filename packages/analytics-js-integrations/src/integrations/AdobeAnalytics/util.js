/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable import/no-relative-packages */
import each from '@ndhoule/each';
import get from 'lodash.get';
import {
  toIso,
  getHashFromArray,
  isDefinedAndNotNullAndNotEmpty,
  isDefined,
} from '../../utils/commonUtils';
import logger from '../../../../analytics-v1.1/src/utils/logUtil';

let dynamicKeys = [];

const setDynamicKeys = dk => {
  dynamicKeys = dk;
};

const getDynamicKeys = () => {
  return dynamicKeys;
};

let config;
const setConfig = c => {
  config = c;
};

const getConfig = () => {
  return config;
};

const topLevelProperties = ['messageId', 'anonymousId', 'event'];

/* eslint-disable camelcase */
/**
 *
 * @param {} rudderElement
 * Quality of experience tracking includes quality of service (QoS) and error tracking, both are optional elements
 *  and are not required for core media tracking implementations.
 *
 * DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-qos/track-qos-overview.html?lang=en
 * DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-qos/track-qos-js/track-qos-js.html?lang=en
 */

const createQos = rudderElement => {
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { bitrate, startupTime, fps, droppedFrames } = properties;

  const qosData = va.MediaHeartbeat.createQoSObject(
    bitrate || 0,
    startupTime || 0,
    fps || 0,
    droppedFrames || 0,
  );
  return qosData;
};

/**
 *
 * @param {*} rudderElement
 * @param {*} mediaObj
 *
 * DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-ads/impl-std-ad-metadata/impl-std-ad-md-js/impl-std-ad-metadata-js.html?lang=en
 */

const standardVideoMetadata = (rudderElement, mediaObj) => {
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const metaKeys = va.MediaHeartbeat.VideoMetadataKeys;
  const { SHOW, SEASON, EPISODE, ASSET_ID, GENRE, FIRST_AIR_DATE, ORIGINATOR, NETWORK, RATING } =
    metaKeys;
  const stdVidMeta = {};
  const rudderAdbMap = {
    program: SHOW,
    season: SEASON,
    episode: EPISODE,
    assetId: ASSET_ID,
    contentAssetId: ASSET_ID,
    genre: GENRE,
    airdate: FIRST_AIR_DATE,
    publisher: ORIGINATOR,
    channel: NETWORK,
    rating: RATING,
  };

  Object.keys(rudderAdbMap).forEach(value => {
    stdVidMeta[rudderAdbMap[value]] = properties[value] || `no ${rudderAdbMap[value]}`;
  });

  mediaObj.setValue(va.MediaHeartbeat.MediaObjectKey.StandardVideoMetadata, stdVidMeta);
};

const standardAdMetadata = (rudderElement, adObj) => {
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const metaKeys = va.MediaHeartbeat.AdMetadataKeys;
  const stdAdMeta = {};
  const rudderAdbMap = {
    publisher: metaKeys.ADVERTISER,
  };

  // eslint-disable-next-line
  Object.keys(rudderAdbMap).forEach(value => {
    stdAdMeta[rudderAdbMap[value]] = properties[value] || `no ${rudderAdbMap[value]}`;
  });

  adObj.setValue(va.MediaHeartbeat.MediaObjectKey.StandardAdMetadata, stdAdMeta);
};

// clear the previously set keys for adobe analytics

const clearWindowSKeys = dk => {
  each(keys => {
    delete window.s[keys];
  }, dk);
  const presentKeys = dynamicKeys;
  presentKeys.length = 0;
  setDynamicKeys(presentKeys);
};

// update window keys for adobe analytics

const updateWindowSKeys = (value, key) => {
  if (isDefinedAndNotNullAndNotEmpty(key)) {
    dynamicKeys.push(key);
    window.s[key] = value;
  }
};

// update all the keys for adobe analytics which are common for all calls.

const updateCommonWindowSKeys = (rudderElement, pageName) => {
  const { properties, type, context } = rudderElement.message;
  let campaign;
  if (context && context.campaign) {
    campaign = context.campaign.name;
  } else {
    campaign = properties.campaign;
  }
  const channel = rudderElement.message.channel || properties.channel;
  const zip = context.traits.zip || properties.zip;
  const state = context.traits.state || properties.state;

  updateWindowSKeys(channel, 'channel');
  updateWindowSKeys(campaign, 'campaign');
  updateWindowSKeys(state, 'state');
  updateWindowSKeys(zip, 'zip');
  const name = context.page ? context.page.name : undefined;

  if (config.trackPageName && type === 'track') {
    updateWindowSKeys(properties.pageName || pageName || name, 'pageName');
  }
};
// TODO: Need to check why timestamp not setting
// DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/timestamp.html?lang=en

const calculateTimestamp = rudderElement => {
  const { properties, originalTimestamp, timestamp } = rudderElement.message;
  let timestampVal =
    originalTimestamp || timestamp || properties.originalTimestamp || properties.timestamp;
  // The s.timestamp variable is a string containing the date and time of the hit. Valid timestamp formats include ISO 8601 and Unix time.
  if (timestampVal) {
    if (typeof timestampVal !== 'string') {
      timestampVal = toIso(timestampVal);
    }
    if (
      (config.timestampOption === 'hybrid' && !config.preferVisitorId) ||
      config.timestampOption === 'enabled'
    ) {
      updateWindowSKeys(timestampVal, 'timestamp');
    }
  }
};

/**
 * @param  {} contextMap { "page.name" : "pName", "page.url": "pUrl"}
 * @param  {} rudderElement
 *  Find page.name, page.url from context/properties of rudder message.
 *  If key is one of anonymousId/userId/messageId it will fetch from message.
 *  If context = {"page": {"name": "Home Page", "url":"https://example.com"},{"path", "/page1"}}
 * @param  {} return a hash map of {"pName": "Home Page", "pUrl": "https://example.com"}
 */

const getDataFromContext = (contextMap, rudderElement) => {
  const { context, properties } = rudderElement.message;
  const contextDataMap = {};
  Object.keys(contextMap).forEach(value => {
    let val;
    if (value) {
      if (topLevelProperties.includes(value)) {
        val = rudderElement.message[value];
      } else {
        val = get(context, value) ? get(context, value) : get(properties, value);
      }
      if (val) {
        contextDataMap[contextMap[value]] = val;
      }
    }
  });
  return contextDataMap;
};

/**
 * @param  {} contextDataKey
 * @param  {} contextDataValue
 * Context data variables let you define custom variables on each page that processing rules can read.
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/contextdata.html?lang=en
 */

const setContextData = (contextDataKey, contextDataValue, video = false) => {
  const contextData = {};
  window.s.contextData[contextDataKey] = contextDataValue;
  dynamicKeys.push(`contextData.${contextDataKey}`);
  if (video) {
    contextData[contextDataKey] = contextDataValue;
    return contextData;
  }
  return null;
};

/**
 * @param  {} rudderElement
 * Context data variables let you define custom variables on each page that processing rules can read.
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/contextdata.html?lang=en
 */

const handleContextData = rudderElement => {
  window.s.contextData = {};
  const { properties } = rudderElement.message;
  const contextDataPrefixValue = config.contextDataPrefix ? `${config.contextDataPrefix}.` : '';
  if (properties) {
    each((value, key) => {
      setContextData(contextDataPrefixValue + key, value);
    }, properties);
  }

  const contextDataMappingHashmap = getHashFromArray(
    config.contextDataMapping,
    'from',
    'to',
    false,
  );
  const keyValueContextData = getDataFromContext(contextDataMappingHashmap, rudderElement);
  if (keyValueContextData) {
    each((value, key) => {
      if (isDefinedAndNotNullAndNotEmpty(key)) {
        setContextData(key, value);
      }
    }, keyValueContextData);
  }
};

/**
 * @param  {} rudderElement
 * eVars are custom variables that you can use however you’d like.
 * Updates eVar variable of window.s
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/evar.html?lang=en
 */

const handleEVars = rudderElement => {
  const { properties } = rudderElement.message;
  const eVarMappingHashmap = getHashFromArray(config.eVarMapping, 'from', 'to', false);
  const eVarHashmapMod = {};
  Object.keys(eVarMappingHashmap).forEach(value => {
    eVarHashmapMod[value] = `eVar${eVarMappingHashmap[value]}`;
  });
  if (eVarHashmapMod) {
    each((value, key) => {
      if (eVarHashmapMod[key]) {
        updateWindowSKeys(value.toString(), eVarHashmapMod[key]);
      }
    }, properties);
  }
};
/**
 * @param  {} rudderElement
 * Hierarchy variables are custom variables that let you see a site’s structure.
 * Updates hier varaible of window.s
 *
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/hier.html?lang=en
 */

const handleHier = rudderElement => {
  const { properties } = rudderElement.message;
  const hierMappingHashmap = getHashFromArray(config.hierMapping, 'from', 'to', false);
  const hierHashmapMod = {};
  Object.keys(hierMappingHashmap).forEach(value => {
    hierHashmapMod[value] = `hier${hierMappingHashmap[value]}`;
  });
  if (hierHashmapMod) {
    each((value, key) => {
      if (hierHashmapMod[key]) {
        updateWindowSKeys(value.toString(), hierHashmapMod[key]);
      }
    }, properties);
  }
};

/**
 * @param  {} rudderElement
 * List variables are custom variables that you can use however you’d like.
 * They work similarly to eVars, except they can contain multiple values in the same hit.
 *
 * If there are many values to be appended in a particular list it will be separated by
 * the delimiter set.
 *
 * Sets list variable of window.s
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/list.html?lang=en
 */

const handleLists = rudderElement => {
  const { properties } = rudderElement.message;
  const listMappingHashmap = getHashFromArray(config.listMapping, 'from', 'to', false);
  const listDelimiterHashmap = getHashFromArray(config.listDelimiter, 'from', 'to', false);
  if (properties) {
    each((value, key) => {
      if (listMappingHashmap[key] && listDelimiterHashmap[key]) {
        if (typeof value !== 'string' && !Array.isArray(value)) {
          logger.error('list variable is neither a string nor an array');
          return;
        }
        const delimiter = listDelimiterHashmap[key];
        const listValue = `list${listMappingHashmap[key]}`;
        if (typeof value === 'string') {
          value = value.replace(/\s*,+\s*/g, delimiter);
        } else {
          value = value.join(delimiter);
        }
        updateWindowSKeys(value.toString(), listValue);
      }
    }, properties);
  }
};

/**
 * @param  {} rudderElement
 * @description Props are custom variables that you can use however you’d like.
 * They do not persist beyond the hit that they are set.
 * prop variable of window.s is updated
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/prop.html?lang=en
 */

const handleCustomProps = rudderElement => {
  const { properties } = rudderElement.message;
  const customPropsMappingHashmap = getHashFromArray(
    config.customPropsMapping,
    'from',
    'to',
    false,
  );
  const propsDelimiterHashmap = getHashFromArray(config.propsDelimiter, 'from', 'to', false);
  if (properties) {
    each((value, key) => {
      if (customPropsMappingHashmap[key]) {
        if (typeof value !== 'string' && !Array.isArray(value)) {
          logger.error('prop variable is neither a string nor an array');
          return;
        }
        const delimiter = propsDelimiterHashmap[key] ? propsDelimiterHashmap[key] : '|';
        const propValue = `prop${customPropsMappingHashmap[key]}`;
        if (typeof value === 'string') {
          value = value.replace(/\s*,+\s*/g, delimiter);
        } else {
          value = value.join(delimiter);
        }
        updateWindowSKeys(value.toString(), propValue);
      }
    }, properties);
  }
};

const mapMerchEvents = (event, properties) => {
  const eventMerchEventToAdobeEventHashmap = getHashFromArray(config.eventMerchEventToAdobeEvent);

  const merchMap = [];
  if (!eventMerchEventToAdobeEventHashmap[event.toLowerCase()] || !config.eventMerchProperties) {
    return merchMap;
  }
  const adobeEvent = eventMerchEventToAdobeEventHashmap[event.toLowerCase()].split(',');
  let eventString;
  each(rudderProp => {
    if (rudderProp.eventMerchProperties in properties) {
      each(value => {
        if (properties[rudderProp.eventMerchProperties])
          eventString = `${value}=${properties[rudderProp.eventMerchProperties]}`;
        merchMap.push(eventString);
      }, adobeEvent);
    }
  }, config.eventMerchProperties);
  return merchMap;
};

/**
 * @param  {} event
 * @param  {} properties
 * @description Function to set event string of Ecomm events
 * Updates the "events" property of window.s
 */

const setEventsString = (event, properties, adobeEventName) => {
  // adobe events are taken as comma separated string
  let adobeEventArray = adobeEventName ? adobeEventName.split(',') : [];
  const merchMap = mapMerchEvents(event, properties);
  adobeEventArray = adobeEventArray.concat(merchMap);
  adobeEventArray = adobeEventArray.filter(item => {
    return !!item;
  });

  const productMerchEventToAdobeEventHashmap = getHashFromArray(
    config.productMerchEventToAdobeEvent,
  );
  if (productMerchEventToAdobeEventHashmap[event.toLowerCase()]) {
    each(value => {
      adobeEventArray.push(value);
    }, productMerchEventToAdobeEventHashmap);
  }
  const adobeEvent = adobeEventArray.join(',');
  updateWindowSKeys(adobeEvent, 'events');

  /**
   * The s.linkTrackEvents variable is a string containing a comma-delimited list of
   *  events that you want to include in link tracking image requests
   */
  window.s.linkTrackEvents = adobeEvent;
};

/**
 * @param  {} event
 * @param  {} properties
 * @param  {} adobeEvent
 * @description Creates the merchendising product eventsString for each product which will be added to the
 * key products along with the evars as set.
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/products.html?lang=en
 * @returns [] merchMap
 */

const mapMerchProductEvents = (event, properties, adobeEvent) => {
  const productMerchEventToAdobeEventHashmap = getHashFromArray(
    config.productMerchEventToAdobeEvent,
  );
  // converting string to array if more than 1 event is there.
  adobeEvent = adobeEvent.split(',');
  const merchMap = [];
  let eventString;
  if (
    !productMerchEventToAdobeEventHashmap[event.toLowerCase()] ||
    !config.productMerchProperties
  ) {
    return merchMap;
  }

  each(rudderProp => {
    // if property mapped with products. as starting handle differently
    if (rudderProp.productMerchProperties.startsWith('products.')) {
      const key = rudderProp.productMerchProperties.split('.');
      // take the keys after products. and find the value in properties
      const value = get(properties, key[1]);
      if (isDefined(value)) {
        each(val => {
          eventString = `${val}=${value}`;
          merchMap.push(eventString);
        }, adobeEvent);
      }
    } else if (rudderProp.productMerchProperties in properties) {
      each(val => {
        eventString = `${val}=${properties[rudderProp.productMerchProperties]}`;
        merchMap.push(eventString);
      }, adobeEvent);
    }
  }, config.productMerchProperties);
  return merchMap;
};

/**
 * @param  {} properties
 * @description set eVars for product level properties
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/evar-merchandising.html?lang=en
 * @returns eVars as a string with delimiter "|"
 */

const mapMerchProductEVars = properties => {
  const productMerchEvarsMapHashmap = getHashFromArray(
    config.productMerchEvarsMap,
    'from',
    'to',
    false,
  );
  const eVars = [];
  each((value, key) => {
    // if property mapped with products. as starting handle differently
    if (key.startsWith('products.')) {
      key = key.split('.');
      // take the keys after products. and find the value in properties
      const productValue = get(properties, key[1]);
      if (isDefined(productValue)) {
        eVars.push(`eVar${value}=${productValue}`);
      }
    } else if (key in properties) {
      eVars.push(`eVar${value}=${properties[key]}`);
    }
  }, productMerchEvarsMapHashmap);
  return eVars.join('|');
};

/**
 * @param  {} event
 * @param  {} prodFields
 * @param  {} adobeEvent
 * @description set products key for window.s
 * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/products.html?lang=en
 */

const mapProducts = (event, prodFields, adobeEvent) => {
  const prodString = [];
  prodFields.forEach(value => {
    const category = value.category || '';
    const quantity = value.quantity || 1;
    const total = value.price ? (value.price * quantity).toFixed(2) : 0;
    let item;
    if (config.productIdentifier === 'id') {
      item = value.product_id || value.id;
    } else {
      item = value[config.productIdentifier];
    }
    const eventString = mapMerchProductEvents(event, value, adobeEvent).join('|');
    const prodEVarsString = mapMerchProductEVars(value);
    if (eventString !== '' || prodEVarsString !== '') {
      const test = [category, item, quantity, total, eventString, prodEVarsString].map(val => {
        if (val == null) {
          return String(val);
        }
        return val;
      });
      prodString.push(test.join(';'));
    } else {
      const test = [category, item, quantity, total]
        .map(val => {
          if (val === null) {
            return String(val);
          }
          return val;
        })
        .join(';');
      prodString.push(test);
    }
  });
  updateWindowSKeys(prodString, 'products');
};

/**
 * @param  {} event
 * @param  {} properties
 * @description Function to set product string for product level of Ecomm events
 */

const setProductString = (event, properties) => {
  const productMerchEventToAdobeEventHashmap = getHashFromArray(
    config.productMerchEventToAdobeEvent,
  );
  const adobeEvent = productMerchEventToAdobeEventHashmap[event.toLowerCase()];
  if (adobeEvent) {
    const isSingleProdEvent =
      adobeEvent === 'scAdd' ||
      adobeEvent === 'scRemove' ||
      (adobeEvent === 'prodView' && event.toLowerCase() !== 'product list viewed') ||
      !Array.isArray(properties.products);
    const prodFields = isSingleProdEvent ? [properties] : properties.products;
    mapProducts(event, prodFields, adobeEvent);
  }
};

/**
 * @param  {} rudderElement
 * @param  {} adobeEventName
 *
 * Update window variables and do adobe track calls
 */
const processEvent = (rudderElement, adobeEventName, pageName) => {
  const { properties, event } = rudderElement.message;
  const { currency } = properties;
  updateCommonWindowSKeys(rudderElement, pageName);
  calculateTimestamp(rudderElement);
  // useful for setting evar as amount value if this is set
  if (currency !== 'USD') {
    updateWindowSKeys(currency, 'currencyCode');
  }

  setEventsString(event, properties, adobeEventName);
  setProductString(event, properties);

  handleContextData(rudderElement);
  handleEVars(rudderElement);
  handleHier(rudderElement);
  handleLists(rudderElement);
  handleCustomProps(rudderElement);

  /**
   * The s.linkTrackVars variable is a string containing a comma-delimited list of variables that you want to
   * include in link tracking image requests
   */

  window.s.linkTrackVars = dynamicKeys.join(',');

  /**
   * The tl() method is an important core component to Adobe Analytics.
   * It takes all Analytics variables defined on the page, compiles them into an image request,
   * and sends that data to Adobe data collection servers. It works similarly to the t() method,
   * however this method does not increment page views.
   * It is useful for tracking links and other elements that wouldn’t be considered a full page load.
   */
  window.s.tl(true, 'o', event);
};

const handleVideoContextData = rudderElement => {
  let contextData;
  const { properties } = rudderElement.message;
  const contextDataPrefixValue = config.contextDataPrefix ? `${config.contextDataPrefix}.` : '';
  if (properties) {
    each((value, key) => {
      contextData = {
        ...contextData,
        ...setContextData(contextDataPrefixValue + key, value, true),
      };
    }, properties);
  }
  const contextDataMappingHashmap = getHashFromArray(
    config.contextDataMapping,
    'from',
    'to',
    false,
  );
  const keyValueContextData = getDataFromContext(contextDataMappingHashmap, rudderElement);
  if (keyValueContextData) {
    each((value, key) => {
      if (isDefinedAndNotNullAndNotEmpty(key)) {
        contextData = { ...contextData, ...setContextData(key, value, true) };
      }
    }, keyValueContextData);
  }
  return contextData;
};

export {
  processEvent,
  createQos,
  standardVideoMetadata,
  clearWindowSKeys,
  updateWindowSKeys,
  updateCommonWindowSKeys,
  calculateTimestamp,
  handleContextData,
  setContextData,
  handleEVars,
  handleHier,
  handleLists,
  handleCustomProps,
  setEventsString,
  mapMerchEvents,
  setProductString,
  mapProducts,
  mapMerchProductEvents,
  mapMerchProductEVars,
  getDataFromContext,
  standardAdMetadata,
  setDynamicKeys,
  getDynamicKeys,
  setConfig,
  getConfig,
  handleVideoContextData,
};
