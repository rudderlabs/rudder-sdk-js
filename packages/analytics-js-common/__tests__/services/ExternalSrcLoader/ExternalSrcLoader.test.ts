import { ExternalSrcLoader } from '../../../src/services/ExternalSrcLoader';
import {
  createScriptElement,
  insertScript,
} from '../../../src/services/ExternalSrcLoader/jsFileLoader';
import { server } from '../../../__fixtures__/msw.server';
import { dummyDataplaneHost } from '../../../__fixtures__/fixtures';
import { defaultErrorHandler } from '../../../__mocks__/ErrorHandler';
import { defaultLogger } from '../../../__mocks__/Logger';

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
    // Reset DOM to original state
    document.getElementById('dummyScript')?.remove();
  });

  afterAll(() => {
    server.close();
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

  it(`should handle error in remote script retrieval & trigger the callback with no value`, done => {
    const cb = (loadedScript?: string) => {
      expect(loadedScript).toBeUndefined();
      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyDataplaneHost}/noConnectionSample`);
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error(
          'Failed to load the script with the id "dummyScript" from URL "https://dummy.dataplane.host.com/noConnectionSample".',
        ),
        'ExternalSrcLoader',
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
    const cb = (loadedScript?: string) => {
      expect(loadedScript).toBeUndefined();
      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyDataplaneHost}/jsFileSample.js`);
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error(
          'A script with the id "dummyScript" is already loaded. Skipping the loading of this script to prevent conflicts.',
        ),
        'ExternalSrcLoader',
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
});
