// This script loads environment variables from .env into the window object
// Since Angular doesn't have a built-in way to access environment variables from .env files,
// we're adding them to the window object before the app loads
(function() {
  // In production, these values would be injected during the build process
  // For now, we'll include a placeholder that will be replaced by the setup script
  window.NG_APP_RUDDERSTACK_WRITE_KEY = '${WRITE_KEY}';
  window.NG_APP_RUDDERSTACK_DATAPLANE_URL = '${DATAPLANE_URL}';
  
  // Alternative approach: dynamically load environment variables at runtime
  // This requires server-side support or a dedicated environment endpoint
  // fetch('/api/environment')
  //   .then(response => response.json())
  //   .then(env => {
  //     window.NG_APP_RUDDERSTACK_WRITE_KEY = env.WRITE_KEY;
  //     window.NG_APP_RUDDERSTACK_DATAPLANE_URL = env.DATAPLANE_URL;
  //   });
})(); 
