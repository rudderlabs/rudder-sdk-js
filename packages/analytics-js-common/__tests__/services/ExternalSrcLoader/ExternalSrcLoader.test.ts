import { ExternalSrcLoader } from '../../../src/services/ExternalSrcLoader';
import {
  createScriptElement,
  insertScript,
} from '../../../src/services/ExternalSrcLoader/jsFileLoader';
import { server } from '../../../__fixtures__/msw.server';
import { dummyScriptSourceBase } from '../../../__fixtures__/fixtures';

describe('External Source Loader', () => {
  let externalSrcLoaderInstance: ExternalSrcLoader;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    externalSrcLoaderInstance = new ExternalSrcLoader();
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();

    document.getElementById('dummyScript')?.remove();
  });

  afterAll(() => {
    server.close();
  });

  it('should retrieve remote script & trigger the callback with value', done => {
    const consoleLogSpy = jest.spyOn(console, 'log');

    const cb = (loadedScript?: string) => {
      expect(loadedScript).toStrictEqual('dummyScript');

      // Check if the script is appended in the DOM
      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyScriptSourceBase}/jsFileSample.js`);

      // Check if the script is executed
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('jsFileSample script executed');

      consoleLogSpy.mockRestore();
      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyScriptSourceBase}/jsFileSample.js`,
      id: 'dummyScript',
      callback: cb,
    });
  });

  it('should handle error in remote script retrieval & trigger the callback with no value and error', done => {
    const cb = (loadedScript?: string, error?: Error) => {
      expect(loadedScript).toBeUndefined();
      expect(error).toEqual(
        new Error(
          'Failed to load the script with the id "dummyScript" from URL "https://cdn.dummy123.com/fileDoesNotExist.js": "no information"',
        ),
      );
      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyScriptSourceBase}/fileDoesNotExist.js`);

      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyScriptSourceBase}/fileDoesNotExist.js`,
      id: 'dummyScript',
      callback: cb,
    });
  });

  it('should handle error if script with same id already exists', done => {
    const cb = (loadedScript?: string, error?: Error) => {
      expect(loadedScript).toBeUndefined();
      expect(error).toEqual(
        new Error(
          'A script with the id "dummyScript" is already loaded. Skipping the loading of this script from URL "https://cdn.dummy123.com/jsFileSample.js" to prevent conflicts',
        ),
      );

      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyScriptSourceBase}/jsFileSample.js`);

      done();
    };

    const dummyElement = createScriptElement(
      `${dummyScriptSourceBase}/jsFileSample.js`,
      'dummyScript',
    );
    insertScript(dummyElement);
    const scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.src).toStrictEqual(`${dummyScriptSourceBase}/jsFileSample.js`);

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyScriptSourceBase}/jsFileSample.js`,
      id: 'dummyScript',
      callback: cb,
    });
  });

  it('should append the script in DOM in correct place', () => {
    const dummyElement = createScriptElement(
      `${dummyScriptSourceBase}/jsFileSample.js`,
      'dummyScript',
    );

    // If head exists should be placed as first script
    insertScript(createScriptElement(`${dummyScriptSourceBase}/jsFileEmpty.js`, 'dummyScript1'));
    insertScript(dummyElement);
    let scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.parentElement?.tagName).toStrictEqual('HEAD');
    expect(scriptElement.nextElementSibling?.id).toStrictEqual('dummyScript1');
    document.getElementById('dummyScript1')?.remove();
    document.getElementById('dummyScript')?.remove();

    // If no head exists should be placed as first script if another script exists
    document.getElementsByTagName('head')[0].remove();
    const scriptElement1 = document.createElement('script');
    scriptElement1.type = 'text/javascript';
    scriptElement1.src = `${dummyScriptSourceBase}/jsFileEmpty.js`;
    scriptElement1.id = 'dummyScript1';
    document.getElementsByTagName('body')[0].append(scriptElement1);
    insertScript(dummyElement);
    scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.nextElementSibling).toBeDefined();
    expect(scriptElement.nextElementSibling?.id).toStrictEqual('dummyScript1');
    document.getElementById('dummyScript1')?.remove();
    document.getElementById('dummyScript')?.remove();
    document.getElementsByTagName('html')[0].append(document.createElement('head'));

    // If no head and no other script create head and add there
    document.getElementsByTagName('head')[0].remove();
    insertScript(dummyElement);
    scriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
    expect(scriptElement).toBeDefined();
    expect(scriptElement.parentElement?.tagName).toStrictEqual('HEAD');
    document.getElementById('dummyScript')?.remove();
  });

  it('should append the script in DOM with extra attributes in the tag', done => {
    const cb = (loadedScript?: string, error?: Error) => {
      expect(loadedScript).toStrictEqual('dummyScript');
      expect(error).toBeUndefined();

      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyScriptSourceBase}/jsFileSample.js`);
      expect(newScriptElement.crossOrigin).toStrictEqual('anonymous');
      expect(newScriptElement.getAttribute('integrity')).toStrictEqual('filehash');

      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyScriptSourceBase}/jsFileSample.js`,
      id: 'dummyScript',
      callback: cb,
      extraAttributes: {
        crossOrigin: 'anonymous',
        integrity: 'filehash',
      },
    });
  });

  it('should handle unexpected processing error and trigger the callback with no value and error', done => {
    const cb = (loadedScript?: string, error?: Error) => {
      expect(loadedScript).toBeUndefined();
      expect(error).toEqual(
        new Error(
          'Failed to load the script with the id "dummyScript" from URL "https://cdn.dummy123.com/jsFileSample.js": Unexpected error',
        ),
      );

      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyScriptSourceBase}/jsFileSample.js`);

      done();
    };

    const originalSetTimeout = window.setTimeout;
    window.setTimeout = () => {
      throw new Error('Unexpected error');
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyScriptSourceBase}/jsFileSample.js`,
      id: 'dummyScript',
      callback: cb,
    });

    window.setTimeout = originalSetTimeout;
  });

  it('should handle script load timeout error and trigger the callback with no value and error', done => {
    const cb = (loadedScript?: string, error?: Error) => {
      expect(loadedScript).toBeUndefined();
      expect(error).toEqual(
        new Error(
          'A timeout of 100 ms occurred while trying to load the script with id "dummyScript" from URL "https://cdn.dummy123.com/longResponseScript.js"',
        ),
      );

      const newScriptElement = document.getElementById('dummyScript') as HTMLScriptElement;
      expect(newScriptElement).toBeDefined();
      expect(newScriptElement.src).toStrictEqual(`${dummyScriptSourceBase}/longResponseScript.js`);

      done();
    };

    externalSrcLoaderInstance.loadJSFile({
      url: `${dummyScriptSourceBase}/longResponseScript.js`,
      id: 'dummyScript',
      callback: cb,
      timeout: 100,
    });
  });
});
