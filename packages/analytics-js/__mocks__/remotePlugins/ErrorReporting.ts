const ErrorReporting = () => ({
  name: 'ErrorReporting',
  errorReporting: {
    init: jest.fn(() => {}),
    notify: jest.fn(() => {}),
    breadcrumb: jest.fn(() => {}),
  },
});

export default ErrorReporting;
