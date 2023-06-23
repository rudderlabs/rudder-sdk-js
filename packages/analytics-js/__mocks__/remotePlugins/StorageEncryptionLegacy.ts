const StorageEncryptionLegacy = () => ({
  name: 'StorageEncryptionLegacy',
  storage: {
    encrypt: jest.fn((value: any) => value),
    decrypt: jest.fn((value: any) => value),
  },
});

export default StorageEncryptionLegacy;
