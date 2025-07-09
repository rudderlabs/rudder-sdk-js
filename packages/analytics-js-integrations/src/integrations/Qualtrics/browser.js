/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
// eslint-disable-next-line no-nested-ternary
// eslint-disable-next-line class-methods-use-this
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
/* eslint-disable class-methods-use-this */
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Qualtrics {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.projectId = config.projectId;
    this.brandId = config.brandId;
    this.enableGenericPageTitle = config.enableGenericPageTitle;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (!this.projectId) {
      logger.error('Project ID missing');
      return;
    }

    if (!this.brandId) {
      logger.error(`${DISPLAY_NAME} :Brand ID missing`);
      return;
    }

    loadNativeSdk(this.projectId, this.brandId);
  }

  isLoaded() {
    return !!(window._qsie && window.QSI?.API);
  }

  isReady() {
    return this.isLoaded();
  }

  page(rudderElement) {
    const { message } = rudderElement;
    if (!message) {
      logger.error('Message field is missing');
      return;
    }

    if (this.enableGenericPageTitle) {
      window._qsie.push('Viewed a Page');
      return;
    }

    const { name, category, properties } = message;
    const categoryField = category || properties?.category || null;

    if (!categoryField && !name) {
      logger.error('generic title is disabled and no name or category field found');
      return;
    }
    const dynamicTitle =
      categoryField && name ? `Viewed ${categoryField} ${name} Page` : `Viewed ${name} Page`;

    window._qsie.push(dynamicTitle);
  }

  track(rudderElement) {
    const { message } = rudderElement;
    if (!message) {
      logger.error('Message field is missing');
      return;
    }
    if (!message.event) {
      logger.error('Event field is undefined');
      return;
    }
    window._qsie.push(message.event);
  }
}
export default Qualtrics;
