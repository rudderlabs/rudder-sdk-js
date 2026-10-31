/** Whether the effective script URL uses a host other than the vendor default. */
export const isCustomerVendorSdkUrl = (url, defaultUrl) => {
  try {
    // Anchors resolve relative URLs like script.src, including in legacy browsers.
    const scriptUrl = document.createElement('a');
    const vendorUrl = document.createElement('a');
    scriptUrl.href = url;
    vendorUrl.href = defaultUrl;
    return Boolean(scriptUrl.hostname) && scriptUrl.hostname !== vendorUrl.hostname;
  } catch {
    return false;
  }
};
