import page1ExpectedData from '../../__mocks__/page1.json';
import page2ExpectedData from '../../__mocks__/page2.json';
import page4ExpectedData from '../../__mocks__/page4.json';
import page5ExpectedData from '../../__mocks__/page5.json';
import page6ExpectedData from '../../__mocks__/page6.json';
import page7ExpectedData from '../../__mocks__/page7.json';
import page8ExpectedData from '../../__mocks__/page8.json';

const pageMethodSuite = {
  id: 'pageMethod',
  name: 'Page',
  description:
    'Page Method: rudderanalytics.page(category, name, [properties], [apiOptions], [callback]);',
  testCases: [
    {
      id: 'page1',
      description: 'Call with all arguments and all primitives in properties and apiOptions',
      inputData: [
        [true],
        [
          'Cart',
          'Cart Item',
          {
            initial_referrer: '$direct',
            initial_referring_domain: '',
            name: 'Cart Item',
            referring_domain: '',
            tab_url: 'http://localhost:4000/',
            path: '/best-seller/1',
            referrer: 'https://www.google.com/search?q=estore+bestseller',
            search: 'estore bestseller',
            title: 'The best sellers offered by EStore',
            url: 'https://www.estore.com/best-seller/1',
            temp: 12345,
            temp1: null,
            temp2: undefined,
            temp3: [1, 2, 3],
            temp4: {
              selectedType: 'hard copy',
              typesAvailable: ['kindle edition', 'audio book', 'hard copy', null],
            },
          },
          {
            key1: [1, 2, 3, 4],
            key2: 'sample text',
            key3: false,
            key4: 9087654,
            key5: {
              key6: 'sample text 2',
              key7: [
                {
                  color: '#3456789',
                  name: null,
                },
                {
                  color: '#3456767',
                  name: 'Red',
                },
              ],
            },
            key8: null,
            key9: undefined,
            device: {
              id: 'sdfghj567-cghj5678-fghjvbn888',
            },
            library: {
              name: 'Random JavaScript SDK',
              version: '2.22.0',
            },
            context: {
              metaData: {
                appVersion: '2.8.0',
                appId: '1hKOmRA4GRlm',
                release_stage: 'Production',
              },
            },
            integrations: {
              All: false,
              'Google Analytics': true,
              Amplitude: true,
            },
            anonymousId: 'sample anonymousId',
            originalTimestamp: '2023-01-13T08:13:58.548Z',
            channel: 'random',
            traits: {
              subscribed: true,
              plan: 'Gold',
              endDate: '2023-04-13T08:13:58.548Z',
              startDate: '2023-01-13T08:13:58.548Z',
            },
          },
        ],
      ],
      expectedResult: page1ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page2',
      description: 'Call with category, name, properties as arguments',
      inputData: [
        [true],
        [
          'Cart',
          'Cart Item',
          {
            initial_referrer: '$direct',
            initial_referring_domain: '',
            name: 'Cart Item',
            referring_domain: '',
            tab_url: 'http://localhost:4000/',
            path: '/best-seller/1',
            referrer: 'https://www.google.com/search?q=estore+bestseller',
            search: 'estore bestseller',
            title: 'The best sellers offered by EStore',
            url: 'https://www.estore.com/best-seller/1',
            temp: 12345,
            temp1: null,
            temp2: undefined,
            temp3: [1, 2, 3],
            temp4: {
              selectedType: 'hard copy',
              typesAvailable: ['kindle edition', 'audio book', 'hard copy', null],
            },
          },
        ],
      ],
      expectedResult: page2ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page3',
      description: 'Call with category, name, properties and null apiOptions as arguments',
      inputData: [
        [true],
        [
          'Cart',
          'Cart Item',
          {
            initial_referrer: '$direct',
            initial_referring_domain: '',
            name: 'Cart Item',
            referring_domain: '',
            tab_url: 'http://localhost:4000/',
            path: '/best-seller/1',
            referrer: 'https://www.google.com/search?q=estore+bestseller',
            search: 'estore bestseller',
            title: 'The best sellers offered by EStore',
            url: 'https://www.estore.com/best-seller/1',
            temp: 12345,
            temp1: null,
            temp2: undefined,
            temp3: [1, 2, 3],
            temp4: {
              selectedType: 'hard copy',
              typesAvailable: ['kindle edition', 'audio book', 'hard copy', null],
            },
          },
          null,
        ],
      ],
      expectedResult: page2ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page4',
      description: 'Call with category, name, null properties and apiOptions as arguments',
      inputData: [
        [true],
        [
          'Cart',
          'Cart Item',
          null,
          {
            key1: [1, 2, 3, 4],
            key2: 'sample text',
            key3: false,
            key4: 9087654,
            key5: {
              key6: 'sample text 2',
              key7: [
                {
                  color: '#3456789',
                  name: null,
                },
                {
                  color: '#3456767',
                  name: 'Red',
                },
              ],
            },
            key8: null,
            key9: undefined,
            device: {
              id: 'sdfghj567-cghj5678-fghjvbn888',
            },
            library: {
              name: 'Random JavaScript SDK',
              version: '2.22.0',
            },
            context: {
              metaData: {
                appVersion: '2.8.0',
                appId: '1hKOmRA4GRlm',
                release_stage: 'Production',
              },
            },
            integrations: {
              All: false,
              'Google Analytics': true,
              Amplitude: true,
            },
            anonymousId: 'sample anonymousId',
            originalTimestamp: '2023-01-13T08:13:58.548Z',
            channel: 'random',
            traits: {
              subscribed: true,
              plan: 'Gold',
              endDate: '2023-04-13T08:13:58.548Z',
              startDate: '2023-01-13T08:13:58.548Z',
            },
          },
        ],
      ],
      expectedResult: page4ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page5',
      description: 'Call with category, name as arguments',
      inputData: [[true], ['Cart', 'Cart Item']],
      expectedResult: page5ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page6',
      description: 'Call with category as argument',
      inputData: [[true], ['Cart']],
      expectedResult: page6ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page7',
      description: 'Call with name as argument',
      inputData: [[true], [undefined, 'Cart Item']],
      expectedResult: page7ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page8',
      description: 'Call with no argument',
      inputData: [[true], []],
      expectedResult: page8ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
  ],
};

export { pageMethodSuite };
