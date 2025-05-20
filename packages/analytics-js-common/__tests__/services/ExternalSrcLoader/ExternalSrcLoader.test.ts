import { ExternalSrcLoader } from '../../../src/services/ExternalSrcLoader';
import {
  createScriptElement,
  insertScript,
} from '../../../src/services/ExternalSrcLoader/jsFileLoader';
import { server } from '../../../__fixtures__/msw.server';
import { dummyDataplaneHost } from '../../../__fixtures__/fixtures';
import { defaultLogger } from '../../../__mocks__/Logger';
import type { SDKError } from '../../../src/types/ErrorHandler';

describe('External Source Loader', () => {
  let externalSrcLoaderInstance: ExternalSrcLoader;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    externalSrcLoaderInstance = new ExternalSrcLoader(defaultLogger);
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
    // Reset DOM to original state
    document.getElementById('dummyScript')?.remove();
  });

  afterAll(() => {
    server.close();
  });

  it('should handle error if an exception occurs during script loading', done => {
    const originalSetTimeout = globalThis.setTimeout;
    globalThis.setTimeout = undefined as unknown as typeof globalThis.setTimeout;

    const cb = (loadedScript: string, err: SDKError) => {
      expect(err).toEqual(
        new Error(
          'Unable to load (unknown) the script with the id "dummyScript" from URL "https://dummy.dataplane.host.com/jsFileSample.js": globalThis.setTimeout is not a function',
        ),
      );
      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyDataplaneHost}/jsFileSample.js`,
      id: 'dummyScript',
      callback: cb,
    });

    globalThis.setTimeout = originalSetTimeout;
  });

  it(`should retrieve remote script & trigger the callback with value`, done => {
    const cb = (loadedScript?: string) => {
      expect(loadedScript).toStrictEqual('dummyScript');
      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyDataplaneHost}/jsFileSample.js`);
      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyDataplaneHost}/jsFileSample.js`,
      id: 'dummyScript',
      callback: cb,
    });
  });

  it(`should handle error in remote script retrieval & trigger the callback with appropriate error`, done => {
    const cb = (loadedScript: string, err: SDKError) => {
      expect(loadedScript).toEqual('dummyScript');

      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyDataplaneHost}/noConnectionSample`);

      expect(err).toEqual(
        new Error(
          'Unable to load (error) the script with the id "dummyScript" from URL "https://dummy.dataplane.host.com/noConnectionSample"',
        ),
      );
      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyDataplaneHost}/noConnectionSample`,
      id: 'dummyScript',
      callback: cb,
    });
  });

  it(`should handle error if script with same id already exists`, done => {
    const cb = (loadedScript: string, err: SDKError) => {
      expect(loadedScript).toEqual('dummyScript');

      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyDataplaneHost}/jsFileSample.js`);

      expect(err).toEqual(
        new Error(
          'A script with the id "dummyScript" is already loaded. Skipping the loading of this script to prevent conflicts',
        ),
      );

      document.getElementById('dummyScript')?.remove();

      done();
    };

    const dummyElement = createScriptElement(
      `${dummyDataplaneHost}/jsFileSample.js`,
      'dummyScript',
    );
    insertScript(dummyElement);
    const scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.src).toStrictEqual(`${dummyDataplaneHost}/jsFileSample.js`);

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyDataplaneHost}/noConnectionSample`,
      id: 'dummyScript',
      callback: cb,
    });
  });

  it(`should append the script in DOM in correct place`, () => {
    const dummyElement = createScriptElement(
      `${dummyDataplaneHost}/jsFileSample.js`,
      'dummyScript',
    );

    // If head exists should be placed as first script
    insertScript(createScriptElement(`${dummyDataplaneHost}/jsFileEmpty.js`, 'dummyScript1'));
    insertScript(dummyElement);
    let scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.parentElement?.tagName).toStrictEqual('HEAD');
    expect(scriptElement.nextElementSibling?.id).toStrictEqual('dummyScript1');
    document.getElementById('dummyScript1')?.remove();
    document.getElementById('dummyScript')?.remove();

    // If no head exists should be placed as first script if another script exists
    document.getElementsByTagName('head')[0]?.remove();
    const scriptElement1 = document.createElement('script');
    scriptElement1.type = 'text/javascript';
    scriptElement1.src = `${dummyDataplaneHost}/jsFileEmpty.js`;
    scriptElement1.id = 'dummyScript1';
    document.getElementsByTagName('body')[0]?.append(scriptElement1);
    insertScript(dummyElement);
    scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.nextElementSibling).toBeDefined();
    expect(scriptElement.nextElementSibling?.id).toStrictEqual('dummyScript1');
    document.getElementById('dummyScript1')?.remove();
    document.getElementById('dummyScript')?.remove();
    document.getElementsByTagName('html')[0]?.append(document.createElement('head'));

    // If no head and no other script create head and add there
    document.getElementsByTagName('head')[0]?.remove();
    insertScript(dummyElement);
    scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.parentElement?.tagName).toStrictEqual('HEAD');
    document.getElementById('dummyScript')?.remove();
  });

  it(`should append the script in DOM with extra attributes in the tag`, done => {
    const cb = () => {
      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyDataplaneHost}/jsFileSample.js`);
      expect(newScriptElement.crossOrigin).toStrictEqual('anonymous');
      expect(newScriptElement.getAttribute('integrity')).toStrictEqual('filehash');
      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyDataplaneHost}/jsFileSample.js`,
      id: 'dummyScript',
      callback: cb,
      extraAttributes: {
        crossOrigin: 'anonymous',
        integrity: 'filehash',
      },
    });
  });

  it('should handle timeout error if script loading takes more than 10 seconds', done => {
    jest.useFakeTimers();
    jest.setSystemTime(0);

    const cb = (loadedScript: string, err: SDKError) => {
      expect(loadedScript).toEqual('dummyScript');
      expect(err).toEqual(
        new Error(
          'A timeout of 10000 ms occurred while trying to load the script with id "dummyScript" from URL "https://dummy.dataplane.host.com/timeoutSample.js"',
        ),
      );

      jest.useRealTimers();
      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyDataplaneHost}/timeoutSample.js`,
      id: 'dummyScript',
      callback: cb,
    });

    jest.advanceTimersByTime(11000);
  });
});
