/**
 * Loads the Userpilot SDK using the recommended loading pattern
 * @param {Object} config - Configuration for Userpilot
 * @param {string} config.token - The Userpilot token
 * @param {string} [config.sdkEndpoint] - Optional custom endpoint
 * @returns {Promise} A promise that resolves when the SDK is loaded
 */
function loadNativeSdk(config) {
    window.userpilotSettings = {
        token: config.token,
        endpoint: config.sdkEndpoint ? config.sdkEndpoint : undefined
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://js.userpilot.io/sdk/latest.js';

    document.head.appendChild(script);

    return new Promise((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
    });
}

export { loadNativeSdk }; 