import { Appcues } from '../../../src/integrations/Appcues';

const appcuesConfig = {
  accountId: '812354',
  eventFilteringOption: 'disable',
  whitelistedEvents: [],
  blacklistedEvents: [],
  oneTrustCookieCategories: [],
  nativeSdkUrl: { web: '' },
  useNativeSDK: { web: true },
};
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

describe('Appcues init tests', () => {
  let appcues;

  beforeEach(() => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' }, destinationInfo);
    appcues.init();
  });

  it('Testing init call of Appcues', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    expect(typeof appcues).toBe('object');
  });
});

describe('Amplitude identify tests', () => {
  let appcues;
  it('Testing identify call of Appcues', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    const spy = jest.spyOn(appcues, 'identify');
    appcues.identify({
      message: {
        type: 'identify',
        context: {
          traits: {
            name: 'test',
            email: 'test@email.com',
          },
        },
        userId: 'testUserId',
      },
    });
    expect(spy).toHaveBeenCalledWith('identify', {
      name: 'test',
      email: 'test@email.com',
    });
  });
});

// describe('Appcues init tests', () => {
//   let appcues;

//   beforeEach(() => {
//     appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
//     appcues.init();
//   });

//   test('Testing identify call of Appcues', () => {
//     beforeEach(() => {
//       appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
//       appcues.init();
//     });

//     appcues.identify({
//       message: {
//         type: 'identify',
//         context: {
//           traits: {
//             name: 'test',
//             email: 'test@email.com',
//           },
//         },
//         userId: 'testUserId',
//       },
//     });
//     expect(appcues.identify).toHaveBeenCalledWith('testUserId', {
//       name: 'test',
//       email: 'test@email.com',
//     });
//   });

//   test('Testing track call of Appcues', () => {
//     appcues.track({
//       message: {
//         type: 'track',
//         event: 'testEvent',
//         properties: {
//           testProperty: 'test',
//         },
//       },
//     });
//     expect(appcues.track).toHaveBeenCalledWith('testEvent', {
//       testProperty: 'test',
//     });
//   });

//   test('Testing page call of Appcues', () => {
//     appcues.page({
//       message: {
//         type: 'page',
//         name: 'testPage',
//         properties: {
//           testProperty: 'test',
//         },
//       },
//     });
//     expect(appcues.page).toHaveBeenCalledWith('testPage', {
//       testProperty: 'test',
//     });
//   });

//   test('Testing nested objects in traits for identify calls', () => {
//     appcues.identify({
//       message: {
//         type: 'identify',
//         traits: {
//           name: 'test',
//           address: {
//             city: 'testCity',
//             state: 'testState',
//           },
//         },
//         userId: 'testUserId',
//       },
//     });
//     expect(appcues.identify).toHaveBeenCalledWith('testUserId', {
//       name: 'test',
//       'address.city': 'testCity',
//       'address.state': 'testState',
//     });
//   });

//   test('Testing missing user id for identify calls', () => {
//     appcues.identify({
//       message: {
//         type: 'identify',
//         traits: {
//           name: 'test',
//         },
//       },
//     });
//     expect(appcues.identify).not.toHaveBeenCalled();
//   });

//   test('Testing missing event name for track calls', () => {
//     appcues.track({
//       message: {
//         type: 'track',
//         properties: {
//           testProperty: 'test',
//         },
//       },
//     });
//     expect(appcues.track).not.toHaveBeenCalled();
//   });
// });
