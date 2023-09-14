import { validateLoadArgs } from '../../../src/components/configManager/util/validate';

describe('Config manager util - validate load arguments', () => {
  const sampleWriteKey = 'dummyWriteKey';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const errorMsg =
    'The write key " " is invalid. It must be a non-empty string. Please check that the write key is correct and try again.';

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
    }).toThrow(
      'The data plane URL " " is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.',
    );
  });
});
