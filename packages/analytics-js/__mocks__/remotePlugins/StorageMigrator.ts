const StorageMigrator = () => ({
  name: 'StorageMigrator',
  storage: {
    migrate: jest.fn((key: any, storageEngine: any, errorHandler?: any, logger?: any) => key),
  },
});

export default StorageMigrator;
