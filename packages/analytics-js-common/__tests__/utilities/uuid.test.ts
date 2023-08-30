import { hasCrypto } from '../../src/utilities/crypto';
import { generateUUID } from '../../src/utilities/uuId';

jest.mock('../../src/utilities/crypto', () => {
  const originalModule = jest.requireActual('../../src/utilities/crypto');

  return {
    __esModule: true,
    ...originalModule,
    hasCrypto: jest.fn(),
  };
});

describe('Common Utils - UUId', () => {
  const originalWindowCrypto = global.crypto;
  const uuIdForMockedRandom = '80808080-8080-4080-8080-808080808080';

  beforeAll(() => {
    global.crypto.getRandomValues = arr => arr;
  });

  afterAll(() => {
    global.crypto = originalWindowCrypto;
  });

  it('should generate UUID for modern browsers with crypto.getRandomValues', () => {
    (hasCrypto as jest.Mock).mockReturnValue(true);
    expect(generateUUID()).not.toBe(uuIdForMockedRandom);
  });

  it('should generate UUID for legacy browsers with Math.random', () => {
    (hasCrypto as jest.Mock).mockReturnValue(false);
    expect(generateUUID()).toBe(uuIdForMockedRandom);
  });
});
