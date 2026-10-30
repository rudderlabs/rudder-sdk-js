import type { IntegrationOpts, VendorSdkVersionPolicy } from '../types/Integration';

const readPolicy = (entry: unknown): VendorSdkVersionPolicy | undefined => {
  if (entry !== null && typeof entry === 'object') {
    const policy = (entry as { vendorSdkVersionPolicy?: unknown }).vendorSdkVersionPolicy;
    if (policy === 'pinned' || policy === 'floating' || policy === 'strict') {
      return policy;
    }
  }
  return undefined;
};

export const resolveVendorSdkVersionPolicy = (
  integrations: IntegrationOpts | undefined,
  displayName: string,
): VendorSdkVersionPolicy =>
  readPolicy(integrations?.[displayName]) ?? readPolicy(integrations?.All) ?? 'pinned';
