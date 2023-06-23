import identify1ExpectedData from '../../__mocks__/identify1.json';
import identify2ExpectedData from '../../__mocks__/identify2.json';
import identify3ExpectedData from '../../__mocks__/identify3.json';
import identify4ExpectedData from '../../__mocks__/identify4.json';
import identify5ExpectedData from '../../__mocks__/identify5.json';
import identify6ExpectedData from '../../__mocks__/identify6.json';
import identify7ExpectedData from '../../__mocks__/identify7.json';
import identify8ExpectedData from '../../__mocks__/identify8.json';

const identifyMethodSuite = {
  id: 'identifyMethod',
  name: 'Identify',
  description:
    'Identify Method: rudderanalytics.identify(userId, [traits], [apiOptions], [callback]);',
  testCases: [
    {
      id: 'identify1',
      description: 'Call with all arguments and all primitives in traits and apiOptions',
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
      expectedResult: identify1ExpectedData,
      triggerHandler: ['reset', 'identify'],
    },
    {
      id: 'identify2',
      description: 'Call with userId and traits as arguments with all possible data types',
      inputData: [
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
      ],
      expectedResult: identify2ExpectedData,
      triggerHandler: ['identify'],
    },
    {
      id: 'identify3',
      description:
        'Call with userId , null traits and apiOption as arguments with all possible data types',
      inputData: [
        [true],
        [
          'customUserID',
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
      expectedResult: identify3ExpectedData,
      triggerHandler: ['reset', 'identify'],
    },
    {
      id: 'identify4',
      description: 'Call with only userId as argument',
      inputData: [[true], ['customUserID']],
      expectedResult: identify4ExpectedData,
      triggerHandler: ['reset', 'identify'],
    },
    {
      id: 'identify5',
      description:
        'Call with userId and traits and null apiOptions as arguments with all possible data types',
      inputData: [
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
          null,
        ],
      ],
      expectedResult: identify5ExpectedData,
      triggerHandler: ['identify'],
    },
    {
      id: 'identify6',
      description: 'Add or Update traits',
      inputData: [
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
          null,
        ],
        [
          'customUserID',
          {
            name: 'John Snow',
            alternativeEmail: 'name.surname2@domain.com',
          },
        ],
      ],
      expectedResult: identify6ExpectedData,
      triggerHandler: ['identify', 'identify'],
    },
    {
      id: 'identify7',
      description:
        'Set custom anonymousId then call Identify with userId and traits and null apiOptions as arguments with all possible data types',
      inputData: [
        [true],
        ['custom-anonymousId'],
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
          null,
        ],
      ],
      expectedResult: identify7ExpectedData,
      triggerHandler: ['reset', 'setAnonymousId', 'identify'],
    },
    {
      id: 'identify8',
      description: 'Identify with string userId and then with number userId',
      inputData: [
        [
          '1234567890',
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
          null,
        ],
        [
          1234567890,
          {
            name: 'John Snow',
            alternativeEmail: 'name.surname2@domain.com',
          },
        ],
      ],
      expectedResult: identify8ExpectedData,
      triggerHandler: ['identify', 'identify'],
    },
  ],
};

export { identifyMethodSuite };
