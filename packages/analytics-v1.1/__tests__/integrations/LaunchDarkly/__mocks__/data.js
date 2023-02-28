const mockUserId = 'test-userId-123';
const mockAnonymousId = 'e1315e19-1f4f-4e4c-a4ce-face6139c84a';
const mockClientSideId = 'test-client-side-id';
const mockAnonymousUsersSharedKey = 'test-anonymousUsers-shared-key';
const testEvent = 'Test Event';

const launchDarklyConfigs = [
  {
    clientSideId: null,
    anonymousUsersSharedKey: null,
  },
  {
    clientSideId: mockClientSideId,
    anonymousUsersSharedKey: null,
  },
  {
    clientSideId: mockClientSideId,
    anonymousUsersSharedKey: mockAnonymousUsersSharedKey,
  },
];

const mockTraits = {
  anonymous: false,
  avatar: 'https://avatarfiles.alphacoders.com/837/83744.jpg',
  country: 'USA',
  custom: {
    favourite_color: 'black',
  },
  email: 'alex@example.com',
  firstName: 'Alex',
  ip: '12.23.34.45',
  lastName: 'Keener',
  name: 'Alex Keener',
  privateAttributeNames: ['avatar', 'country'],
  secondary: 'abcd21234',
};

const mockProperties = {
  foo: 'bar',
  key1: 'value1',
};

const trackCallPayload = {
  message: {
    context: {},
    event: testEvent,
    properties: mockProperties,
  },
};

export {
  launchDarklyConfigs,
  trackCallPayload,
  mockTraits,
  mockAnonymousId,
  mockUserId,
  mockClientSideId,
  mockAnonymousUsersSharedKey,
  testEvent,
  mockProperties,
};
