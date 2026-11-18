import * as commonUtils from '../../../src/utils/commonUtils';
import processHeapProperties from '../../../src/integrations/Heap/util';

describe('Heap property formatting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes Date values returned by the flattening step', () => {
    jest.spyOn(commonUtils, 'flattenJson').mockReturnValue({
      date: new Date(0),
      count: 0,
      ignored: null,
    });

    expect(processHeapProperties({})).toEqual({ date: '1970-01-01T00:00:00.000Z', count: 0 });
  });
});
