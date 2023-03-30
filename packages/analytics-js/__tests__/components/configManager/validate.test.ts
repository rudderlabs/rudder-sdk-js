import { validateLoadArgs } from '@rudderstack/analytics-js/components/configManager/util/validate.ts';

describe('Config manager util - validate load arguments', () => {
  const sampleWriteKey = '2LoR1TbVG2bcISXvy7DamldfkgO';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  // it('should not throw error for valid write key', () => {
  //   const validated = validateLoadArgs(sampleWriteKey);
  //   expect(validated).not.toThrow('Unable to load the SDK due to invalid writeKey');
  // });
  // it('should not throw error for valid data plane url', () => {
  //   const validated = validateLoadArgs(sampleWriteKey, sampleDataPlaneUrl);
  //   expect(validated).not.toThrow('Unable to load the SDK due to invalid dataPlaneUrl');
  // });
  // it('should throw error for invalid write key', () => {
  //   const validated = validateLoadArgs('INVALID-WRITE-KEY');
  //   expect(validated).not.toThrow('Unable to load the SDK due to invalid writeKey');
  // });
  // it('should throw error for invalid data plane url', () => {
  //   const validated = validateLoadArgs(sampleWriteKey, '/');
  //   expect(validated).toThrow('Unable to load the SDK due to invalid dataPlaneUrl');
  // });
  it('should dummy', () => {
    expect(true).toBeTruthy();
  });
});
