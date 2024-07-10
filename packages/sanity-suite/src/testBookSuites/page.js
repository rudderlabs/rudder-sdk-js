import page1ExpectedData from '../../__fixtures__/page1.json';
import page2ExpectedData from '../../__fixtures__/page2.json';
import page3ExpectedData from '../../__fixtures__/page3.json';
import page4ExpectedData from '../../__fixtures__/page4.json';
import page5ExpectedData from '../../__fixtures__/page5.json';
import page6ExpectedData from '../../__fixtures__/page6.json';
import page7ExpectedData from '../../__fixtures__/page7.json';
import page8ExpectedData from '../../__fixtures__/page8.json';
import page9ExpectedData from '../../__fixtures__/page9.json';
import page10ExpectedData from '../../__fixtures__/page10.json';
import page11ExpectedData from '../../__fixtures__/page11.json';
import page12ExpectedData from '../../__fixtures__/page12.json';

const pageMethodSuite = {
  id: 'pageMethod',
  name: 'Page',
  description:
    'Page Method: \
    rudderanalytics.page(category, name, [properties], [options], [callback]);\
    rudderanalytics.page(category, name, [properties], [callback]);\
    rudderanalytics.page(category, name, [callback]);\
    rudderanalytics.page(name, [properties], [options], [callback]);\
    rudderanalytics.page(name, [properties], [callback]);\
    rudderanalytics.page(name, [callback]);\
    rudderanalytics.page(properties, [options], [callback]);\
    rudderanalytics.page(properties, [callback]);\
    rudderanalytics.page([callback]);\
    ',
  testCases: [
    {
      id: 'page1',
      description: 'rudderanalytics.page(category, name, properties, options)',
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
      description: 'rudderanalytics.page(category, name, properties)',
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
      description: 'rudderanalytics.page(category, name, properties, null)',
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
      expectedResult: page3ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page4',
      description: 'rudderanalytics.page(category, name, null, options)',
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
      description: 'rudderanalytics.page(category, name)',
      inputData: [[true], ['Cart', 'Cart Item']],
      expectedResult: page5ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page6',
      description: 'rudderanalytics.page(name)',
      inputData: [[true], ['Cart']],
      expectedResult: page6ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page7',
      description: 'rudderanalytics.page(undefined, name)',
      inputData: [[true], [undefined, 'Cart Item']],
      expectedResult: page7ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page8',
      description: 'rudderanalytics.page()',
      inputData: [[true], []],
      expectedResult: page8ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page9',
      description: 'rudderanalytics.page(name, properties, options)',
      inputData: [
        [true],
        [
          'Cart',
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
      expectedResult: page9ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page10',
      description: 'rudderanalytics.page(name, properties)',
      inputData: [
        [true],
        [
          'Cart',
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
      expectedResult: page10ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page11',
      description: 'rudderanalytics.page(properties, options)',
      inputData: [
        [true],
        [
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
      expectedResult: page11ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
    {
      id: 'page12',
      description: 'rudderanalytics.page(properties)',
      inputData: [
        [true],
        [
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
      expectedResult: page12ExpectedData,
      triggerHandler: ['reset', 'page'],
    },
  ],
};

export { pageMethodSuite };
