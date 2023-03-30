const storageEncryptionV1 = () => ({
  name: 'storageEncryptionV1',
  storage: {
    encrypt: jest.fn((value: any) => value),
    decrypt: jest.fn((value: any) => value),
  },
});

export default storageEncryptionV1;
