import { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { server } from '../../../__mocks__/msw.server';
import { dummyDataplaneHost } from '../../../__mocks__/fixtures';

jest.mock('../../../src/services/Logger', () => {
  const originalModule = jest.requireActual('../../../src/services/Logger');

  return {
    __esModule: true,
    ...originalModule,
    defaultLogger: {
      error: jest.fn((): void => {}),
    },
  };
});

jest.mock('../../../src/services/ErrorHandler', () => {
  const originalModule = jest.requireActual('../../../src/services/ErrorHandler');

  return {
    __esModule: true,
    ...originalModule,
    defaultErrorHandler: {
      onError: jest.fn((): void => {}),
    },
  };
});

describe('External Source Loader', () => {
  let externalSrcLoaderInstance: ExternalSrcLoader;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    externalSrcLoaderInstance = new ExternalSrcLoader(defaultErrorHandler, defaultLogger);
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
  });

  afterAll(() => {
    server.close();
  });

  it(`should retrieve remote script & trigger the onload callback`, done => {
    const cb = (loadedScript = 'failed') => {
      expect(loadedScript).toStrictEqual('dummyScript');
      const newScriptElement = document.getElementById('dummyScript');
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyDataplaneHost}/jsFileSample`);
      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyDataplaneHost}/jsFileSample`,
      id: 'dummyScript',
      callback: cb,
    });
  });
});
