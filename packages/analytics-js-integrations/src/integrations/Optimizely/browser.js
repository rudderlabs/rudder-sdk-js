/* eslint-disable class-methods-use-this */
import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Optimizely/constants';
import { mapRudderPropsToOptimizelyProps } from './utils';

class Optimizely {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.sendExperimentTrack = config.sendExperimentTrack;
    this.sendExperimentIdentify = config.sendExperimentIdentify;
    this.sendExperimentTrackAsNonInteractive = config.sendExperimentTrackAsNonInteractive;
    this.revenueOnlyOnOrderCompleted = config.revenueOnlyOnOrderCompleted;
    this.trackCategorizedPages = config.trackCategorizedPages;
    this.trackNamedPages = config.trackNamedPages;
    this.customCampaignProperties = config.customCampaignProperties
      ? config.customCampaignProperties
      : [];
    this.customExperimentProperties = config.customExperimentProperties
      ? config.customExperimentProperties
      : [];
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('=== in optimizely init ===');
    this.initOptimizelyIntegration(this.referrerOverride, this.sendDataToRudder);
  }

  isLoaded() {
    return !!(window.optimizely && window.optimizely.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window.optimizely && window.optimizely.push !== Array.prototype.push);
  }

  referrerOverride = referrer => {
    if (referrer) {
      window.optimizelyEffectiveReferrer = referrer;
      return referrer;
    }
    return undefined;
  };

  sendDataToRudder = campaignState => {
    logger.debug(campaignState);
    const { experiment, variation } = campaignState;
    const context = { integrations: { All: true } };
    const { audiences, campaignName, id, isInCampaignHoldback } = campaignState;

    // Reformatting this data structure into hash map so concatenating variation ids and names is easier later
    const audiencesMap = {};
    audiences.forEach(audience => {
      audiencesMap[audience.id] = audience.name;
    });

    const audienceIds = Object.keys(audiencesMap)
      .sort((a, b) => a.localeCompare(b))
      .join();
    const audienceNames = Object.values(audiencesMap)
      .sort((a, b) => a.localeCompare(b))
      .join(', ');

    if (this.sendExperimentTrack) {
      let props = {
        campaignName,
        campaignId: id,
        experimentId: experiment.id,
        experimentName: experiment.name,
        variationName: variation.name,
        variationId: variation.id,
        audienceId: audienceIds, // eg. '7527562222,7527111138'
        audienceName: audienceNames, // eg. 'Peaky Blinders, Trust Tree'
        isInCampaignHoldback,
      };

      // If this was a redirect experiment and the effective referrer is different from document.referrer,
      // this value is made available. So if a customer came in via google.com/ad -> tb12.com -> redirect experiment -> Belichickgoat.com
      // `experiment.referrer` would be google.com/ad here NOT `tb12.com`.
      if (experiment.referrer) {
        props.referrer = experiment.referrer;
        context.page = { referrer: experiment.referrer };
      }

      // For Google's nonInteraction flag
      if (this.sendExperimentTrackAsNonInteractive) props.nonInteraction = 1;

      // If customCampaignProperties is provided override the props with it.
      // If valid customCampaignProperties present it will override existing props.
      // const data = window.optimizely && window.optimizely.get("data");
      props = mapRudderPropsToOptimizelyProps(props, campaignState, this.customCampaignProperties);

      // Send to Rudder
      this.analytics.track('Experiment Viewed', props, context);
    }
    if (this.sendExperimentIdentify) {
      const traits = {};
      traits[`Experiment: ${experiment.name}`] = variation.name;

      // Send to Rudder
      this.analytics.identify(traits);
    }
  };

  initOptimizelyIntegration(referrerOverride, sendCampaignData) {
    const newActiveCampaign = (id, referrer) => {
      try {
        const state = window?.optimizely?.get('state');
        if (state) {
          const activeCampaigns = state.getCampaignStates({
            isActive: true,
          });
          const campaignState = activeCampaigns[id];
          if (referrer) campaignState.experiment.referrer = referrer;
          sendCampaignData(campaignState);
        }
      } catch (e) {
        logger.debug('Page loaded without Optimizely.')
      }
    };

    const checkReferrer = () => {
      try {
        const state = window?.optimizely?.get('state');
        if (state) {
          const referrer = state.getRedirectInfo() && state.getRedirectInfo().referrer;

          if (referrer) {
            referrerOverride(referrer);
            return referrer;
          }
        } else {
          return undefined;
        }
      } catch (e) {
        return undefined;
      }
    };

    const registerFutureActiveCampaigns = () => {
      window.optimizely = window.optimizely || [];
      window.optimizely.push({
        type: 'addListener',
        filter: {
          type: 'lifecycle',
          name: 'campaignDecided',
        },
        handler(event) {
          const { id } = event.data.campaign;
          newActiveCampaign(id);
        },
      });
    };

    const registerCurrentlyActiveCampaigns = () => {
      window.optimizely = window.optimizely || [];
      try {
        const state = window?.optimizely?.get('state');
        if (state) {
          const referrer = checkReferrer();
          const activeCampaigns = state.getCampaignStates({
            isActive: true,
          });
          Object.keys(activeCampaigns).forEach(id => {
            if (referrer) {
              newActiveCampaign(id, referrer);
            } else {
              newActiveCampaign(id);
            }
          });
        } else {
          window.optimizely.push({
            type: 'addListener',
            filter: {
              type: 'lifecycle',
              name: 'initialized',
            },
            handler() {
              checkReferrer();
            },
          });
        }
      } catch (e) {
        logger.debug('Page loaded without Optimizely.')
        window.optimizely.push({
          type: 'addListener',
          filter: {
            type: 'lifecycle',
            name: 'initialized',
          },
          handler() {
            checkReferrer();
          },
        });
      }

    };
    registerCurrentlyActiveCampaigns();
    registerFutureActiveCampaigns();
  }

  track(rudderElement) {
    logger.debug('in Optimizely web track');
    const eventProperties = rudderElement.message.properties;
    const { event } = rudderElement.message;
    if (eventProperties.revenue && this.revenueOnlyOnOrderCompleted) {
      if (event === 'Order Completed') {
        eventProperties.revenue = Math.round(eventProperties.revenue * 100);
      } else if (event !== 'Order Completed') {
        delete eventProperties.revenue;
      }
    }
    const eventName = event.replace(/:/g, '_'); // can't have colons so replacing with underscores
    const payload = {
      type: 'event',
      eventName,
      tags: eventProperties,
    };

    window.optimizely.push(payload);
  }

  page(rudderElement) {
    logger.debug('in Optimizely web page');

    const clonedRudderElement = rudderElement;
    const { category } = clonedRudderElement.message.properties;
    const { name } = clonedRudderElement.message;

    // categorized pages
    if (category && this.trackCategorizedPages) {
      clonedRudderElement.message.event = `Viewed ${category} page`;
      clonedRudderElement.message.type = 'track';
      this.track(clonedRudderElement);
    }

    // named pages
    if (name && this.trackNamedPages) {
      clonedRudderElement.message.event = `Viewed ${name} page`;
      clonedRudderElement.message.type = 'track';
      this.track(clonedRudderElement);
    }
  }
}

export default Optimizely;
