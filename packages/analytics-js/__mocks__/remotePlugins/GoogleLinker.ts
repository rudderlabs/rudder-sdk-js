const googleLinker = () => ({
  name: 'GoogleLinker',
  userSession: {
    anonymousIdGoogleLinker: jest.fn((value: any) => value),
  },
});

export default googleLinker;
