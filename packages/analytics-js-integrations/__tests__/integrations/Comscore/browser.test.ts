/* eslint-disable no-underscore-dangle */
import Comscore from '../../../src/integrations/Comscore/browser';

const mockComscoreSDK = () => {
  window.COMSCORE = {
    beacon: jest.fn(),
  };
};

beforeEach(() => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  delete window.COMSCORE;
});

describe('Comscore init tests', () => {
  test('Testing init call of Userpilot with token', () => {
    const comscore = new Comscore({ publisherId: 'test-token' }, { logLevel: 'debug' });
    comscore.init();
    expect(comscore.name).toBe('COMSCORE');
    expect(comscore.publisherId).toBe('test-token');
  });
});

describe('Comscore tests without custom mapping', () => {
  let comscore;

  beforeEach(() => {
    comscore = new Comscore({ publisherId: 'test-token' }, { logLevel: 'debug' });
    comscore.init();
    mockComscoreSDK();
    jest.spyOn(comscore, 'isLoaded').mockImplementation(() => true);
  });

  test('page call', () => {
    const spy = jest.spyOn(window.COMSCORE, 'beacon');
    comscore.page({
      message: {
        type: 'page',
        name: 'testPage',
        properties: {
          url: '/test/page',
        },
      },
    });

    expect(spy).toHaveBeenCalledWith({
      c1: '2',
      c2: 'test-token',
      c4: '/test/page',
      c5: 'testPage',
    });
  });

  test('page call with integration consent', () => {
    const spy = jest.spyOn(window.COMSCORE, 'beacon');
    comscore.page({
      message: {
        type: 'page',
        name: 'testPage',
        properties: {
          url: '/test/page',
        },
        integrations: {
          COMSCORE: {
            consent: {
              cs_ucfr: 0,
            },
          },
        },
      },
    });

    expect(spy).toHaveBeenCalledWith({
      c1: '2',
      c2: 'test-token',
      c4: '/test/page',
      c5: 'testPage',
      cs_ucfr: 0,
    });
  });
});

describe('Comscore tests with custom mapping', () => {
  let comscore;

  beforeEach(() => {
    comscore = new Comscore(
      {
        publisherId: 'test-token',
        fieldMapping: [
          {
            from: 'fullurl',
            to: 'c3',
          },
          {
            from: 'eventName',
            to: 'c5',
          },
        ],
      },
      { logLevel: 'debug' },
    );
    comscore.init();
    mockComscoreSDK();
    jest.spyOn(comscore, 'isLoaded').mockImplementation(() => true);
  });

  test('page call with all properties of map', () => {
    const spy = jest.spyOn(window.COMSCORE, 'beacon');
    comscore.page({
      message: {
        type: 'page',
        name: 'testPage',
        properties: {
          fullurl: '/test/page/map',
          eventName: 'hello_page',
        },
      },
    });

    expect(spy).toHaveBeenCalledWith({
      c1: '2',
      c2: 'test-token',
      c3: '/test/page/map',
      c5: 'hello_page',
    });
  });

  test('page call with integration consent', () => {
    const spy = jest.spyOn(window.COMSCORE, 'beacon');
    comscore.page({
      message: {
        type: 'page',
        name: 'testPage',
        properties: {
          fullurl: '/test/page/map',
          eventName: 'hello_page',
        },
        integrations: {
          COMSCORE: {
            consent: {
              cs_ucfr: 1,
            },
          },
        },
      },
    });

    expect(spy).toHaveBeenCalledWith({
      c1: '2',
      c2: 'test-token',
      c3: '/test/page/map',
      c5: 'hello_page',
      cs_ucfr: 1,
    });
  });

  test('page call with missing properties of map', () => {
    const spy = jest.spyOn(window.COMSCORE, 'beacon');
    comscore.page({
      message: {
        type: 'page',
        name: 'testPage',
        properties: {
          eventName: 'hello_page',
        }
      },
    });

    expect(spy).toHaveBeenCalledWith({
      c1: '2',
      c2: 'test-token',
      c5: 'hello_page',
    });
  });
});
