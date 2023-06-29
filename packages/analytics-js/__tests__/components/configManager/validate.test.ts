import { validateLoadArgs } from '@rudderstack/analytics-js/components/configManager/util/validate';

describe('Config manager util - validate load arguments', () => {
  const sampleWriteKey = 'dummyWriteKey';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const errorMsg = 'Unable to load the SDK due to invalid write key: " "';

  it('should not throw error for valid write key', () => {
    expect(() => {
      validateLoadArgs(sampleWriteKey);
    }).not.toThrow(errorMsg);
  });
  it('should not throw error for valid data plane url', () => {
    expect(() => {
      validateLoadArgs(sampleWriteKey, sampleDataPlaneUrl);
    }).not.toThrow('Unable to load the SDK due to invalid data plane URL: " "');
  });
  it('should throw error for invalid write key', () => {
    expect(() => {
      validateLoadArgs(' ');
    }).toThrow(errorMsg);
  });
  it('should throw error for invalid data plane url', () => {
    expect(() => {
      validateLoadArgs(sampleWriteKey, ' ');
    }).toThrow('Unable to load the SDK due to invalid data plane URL: " "');
  });
});
