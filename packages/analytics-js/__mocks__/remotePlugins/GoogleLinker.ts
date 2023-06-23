const GoogleLinker = () => ({
  name: 'GoogleLinker',
  userSession: {
    anonymousIdGoogleLinker: jest.fn((value: any) => value),
  },
});

export default GoogleLinker;
