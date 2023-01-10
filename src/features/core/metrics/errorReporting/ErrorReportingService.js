import { get } from '../../../../utils/utils';
import { BugsnagProvider, ERROR_REPORT_PROVIDER_NAME_BUGSNUG } from './providers/Bugsnag';
import { ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME } from '../../../../utils/constants';

const DEFAULT_ERROR_REPORT_PROVIDER = ERROR_REPORT_PROVIDER_NAME_BUGSNUG;
const AVAILABLE_ERROR_REPORT_PROVIDERS = [ERROR_REPORT_PROVIDER_NAME_BUGSNUG];
const ERROR_REPORTS_ENABLED_CONFIG_KEY = 'statsCollection.errorReports.enabled';
const ERROR_REPORTS_PROVIDER_NAME_CONFIG_KEY = 'statsCollection.errorReports.provider';

// TODO: remove the '|| true' when we can get this config value from response
const getErrorReportEnabledFromConfig = (sourceConfig) =>
  get(sourceConfig, ERROR_REPORTS_ENABLED_CONFIG_KEY) || true;

const getProviderNameFromConfig = (sourceConfig) =>
  get(sourceConfig, ERROR_REPORTS_PROVIDER_NAME_CONFIG_KEY);

class ErrorReportingService {
  constructor(logger) {
    this.isEnabled = false;
    this.providerName = DEFAULT_ERROR_REPORT_PROVIDER;
    this.provider = undefined;
    this.providerClient = undefined;
    this.logger = logger.error;
    this.onClientReady = this.onClientReady.bind(this);
    this.exposeToGlobal = this.exposeToGlobal.bind(this);
  }

  init(sourceConfig, sourceId) {
    if (!sourceConfig || !sourceId) {
      this.logger(
        `[Analytics] ErrorReporting :: Invalid configuration or missing source id provided.`,
      );
      return;
    }

    // Initialize error reporting based on enable option from sourceConfig
    if (getErrorReportEnabledFromConfig(sourceConfig)) {
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

    if (!providerName || !AVAILABLE_ERROR_REPORT_PROVIDERS.includes(providerName)) {
      this.logger(
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
      case ERROR_REPORT_PROVIDER_NAME_BUGSNUG:
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
    if (this.provider?.client) {
      try {
        this.provider.client.leaveBreadcrumb(breadcrumb);
      } catch (e) {
        this.logger(`[Analytics] ErrorReporting :: leaveBreadcrumb method ${e.toString()}`);
      }
    }
  }

  notify(error) {
    if (this.provider?.client) {
      try {
        this.provider.client.notify(error);
      } catch (e) {
        this.logger(`[Analytics] ErrorReporting :: notify method ${e.toString()}`);
      }
    }
  }
}

export { ErrorReportingService };
