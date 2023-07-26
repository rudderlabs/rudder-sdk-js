/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Qualtrics===');
    if (!this.projectId) {
      logger.debug('Project ID missing');
      return;
    }

    if (!this.brandId) {
      logger.debug('Brand ID missing');
      return;
    }

    loadNativeSdk(this.projectId, this.brandId);
  }

  isLoaded() {
    logger.debug('===in Qualtrics isLoaded===');
    return !!(window._qsie && window.QSI && window.QSI.API);
  }

  isReady() {
    logger.debug('===in Qualtrics isReady===');
    return !!(window._qsie && window.QSI && window.QSI.API);
  }

  page(rudderElement) {
    logger.debug('===in Qualtrics page===');
    const { message } = rudderElement;
    if (!message) {
      logger.debug('Message field is missing');
      return;
    }

    if (this.enableGenericPageTitle) {
      window._qsie.push('Viewed a Page');
      return;
    }

    const { name, category, properties } = message;
    const categoryField = category || properties?.category || null;

    if (!categoryField && !name) {
      logger.debug('generic title is disabled and no name or category field found');
      return;
    }
    const dynamicTitle =
      categoryField && name ? `Viewed ${categoryField} ${name} Page` : `Viewed ${name} Page`;

    window._qsie.push(dynamicTitle);
  }

  track(rudderElement) {
    logger.debug('===in Qualtrics track===');
    const { message } = rudderElement;
    if (!message) {
      logger.debug('Message field is missing');
      return;
    }
    if (!message.event) {
      logger.debug('Event field is undefined');
      return;
    }
    window._qsie.push(message.event);
  }
}
export default Qualtrics;
