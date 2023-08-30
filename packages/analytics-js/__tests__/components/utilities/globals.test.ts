import {
  createExposedGlobals,
  getExposedGlobal,
  setExposedGlobal,
} from '../../../src/components/utilities/globals';

describe('Common Utils - Globals', () => {
  afterEach(() => {
    delete (window as any).RudderStackGlobals;
  });

  it('should create global object namespace in window', () => {
    createExposedGlobals();
    createExposedGlobals('dummyName');
    expect((window as any).RudderStackGlobals).toStrictEqual({
      app: {},
      dummyName: {},
    });
  });

  it('should set global object value', () => {
    expect((window as any).RudderStackGlobals).toBeUndefined();

    setExposedGlobal('dummyName', true);
    expect((window as any).RudderStackGlobals).toStrictEqual({
      app: {
        dummyName: true,
      },
    });
  });

  it('should get global object value', () => {
    (window as any).RudderStackGlobals = {
      dummyName: {
        dummyKeyName: true,
      },
    };

    getExposedGlobal('dummyKeyName', 'dummyName');
    expect((window as any).RudderStackGlobals).toBeTruthy();
  });
});
