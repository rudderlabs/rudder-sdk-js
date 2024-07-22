import track1ExpectedData from '../../__fixtures__/track1.json';
import track2ExpectedData from '../../__fixtures__/track2.json';
import track3ExpectedData from '../../__fixtures__/track3.json';
import track4ExpectedData from '../../__fixtures__/track4.json';
import track5ExpectedData from '../../__fixtures__/track5.json';
import track6ExpectedData from '../../__fixtures__/track6.json';

const trackMethodSuite = {
  id: 'trackMethod',
  name: 'Track',
  description:
    'Track Method: ' +
    'rudderanalytics.track(event, [properties], [apiOptions], [callback]);' +
    'rudderanalytics.track(event, [properties], [callback]);' +
    'rudderanalytics.track(event, [callback]);',
  testCases: [
    {
      id: 'track1',
      description: 'rudderanalytics.track(event, properties, apiOptions)',
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
          null,
        ],
        [
          'Order Completed',
          {
            revenue: 30,
            currency: 'USD',
            user_actual_id: 12345,
            productId: '234567-sdfghj-345tygh-567890dfghj',
            productCategory: 'clothing',
            paid: true,
            paymentMode: 4,
            paymentModeName: 'online',
            productSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            sampleObj: {
              sampleObj1: {
                newKey: 'sample text',
              },
              newKey1: 3456789009876543,
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
      expectedResult: track1ExpectedData,
      triggerHandler: ['reset', 'identify', 'track'],
    },
    {
      id: 'track2',
      description: 'rudderanalytics.track(event, properties)',
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
          null,
        ],
        [
          'Order Completed',
          {
            revenue: 30,
            currency: 'USD',
            user_actual_id: 12345,
            productId: '234567-sdfghj-345tygh-567890dfghj',
            productCategory: 'clothing',
            paid: true,
            paymentMode: 4,
            paymentModeName: 'online',
            productSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            sampleObj: {
              sampleObj1: {
                newKey: 'sample text',
              },
              newKey1: 3456789009876543,
            },
          },
        ],
      ],
      expectedResult: track2ExpectedData,
      triggerHandler: ['reset', 'identify', 'track'],
    },
    {
      id: 'track3',
      description: 'rudderanalytics.track(event, properties, null)',
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
          null,
        ],
        [
          'Order Completed',
          {
            revenue: 30,
            currency: 'USD',
            user_actual_id: 12345,
            productId: '234567-sdfghj-345tygh-567890dfghj',
            productCategory: 'clothing',
            paid: true,
            paymentMode: 4,
            paymentModeName: 'online',
            productSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            sampleObj: {
              sampleObj1: {
                newKey: 'sample text',
              },
              newKey1: 3456789009876543,
            },
          },
          null,
        ],
      ],
      expectedResult: track3ExpectedData,
      triggerHandler: ['reset', 'identify', 'track'],
    },
    {
      id: 'track4',
      description: 'rudderanalytics.track(event, null, apiOptions)',
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
          null,
        ],
        [
          'Order Completed',
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
      expectedResult: track4ExpectedData,
      triggerHandler: ['reset', 'identify', 'track'],
    },
    {
      id: 'track5',
      description: 'rudderanalytics.track(event)',
      inputData: [[true], ['Order Completed']],
      expectedResult: track5ExpectedData,
      triggerHandler: ['reset', 'track'],
    },
    {
      id: 'track6',
      description: 'rudderanalytics.track(event, properties) with no prior identify',
      inputData: [
        [true],
        [
          'Order Completed',
          {
            revenue: 30,
            currency: 'USD',
            user_actual_id: 12345,
            productId: '234567-sdfghj-345tygh-567890dfghj',
            productCategory: 'clothing',
            paid: true,
            paymentMode: 4,
            paymentModeName: 'online',
            productSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            sampleObj: {
              sampleObj1: {
                newKey: 'sample text',
              },
              newKey1: 3456789009876543,
            },
          },
        ],
      ],
      expectedResult: track6ExpectedData,
      triggerHandler: ['reset', 'track'],
    },
  ],
};

export { trackMethodSuite };
