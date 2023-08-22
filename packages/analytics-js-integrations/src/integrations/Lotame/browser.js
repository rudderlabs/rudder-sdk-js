/* eslint-disable class-methods-use-this */
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Lotame/constants';
import { LotameStorage } from './LotameStorage';

class Lotame {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.analytics = analytics;
    this.storage = LotameStorage;
    this.bcpUrlSettingsPixel = config.bcpUrlSettingsPixel;
    this.bcpUrlSettingsIframe = config.bcpUrlSettingsIframe;
    this.dspUrlSettingsPixel = config.dspUrlSettingsPixel;
    this.dspUrlSettingsIframe = config.dspUrlSettingsIframe;
    this.mappings = {};
    config?.mappings?.forEach(mapping => {
      const { key } = mapping;
      const { value } = mapping;
      this.mappings[key] = value;
    });
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===in init Lotame===');
    window.LOTAME_SYNCH_CALLBACK = () => {};
  }

  isLoaded() {
    logger.debug('in Lotame isLoaded');
    return true;
  }

  isReady() {
    return true;
  }

  addPixel(source, width, height) {
    logger.debug(`Adding pixel for :: ${source}`);

    const image = document.createElement('img');
    image.src = source;
    image.setAttribute('width', width);
    image.setAttribute('height', height);

    logger.debug(`Image Pixel :: ${image}`);
    document.getElementsByTagName('body')[0].appendChild(image);
  }

  addIFrame(source) {
    logger.debug(`Adding iframe for :: ${source}`);

    const iframe = document.createElement('iframe');
    iframe.src = source;
    iframe.title = 'empty';
    iframe.setAttribute('id', 'LOTCCFrame');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('role', 'presentation');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('style', 'border: 0px; width: 0px; height: 0px; display: block;');

    logger.debug(`IFrame :: ${iframe}`);
    document.getElementsByTagName('body')[0].appendChild(iframe);
  }

  syncPixel(userId) {
    logger.debug('===== in syncPixel ======');

    logger.debug('Firing DSP Pixel URLs');
    if (this.dspUrlSettingsPixel && this.dspUrlSettingsPixel.length > 0) {
      const currentTime = Date.now();
      this.dspUrlSettingsPixel.forEach(urlSettings => {
        const dspUrl = this.compileUrl(
          { ...this.mappings, userId, random: currentTime },
          urlSettings.dspUrlTemplate,
        );
        this.addPixel(dspUrl, '1', '1');
      });
    }

    logger.debug('Firing DSP IFrame URLs');
    if (this.dspUrlSettingsIframe && this.dspUrlSettingsIframe.length > 0) {
      const currentTime = Date.now();
      this.dspUrlSettingsIframe.forEach(urlSettings => {
        const dspUrl = this.compileUrl(
          { ...this.mappings, userId, random: currentTime },
          urlSettings.dspUrlTemplate,
        );
        this.addIFrame(dspUrl);
      });
    }

    this.storage.setLotameSynchTime(Date.now());
  }

  compileUrl(map, url) {
    let compiledUrl = url;
    Object.keys(map).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        const value = map[key];
        const replaceKey = `{{${key}}}`;
        const regex = new RegExp(replaceKey, 'gi');
        compiledUrl = compiledUrl.replace(regex, value);
      }
    });
    return compiledUrl;
  }

  identify(rudderElement) {
    logger.debug('in Lotame identify');
    const { userId } = rudderElement.message;
    this.syncPixel(userId);
  }

  page(rudderElement) {
    logger.debug('in Lotame page');

    logger.debug('Firing BCP Pixel URLs');
    if (this.bcpUrlSettingsPixel && this.bcpUrlSettingsPixel.length > 0) {
      const currentTime = Date.now();
      this.bcpUrlSettingsPixel.forEach(urlSettings => {
        const bcpUrl = this.compileUrl(
          { ...this.mappings, random: currentTime },
          urlSettings.bcpUrlTemplate,
        );
        this.addPixel(bcpUrl, '1', '1');
      });
    }

    logger.debug('Firing BCP IFrame URLs');
    if (this.bcpUrlSettingsIframe && this.bcpUrlSettingsIframe.length > 0) {
      const currentTime = Date.now();
      this.bcpUrlSettingsIframe.forEach(urlSettings => {
        const bcpUrl = this.compileUrl(
          { ...this.mappings, random: currentTime },
          urlSettings.bcpUrlTemplate,
        );
        this.addIFrame(bcpUrl);
      });
    }

    if (rudderElement.message.userId && this.isPixelToBeSynched()) {
      this.syncPixel(rudderElement.message.userId);
    }
  }

  isPixelToBeSynched() {
    const lastSynchedTime = this.storage.getLotameSynchTime();
    const currentTime = Date.now();
    if (!lastSynchedTime) {
      return true;
    }

    const difference = Math.floor((currentTime - lastSynchedTime) / (1000 * 3600 * 24));
    return difference >= 7;
  }
}

export { Lotame };
