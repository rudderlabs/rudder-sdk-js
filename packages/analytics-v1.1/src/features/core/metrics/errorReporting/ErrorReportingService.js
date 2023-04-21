import { get } from '../../../../utils/utils';
import { BugsnagProvider, ERROR_REPORT_PROVIDER_NAME_BUGSNAG } from './providers/Bugsnag';
import { ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME } from '../../../../utils/constants';

const DEFAULT_ERROR_REPORT_PROVIDER = ERROR_REPORT_PROVIDER_NAME_BUGSNAG;
const AVAILABLE_ERROR_REPORT_PROVIDERS = [ERROR_REPORT_PROVIDER_NAME_BUGSNAG];
const ERRORS_COLLECTION_ENABLED_CONFIG_KEY = 'statsCollection.errors.enabled';
const ERRORS_COLLECTION_PROVIDER_NAME_CONFIG_KEY = 'statsCollection.errors.provider';

const getErrorCollectionEnabledFromConfig = (sourceConfig) =>
  get(sourceConfig, ERRORS_COLLECTION_ENABLED_CONFIG_KEY) || false;

const getProviderNameFromConfig = (sourceConfig) =>
  get(sourceConfig, ERRORS_COLLECTION_PROVIDER_NAME_CONFIG_KEY);

class ErrorReportingService {
  constructor(logger) {
    this.isEnabled = false;
    this.providerName = DEFAULT_ERROR_REPORT_PROVIDER;
    this.provider = undefined;
    this.logger = logger;
    this.onClientReady = this.onClientReady.bind(this);
    this.exposeToGlobal = this.exposeToGlobal.bind(this);
  }

  init(sourceConfig, sourceId) {
    if (!sourceConfig || !sourceId) {
      this.logger.error(
        `[Analytics] ErrorReporting :: Invalid configuration or missing source id provided.`,
      );
      return;
    }

    // Initialize error reporting based on enable option from sourceConfig
    if (getErrorCollectionEnabledFromConfig(sourceConfig) === true) {
      this.enable();
      this.setProviderName(getProviderNameFromConfig(sourceConfig));
      this.initProvider(sourceConfig, sourceId);
    } else {
      this.disable();
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  setProviderName(providerName) {
    if (!providerName) {
      this.providerName = DEFAULT_ERROR_REPORT_PROVIDER;
      return;
    }

    if (providerName && !AVAILABLE_ERROR_REPORT_PROVIDERS.includes(providerName)) {
      this.logger.error(
        `[Analytics] ErrorReporting :: Invalid error reporting provider value. Value should be one of: ${AVAILABLE_ERROR_REPORT_PROVIDERS.join(
          ',',
        )}`,
      );
      return;
    }

    this.providerName = providerName;
  }

  initProvider(sourceConfig, sourceId) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (this.providerName) {
      case ERROR_REPORT_PROVIDER_NAME_BUGSNAG:
        this.provider = new BugsnagProvider(sourceId, this.onClientReady);
        break;
      default:
        break;
    }
  }

  onClientReady() {
    this.exposeToGlobal();
  }

  // Expose the error reporting service as global variable after provider is ready,
  // so it can be used without injecting the service to consumer methods
  exposeToGlobal() {
    window.rudderanalytics[ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME] = this;
  }

  leaveBreadcrumb(breadcrumb) {
    if (this.provider) {
      try {
        this.provider.leaveBreadcrumb(breadcrumb);
      } catch (e) {
        this.logger.error(`[Analytics] ErrorReporting :: leaveBreadcrumb method ${e.toString()}`);
      }
    }
  }

  notify(error) {
    if (this.provider) {
      try {
        this.provider.notify(error);
      } catch (e) {
        this.logger.error(`[Analytics] ErrorReporting :: notify method ${e.toString()}`);
      }
    }
  }
}

export { ErrorReportingService };
