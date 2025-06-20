/* eslint-disable compat/compat */
import { defaultHttpClient } from '@rudderstack/analytics-js-common/__mocks__/HttpClient';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { resetState, state } from '../../../src/state';
import { ErrorHandler } from '../../../src/services/ErrorHandler';

describe('ErrorHandler', () => {
  let errorHandlerInstance: ErrorHandler;

  beforeEach(() => {
    resetState();
    errorHandlerInstance = new ErrorHandler(defaultHttpClient, defaultLogger);
    errorHandlerInstance.init();
  });

  it('should attach error listeners for unhandled errors', () => {
    const onErrorSpy = jest.spyOn(errorHandlerInstance, 'onError');

    // Dispatch an unhandled error
    const errorEvent = new ErrorEvent('error', { error: new Error('dummy error') });
    (globalThis as typeof window).dispatchEvent(errorEvent);

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith({
      error: errorEvent,
      context: 'ErrorHandler',
      customMessage: undefined,
      errorType: 'unhandledException',
    });

    onErrorSpy.mockReset();

    // Dispatch an unhandled rejection
    const promiseRejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      reason: new Error('dummy error'),
      promise: Promise.resolve(),
    });
    (globalThis as typeof window).dispatchEvent(promiseRejectionEvent);

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith({
      error: promiseRejectionEvent,
      context: 'ErrorHandler',
      customMessage: undefined,
      errorType: 'unhandledPromiseRejection',
    });
  });

  describe('leaveBreadcrumb', () => {
    it('should leave breadcrumb message', () => {
      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message');
      expect(state.reporting.breadcrumbs.value.length).toBe(1);
      expect(state.reporting.breadcrumbs.value).toEqual([
        {
          type: 'manual',
          metaData: {},
          name: 'sample breadcrumb message',
          timestamp: expect.any(Date),
        },
      ]);
    });

    it('should append breadcrumb messages', () => {
      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message 1');
      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message 2');
      expect(state.reporting.breadcrumbs.value.length).toBe(2);
      expect(state.reporting.breadcrumbs.value).toEqual([
        {
          type: 'manual',
          metaData: {},
          name: 'sample breadcrumb message 1',
          timestamp: expect.any(Date),
        },
        {
          type: 'manual',
          metaData: {},
          name: 'sample breadcrumb message 2',
          timestamp: expect.any(Date),
        },
      ]);
    });

    it('should handle error if leaveBreadcrumb fails', () => {
      const onErrorSpy = jest.spyOn(errorHandlerInstance, 'onError');

      // @ts-expect-error cause an error for testing
      state.reporting.breadcrumbs.value = null;

      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message');

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'ErrorHandler',
        customMessage: 'Failed to log breadcrumb',
        groupingHash: 'Failed to log breadcrumb',
      });

      onErrorSpy.mockRestore();
    });
  });

  describe('onError', () => {
    it('should skip processing if error is not a valid error', async () => {
      await errorHandlerInstance.onError({
        error: {},
        context: 'Test',
      });

      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith('ErrorHandler:: Ignoring a non-error: {}.');

      // It should not be logged to the console
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
    });

    it('should skip unhandled errors if they are not originated from the sdk', async () => {
      // For this error, the stacktrace would not contain the sdk file names
      await errorHandlerInstance.onError({
        error: new Error('dummy error'),
        context: 'Test',
        customMessage: undefined,
        // @ts-expect-error not using the enum value for testing
        errorType: 'unhandledException',
      });

      // It should not be logged to the console
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
    });

    it('should not skip handled errors even if they are not originated from the sdk', async () => {
      // Enable error reporting
      state.reporting.isErrorReportingEnabled.value = true;

      // For this error, the stacktrace would not contain the sdk file names
      await errorHandlerInstance.onError({
        error: new Error('dummy error'),
        context: 'Test',
      });

      // It should be reported to the metrics service
      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(1);

      // It should be logged to the console
      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    });

    it('should not log unhandled errors to the console', async () => {
      await errorHandlerInstance.onError({
        error: new Error('dummy error'),
        context: 'Test',
        customMessage: undefined,
        // @ts-expect-error not using the enum value for testing
        errorType: 'unhandledException',
      });

      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
    });

    it('should log unhandled errors that are explicitly dispatched by the SDK', async () => {
      const error = new Error('dummy error');
      // Explicitly mark the error as dispatched by the SDK
      error.stack += '[SDK DISPATCHED ERROR]';
      const errorEvent = new ErrorEvent('error', { error });

      await errorHandlerInstance.onError({
        error: errorEvent,
        // @ts-expect-error not using the enum value for testing
        errorType: 'unhandledException',
        context: 'Test',
        customMessage: undefined,
      });

      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith('Test:: dummy error');
    });

    it('should not notify errors but log them if error reporting is disabled', async () => {
      state.reporting.isErrorReportingEnabled.value = false;
      await errorHandlerInstance.onError({ error: new Error('dummy error'), context: 'Test' });

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(0);
      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith('Test:: dummy error');
    });

    it('should not notify errors but log them if the error message is not allowed to be notified', async () => {
      state.reporting.isErrorReportingEnabled.value = true;
      // "The request failed" is one of the messages that should not be notified
      await errorHandlerInstance.onError({
        error: new Error('The request failed due to some issue'),
        context: 'Test',
      });

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(0);
      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'Test:: The request failed due to some issue',
      );
    });

    it('should notify errors if error reporting is enabled and the error message is allowed to be notified', async () => {
      state.reporting.isErrorReportingEnabled.value = true;
      state.lifecycle.writeKey.value = 'dummy-write-key';
      state.metrics.metricsServiceUrl.value = 'https://dummy.dataplane.com/rsaMetrics';

      const error = new Error('dummy error');
      error.stack =
        'Error: Test:: dummy error\n    at Object.<anonymous> (https://cdn.rudderlabs.com/v3/modern/rsa.min.js:1:1)';
      await errorHandlerInstance.onError({
        error,
        context: 'Test',
      });

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(1);
      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledWith({
        url: 'https://dummy.dataplane.com/rsaMetrics',
        options: {
          method: 'POST',
          data: expect.any(String),
          sendRawData: true,
        },
        isRawResponse: true,
      });
    });

    it('should log error if an error occurs while handling an error', async () => {
      state.reporting.isErrorReportingEnabled.value = true;

      defaultHttpClient.getAsyncData.mockImplementationOnce(() => {
        throw new Error('Failed to notify error');
      });

      const error = new Error('dummy error');
      error.stack =
        'Error: Test:: dummy error\n    at Object.<anonymous> (https://cdn.rudderlabs.com/v3/modern/rsa.min.js:1:1)';
      await errorHandlerInstance.onError({
        error,
        context: 'Test',
      });

      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'ErrorHandler:: Failed to handle the error.',
        new Error('Failed to notify error'),
      );
    });

    it('should generate grouping hash for CDN installations', async () => {
      // @ts-expect-error for testing
      state.context.app.value.installType = 'cdn';
      state.reporting.isErrorReportingEnabled.value = true;

      const getBugsnagErrorEventSpy = jest.spyOn(
        require('../../../src/services/ErrorHandler/utils'),
        'getBugsnagErrorEvent',
      );

      const error = new Error('dummy error');
      error.stack =
        'Error: Test:: dummy error\n    at Object.<anonymous> (https://cdn.rudderlabs.com/v3/modern/rsa.min.js:1:1)';

      await errorHandlerInstance.onError({
        error,
        context: 'Test',
        customMessage: 'Sample custom message',
      });

      expect(getBugsnagErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(getBugsnagErrorEventSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        'Test:: Sample custom message - dummy error',
      );
    });

    it('should not generate grouping hash for non-CDN installations', async () => {
      // @ts-expect-error for testing
      state.context.app.value.installType = 'npm';
      state.reporting.isErrorReportingEnabled.value = true;

      const getBugsnagErrorEventSpy = jest.spyOn(
        require('../../../src/services/ErrorHandler/utils'),
        'getBugsnagErrorEvent',
      );

      const error = new Error('dummy error');
      error.stack =
        'Error: Test:: dummy error\n    at Object.<anonymous> (https://cdn.rudderlabs.com/v3/modern/rsa.min.js:1:1)';

      await errorHandlerInstance.onError({
        error,
        context: 'Test',
        customMessage: 'Sample custom message',
      });

      expect(getBugsnagErrorEventSpy).toHaveBeenCalledTimes(1);
      expect(getBugsnagErrorEventSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        undefined,
      );
    });
  });

  describe('CSP violation errors handling', () => {
    beforeEach(() => {
      resetState();
      errorHandlerInstance = new ErrorHandler(defaultHttpClient, defaultLogger);
      errorHandlerInstance.init();
    });

    it('should track CSP blocked URLs from RudderStack CDN', () => {
      const blockedURL =
        'https://cdn.rudderlabs.com/v3/modern/plugins/rsa-plugins-remote-Beacon.min.js';

      // Create a CSP violation event
      const cspEvent = new SecurityPolicyViolationEvent('securitypolicyviolation', {
        disposition: 'enforce',
        blockedURI: blockedURL,
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        documentURI: 'https://example.com',
        referrer: '',
        statusCode: 200,
        lineNumber: 1,
        columnNumber: 1,
        sourceFile: 'https://example.com',
      });

      // Dispatch the CSP violation event
      document.dispatchEvent(cspEvent);

      // Verify the URL was added to the blocked list
      expect(state.capabilities.cspBlockedURLs.value).toContain(blockedURL);
      expect(state.capabilities.cspBlockedURLs.value).toHaveLength(1);
    });

    it('should not track CSP blocked URLs from non-RudderStack CDN', () => {
      const blockedURL = 'https://cdn.example.com/some-script.js';

      // Create a CSP violation event
      const cspEvent = new SecurityPolicyViolationEvent('securitypolicyviolation', {
        disposition: 'enforce',
        blockedURI: blockedURL,
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        documentURI: 'https://example.com',
        referrer: '',
        statusCode: 200,
        lineNumber: 1,
        columnNumber: 1,
        sourceFile: 'https://example.com',
      });

      // Dispatch the CSP violation event
      document.dispatchEvent(cspEvent);

      // Verify the URL was NOT added to the blocked list
      expect(state.capabilities.cspBlockedURLs.value).not.toContain(blockedURL);
      expect(state.capabilities.cspBlockedURLs.value).toEqual([]);
    });

    it('should ignore CSP violations with "report" disposition', () => {
      const blockedURL =
        'https://cdn.rudderlabs.com/v3/modern/plugins/rsa-plugins-remote-Beacon.min.js';

      // Create a CSP violation event with "report" disposition
      const cspEvent = new SecurityPolicyViolationEvent('securitypolicyviolation', {
        disposition: 'report',
        blockedURI: blockedURL,
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        documentURI: 'https://example.com',
        referrer: '',
        statusCode: 200,
        lineNumber: 1,
        columnNumber: 1,
        sourceFile: 'https://example.com',
      });

      // Dispatch the CSP violation event
      document.dispatchEvent(cspEvent);

      // Verify the URL was NOT added to the blocked list (only "enforce" disposition is tracked)
      expect(state.capabilities.cspBlockedURLs.value).not.toContain(blockedURL);
      expect(state.capabilities.cspBlockedURLs.value).toEqual([]);
    });

    it('should track multiple CSP blocked URLs', () => {
      const blockedURL1 = 'https://cdn.rudderlabs.com/v3/modern/plugins/plugin1.min.js';
      const blockedURL2 =
        'https://cdn.rudderlabs.com/v3/modern/js-integrations/integration1.min.js';

      // Create first CSP violation event
      const cspEvent1 = new SecurityPolicyViolationEvent('securitypolicyviolation', {
        disposition: 'enforce',
        blockedURI: blockedURL1,
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        documentURI: 'https://example.com',
        referrer: '',
        statusCode: 200,
        lineNumber: 1,
        columnNumber: 1,
        sourceFile: 'https://example.com',
      });

      // Create second CSP violation event
      const cspEvent2 = new SecurityPolicyViolationEvent('securitypolicyviolation', {
        disposition: 'enforce',
        blockedURI: blockedURL2,
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        documentURI: 'https://example.com',
        referrer: '',
        statusCode: 200,
        lineNumber: 1,
        columnNumber: 1,
        sourceFile: 'https://example.com',
      });

      // Dispatch both CSP violation events
      document.dispatchEvent(cspEvent1);
      document.dispatchEvent(cspEvent2);

      // Verify both URLs were added to the blocked list
      expect(state.capabilities.cspBlockedURLs.value).toContain(blockedURL1);
      expect(state.capabilities.cspBlockedURLs.value).toContain(blockedURL2);
      expect(state.capabilities.cspBlockedURLs.value).toHaveLength(2);
    });

    it('should not duplicate CSP blocked URLs', () => {
      const blockedURL = 'https://cdn.rudderlabs.com/v3/modern/plugins/plugin1.min.js';

      // Create CSP violation event
      const cspEvent = new SecurityPolicyViolationEvent('securitypolicyviolation', {
        disposition: 'enforce',
        blockedURI: blockedURL,
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        documentURI: 'https://example.com',
        referrer: '',
        statusCode: 200,
        lineNumber: 1,
        columnNumber: 1,
        sourceFile: 'https://example.com',
      });

      // Dispatch the same CSP violation event twice
      document.dispatchEvent(cspEvent);
      document.dispatchEvent(cspEvent);

      // Verify the URL appears only once in the blocked list
      expect(
        state.capabilities.cspBlockedURLs.value.filter(url => url === blockedURL),
      ).toHaveLength(1);
      // Note: The current implementation doesn't deduplicate, but we document this behavior
      // If deduplication is needed, the implementation should be updated
    });

    it('should track CSP blocked URLs with different RudderStack CDN URLs', () => {
      const testUrls = [
        'https://cdn.rudderlabs.com/v3/modern/plugins/rsa-plugins-remote-Beacon.min.js',
        'https://cdn.rudderlabs.com/v3/modern/js-integrations/GoogleAnalytics.min.js',
        'https://cdn.rudderlabs.com/v3/modern/rsa.min.js',
      ];

      testUrls.forEach(blockedURL => {
        const cspEvent = new SecurityPolicyViolationEvent('securitypolicyviolation', {
          disposition: 'enforce',
          blockedURI: blockedURL,
          violatedDirective: 'script-src',
          effectiveDirective: 'script-src',
          originalPolicy: "script-src 'self'",
          documentURI: 'https://example.com',
          referrer: '',
          statusCode: 200,
          lineNumber: 1,
          columnNumber: 1,
          sourceFile: 'https://example.com',
        });

        document.dispatchEvent(cspEvent);
      });

      // Verify all RudderStack CDN URLs were tracked
      testUrls.forEach(url => {
        expect(state.capabilities.cspBlockedURLs.value).toContain(url);
      });
      expect(state.capabilities.cspBlockedURLs.value).toHaveLength(testUrls.length);
    });

    it('should handle non-string blockedURI values gracefully', () => {
      const testCases = [
        { value: null, description: 'null blockedURI' },
        { value: undefined, description: 'undefined blockedURI' },
        { value: 123, description: 'numeric blockedURI' },
        { value: {}, description: 'object blockedURI' },
        { value: [], description: 'array blockedURI' },
      ];

      testCases.forEach(({ value, description: _description }) => {
        // Clear previous state
        state.capabilities.cspBlockedURLs.value = [];

        // Create CSP violation event with non-string blockedURI
        const cspEvent = new SecurityPolicyViolationEvent('securitypolicyviolation', {
          disposition: 'enforce',
          blockedURI: value as any,
          violatedDirective: 'script-src',
          effectiveDirective: 'script-src',
          originalPolicy: "script-src 'self'",
          documentURI: 'https://example.com',
          referrer: '',
          statusCode: 200,
          lineNumber: 1,
          columnNumber: 1,
          sourceFile: 'https://example.com',
        });

        // Should not throw an error and should not add anything to blocked list
        expect(() => document.dispatchEvent(cspEvent)).not.toThrow();
        expect(state.capabilities.cspBlockedURLs.value).toEqual([]);
      });
    });
  });
});
