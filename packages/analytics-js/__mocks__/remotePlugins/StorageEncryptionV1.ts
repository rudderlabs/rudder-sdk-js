const storageEncryptionV1 = () => ({
  name: 'StorageEncryptionV1',
  storage: {
    encrypt: jest.fn((value: any) => value),
    decrypt: jest.fn((value: any) => value),
  },
});

export default storageEncryptionV1;
