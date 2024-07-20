import GA4 from '../GA4/browser';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default class GA4_V2 {
  constructor(config, analytics, destinationInfo) {
    this.ga4Instance = new GA4(config, analytics, destinationInfo);
  }

  init() {
    return this.ga4Instance.init();
  }

  isLoaded() {
    return this.ga4Instance.isLoaded();
  }

  isReady() {
    return this.ga4Instance.isReady();
  }

  identify(rudderElement) {
    return this.ga4Instance.identify(rudderElement);
  }

  track(rudderElement) {
    return this.ga4Instance.track(rudderElement);
  }

  page(rudderElement) {
    return this.ga4Instance.page(rudderElement);
  }

  group(rudderElement) {
    return this.ga4Instance.group(rudderElement);
  }

  getDataForIntegrationsObject() {
    return this.ga4Instance.getDataForIntegrationsObject();
  }

  // Add any additional methods or overrides here
}
