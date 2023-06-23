const Bugsnag = () => ({
  name: 'Bugsnag',
  errorReportingProvider: {
    init: jest.fn(() => {}),
    notify: jest.fn(() => {}),
    breadcrumb: jest.fn(() => {}),
  },
});

export default Bugsnag;
