import {
  isErrorReportingEnabled,
  getErrorReportingProviderNameFromConfig,
  isMetricsReportingEnabled,
} from '@rudderstack/analytics-js/components/utilities/statsCollection';

describe('Stats Collection Utilities', () => {
  describe('isErrorReportingEnabled', () => {
    it('should return true when error reporting is enabled', () => {
      const sourceConfig = {
        statsCollection: {
          errors: {
            enabled: true,
          },
        },
      };
      expect(isErrorReportingEnabled(sourceConfig)).toBe(true);
    });

    it('should return false when error reporting is not enabled', () => {
      const sourceConfig = {
        statsCollection: {
          errors: {
            enabled: false,
          },
        },
      };
      expect(isErrorReportingEnabled(sourceConfig)).toBe(false);
    });

    it('should return false when error reporting is not configured', () => {
      const sourceConfig = {};
      expect(isErrorReportingEnabled(sourceConfig)).toBe(false);
    });
  });

  describe('getErrorReportingProviderNameFromConfig', () => {
    it('should return the provider name when it is defined', () => {
      const sourceConfig = {
        statsCollection: {
          errors: {
            enabled: true,
            provider: 'bugsnag',
          },
        },
      };
      expect(getErrorReportingProviderNameFromConfig(sourceConfig)).toBe('bugsnag');
    });

    it('should return undefined when error reporting is not configured', () => {
      const sourceConfig = {};
      expect(getErrorReportingProviderNameFromConfig(sourceConfig)).toBe(undefined);
    });
  });

  describe('isMetricsReportingEnabled', () => {
    it('should return true when metrics reporting is enabled', () => {
      const sourceConfig = {
        statsCollection: {
          metrics: {
            enabled: true,
          },
        },
      };
      expect(isMetricsReportingEnabled(sourceConfig)).toBe(true);
    });

    it('should return false when metrics reporting is not enabled', () => {
      const sourceConfig = {
        statsCollection: {
          metrics: {
            enabled: false,
          },
        },
      };
      expect(isMetricsReportingEnabled(sourceConfig)).toBe(false);
    });

    it('should return false when metrics reporting is not configured', () => {
      const sourceConfig = {};
      expect(isMetricsReportingEnabled(sourceConfig)).toBe(false);
    });
  });
});
