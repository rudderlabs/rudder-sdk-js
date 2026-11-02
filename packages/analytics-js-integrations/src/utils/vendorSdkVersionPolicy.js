/** @typedef {'pinned' | 'floating' | 'strict'} VendorSdkVersionPolicy */
// Floating is internal and not reachable from public config.

/** Resolve the load-only strict policy or the pinned default. @param {unknown} policy @returns {VendorSdkVersionPolicy} */
export const resolveVendorSdkVersionPolicy = policy => (policy === 'strict' ? 'strict' : 'pinned');
