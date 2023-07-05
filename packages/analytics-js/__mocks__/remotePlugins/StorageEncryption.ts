const StorageEncryption = () => ({
  name: 'StorageEncryption',
  storage: {
    encrypt: jest.fn((value: any) => value),
    decrypt: jest.fn((value: any) => value),
  },
});

export default StorageEncryption;
