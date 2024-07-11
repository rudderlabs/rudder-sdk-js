import alias1ExpectedData from '../../__fixtures__/alias1.json';
import alias2ExpectedData from '../../__fixtures__/alias2.json';
import alias3ExpectedData from '../../__fixtures__/alias3.json';
import alias4ExpectedData from '../../__fixtures__/alias4.json';
import alias5ExpectedData from '../../__fixtures__/alias5.json';
import alias6ExpectedData from '../../__fixtures__/alias6.json';

const aliasMethodSuite = {
  id: 'aliasMethod',
  name: 'Alias',
  description:
    'Alias Method: ' +
    'rudderanalytics.alias(to, [from], [options], [callback]);' +
    'rudderanalytics.alias(to, [from], [callback]);' +
    'rudderanalytics.alias(to, [options], [callback]);' +
    'rudderanalytics.alias(to, [callback]);',
  testCases: [
    {
      id: 'alias1',
      description: 'rudderanalytics.alias(to, from, options)',
      inputData: [
        [true],
        [
          'customUserID',
          {
            name: 'John Doe',
            title: 'CEO',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            dob: new Date(Date.UTC(1990, 0, 12)),
            address: [
              {
                city: 'Austin',
                postalCode: 12345,
                country: 'US',
                street: 'Sample Address',
                state: 'TX',
                label: 'Home',
                defaultAddress: true,
              },
              {
                city: 'Houston',
                postalCode: 345678,
                country: 'US',
                street: 'Sample Address 2',
                state: 'TX',
                label: 'Office',
                defaultAddress: false,
              },
              {
                city: 'Dallas',
                postalCode: 987654,
                country: 'US',
                street: 'Sample Address 3',
                state: 'TX',
                label: 'Toms place',
                defaultAddress: false,
              },
            ],
          },
        ],
        [
          'newCustomUserID',
          'customUserID',
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
            externalIds: [
              {
                id: 'some_external_id_1',
                type: 'brazeExternalId',
              },
            ],
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
          },
        ],
      ],
      expectedResult: alias1ExpectedData,
      triggerHandler: ['reset', 'identify', 'alias'],
    },
    {
      id: 'alias2',
      description: 'rudderanalytics.alias(to, options)',
      inputData: [
        [true],
        [
          'customUserID',
          {
            name: 'John Doe',
            title: 'CEO',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            dob: new Date(Date.UTC(1990, 0, 12)),
            address: [
              {
                city: 'Austin',
                postalCode: 12345,
                country: 'US',
                street: 'Sample Address',
                state: 'TX',
                label: 'Home',
                defaultAddress: true,
              },
              {
                city: 'Houston',
                postalCode: 345678,
                country: 'US',
                street: 'Sample Address 2',
                state: 'TX',
                label: 'Office',
                defaultAddress: false,
              },
              {
                city: 'Dallas',
                postalCode: 987654,
                country: 'US',
                street: 'Sample Address 3',
                state: 'TX',
                label: 'Toms place',
                defaultAddress: false,
              },
            ],
          },
        ],
        ['newCustomUserID', 'customUserID'],
      ],
      expectedResult: alias2ExpectedData,
      triggerHandler: ['reset', 'identify', 'alias'],
    },
    {
      id: 'alias3',
      description: 'rudderanalytics.alias(to, from, null)',
      inputData: [
        [true],
        [
          'customUserID',
          {
            name: 'John Doe',
            title: 'CEO',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            dob: new Date(Date.UTC(1990, 0, 12)),
            address: [
              {
                city: 'Austin',
                postalCode: 12345,
                country: 'US',
                street: 'Sample Address',
                state: 'TX',
                label: 'Home',
                defaultAddress: true,
              },
              {
                city: 'Houston',
                postalCode: 345678,
                country: 'US',
                street: 'Sample Address 2',
                state: 'TX',
                label: 'Office',
                defaultAddress: false,
              },
              {
                city: 'Dallas',
                postalCode: 987654,
                country: 'US',
                street: 'Sample Address 3',
                state: 'TX',
                label: 'Toms place',
                defaultAddress: false,
              },
            ],
          },
        ],
        ['newCustomUserID', 'customUserID', null],
      ],
      expectedResult: alias3ExpectedData,
      triggerHandler: ['reset', 'identify', 'alias'],
    },
    {
      id: 'alias4',
      description: 'rudderanalytics.alias(to) with prior identify',
      inputData: [
        [true],
        [
          'customUserID',
          {
            name: 'John Doe',
            title: 'CEO',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            dob: new Date(Date.UTC(1990, 0, 12)),
            address: [
              {
                city: 'Austin',
                postalCode: 12345,
                country: 'US',
                street: 'Sample Address',
                state: 'TX',
                label: 'Home',
                defaultAddress: true,
              },
              {
                city: 'Houston',
                postalCode: 345678,
                country: 'US',
                street: 'Sample Address 2',
                state: 'TX',
                label: 'Office',
                defaultAddress: false,
              },
              {
                city: 'Dallas',
                postalCode: 987654,
                country: 'US',
                street: 'Sample Address 3',
                state: 'TX',
                label: 'Toms place',
                defaultAddress: false,
              },
            ],
          },
        ],
        ['newCustomUserID'],
      ],
      expectedResult: alias4ExpectedData,
      triggerHandler: ['reset', 'identify', 'alias'],
    },
    {
      id: 'alias5',
      description: 'rudderanalytics.alias(to) with no prior identify',
      inputData: [[true], ['customAnonId'], ['newUserID']],
      expectedResult: alias5ExpectedData,
      triggerHandler: ['reset', 'setAnonymousId', 'alias'],
    },
    {
      id: 'alias6',
      description: 'rudderanalytics.alias(to, options)',
      inputData: [
        [true],
        [
          'customUserID',
          {
            name: 'John Doe',
            title: 'CEO',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            dob: new Date(Date.UTC(1990, 0, 12)),
            address: [
              {
                city: 'Austin',
                postalCode: 12345,
                country: 'US',
                street: 'Sample Address',
                state: 'TX',
                label: 'Home',
                defaultAddress: true,
              },
              {
                city: 'Houston',
                postalCode: 345678,
                country: 'US',
                street: 'Sample Address 2',
                state: 'TX',
                label: 'Office',
                defaultAddress: false,
              },
              {
                city: 'Dallas',
                postalCode: 987654,
                country: 'US',
                street: 'Sample Address 3',
                state: 'TX',
                label: 'Toms place',
                defaultAddress: false,
              },
            ],
          },
        ],
        [
          'newCustomUserID',
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
            externalIds: [
              {
                id: 'some_external_id_1',
                type: 'brazeExternalId',
              },
            ],
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
          },
        ],
      ],
      expectedResult: alias6ExpectedData,
      triggerHandler: ['reset', 'identify', 'alias'],
    },
  ],
};

export { aliasMethodSuite };
