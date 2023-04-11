import { validateLoadArgs } from '@rudderstack/analytics-js/components/configManager/util/validate.ts';

describe('Config manager util - validate load arguments', () => {
  const sampleWriteKey = '2LoR1TbVG2bcISXvy7DamldfkgO';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const errorMsg = 'Unable to load the SDK due to invalid write key: "INVALID-WRITE-KEY"';

  it('should not throw error for valid write key', () => {
   expect(() => { validateLoadArgs(sampleWriteKey) }).not.toThrow(errorMsg);
  });
  it('should not throw error for valid data plane url', () => {
    try {
      validateLoadArgs(sampleWriteKey, sampleDataPlaneUrl);
    } catch (e) {
      expect(e).not.toThrow('Unable to load the SDK due to invalid data plane URL: " "');
    }
  });
  it('should throw error for invalid write key', () => {
    try {
      validateLoadArgs('INVALID-WRITE-KEY');
    } catch (e) {
      expect(e.message).toBe(errorMsg);
    }
  });
  it('should throw error for invalid data plane url', () => {
    try {
      validateLoadArgs(sampleWriteKey, ' ');
    } catch (e) {
      expect(e.message).toBe('Unable to load the SDK due to invalid data plane URL: " "');
    }
  });
});
