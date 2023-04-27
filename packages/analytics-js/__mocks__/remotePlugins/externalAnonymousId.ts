import { AnonymousIdOptions } from '@rudderstack/analytics-js/state/types';

const externalAnonymousId = () => ({
  name: 'externalAnonymousId',
  storage: {
    getAnonymousId: jest.fn(() => {
      return 'dummy-anonymousId-12345678';
    }),
  },
});

export default externalAnonymousId;
