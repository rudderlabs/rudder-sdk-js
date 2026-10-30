/** @typedef {'pinned' | 'floating' | 'strict'} VendorSdkVersionPolicy */

/** Read a supported policy from a destination entry. @param {unknown} entry @returns {VendorSdkVersionPolicy | undefined} */
const readPolicy = entry => {
  if (entry !== null && typeof entry === 'object') {
    const policy = /** @type {{ vendorSdkVersionPolicy?: unknown }} */ (entry)
      .vendorSdkVersionPolicy;
    if (policy === 'pinned' || policy === 'floating' || policy === 'strict') {
      return policy;
    }
  }
  return undefined;
};

/** Resolve destination, All, then the pinned default. @param {Record<string, unknown> | undefined} integrations @param {string} displayName @returns {VendorSdkVersionPolicy} */
export const resolveVendorSdkVersionPolicy = (integrations, displayName) =>
  readPolicy(integrations?.[displayName]) ?? readPolicy(integrations?.All) ?? 'pinned';
