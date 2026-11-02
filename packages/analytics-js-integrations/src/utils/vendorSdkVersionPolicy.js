/** @typedef {'pinned' | 'floating' | 'strict'} VendorSdkVersionPolicy */
// Floating is internal and not reachable from public config.

/** Resolve global strict mode or the pinned default. @param {Record<string, unknown> | undefined} integrations @returns {VendorSdkVersionPolicy} */
export const resolveVendorSdkVersionPolicy = integrations => {
  const all = integrations?.All;
  return all !== null && typeof all === 'object' && all.vendorSdkVersionPolicy === 'strict'
    ? 'strict'
    : 'pinned';
};
