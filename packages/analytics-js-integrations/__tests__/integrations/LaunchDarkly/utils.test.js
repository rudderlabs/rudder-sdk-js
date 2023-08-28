import { createUser } from '../../../src/integrations/LaunchDarkly/utils';
import { mockAnonymousUsersSharedKey, mockTraits, mockUserId } from './__fixtures__/data';

afterAll(() => {
  jest.restoreAllMocks();
});

describe('LaunchDarkly utilities createUser function tests', () => {
  test('Testing create user with key as userId', () => {
    expect(
      createUser({
        context: {
          traits: mockTraits,
        },
        userId: mockUserId,
      }),
    ).toEqual({
      key: mockUserId,
      ...mockTraits,
    });
  });

  test('Testing create user with key as anonymous users shared key', () => {
    expect(
      createUser(
        {
          context: {
            traits: mockTraits,
          },
          userId: mockUserId,
        },
        mockAnonymousUsersSharedKey,
      ),
    ).toEqual({ key: mockAnonymousUsersSharedKey, ...mockTraits });
  });
});
