const isErrorReportingEnabled = sourceConfig => {
  var _a, _b;
  return (
    ((_b =
      (_a =
        sourceConfig === null || sourceConfig === void 0
          ? void 0
          : sourceConfig.statsCollection) === null || _a === void 0
        ? void 0
        : _a.errors) === null || _b === void 0
      ? void 0
      : _b.enabled) === true
  );
};
const getErrorReportingProviderNameFromConfig = sourceConfig => {
  var _a, _b;
  return (_b =
    (_a =
      sourceConfig === null || sourceConfig === void 0 ? void 0 : sourceConfig.statsCollection) ===
      null || _a === void 0
      ? void 0
      : _a.errors) === null || _b === void 0
    ? void 0
    : _b.provider;
};
const isMetricsReportingEnabled = sourceConfig => {
  var _a, _b;
  return (
    ((_b =
      (_a =
        sourceConfig === null || sourceConfig === void 0
          ? void 0
          : sourceConfig.statsCollection) === null || _a === void 0
        ? void 0
        : _a.metrics) === null || _b === void 0
      ? void 0
      : _b.enabled) === true
  );
};
export {
  isErrorReportingEnabled,
  getErrorReportingProviderNameFromConfig,
  isMetricsReportingEnabled,
};
