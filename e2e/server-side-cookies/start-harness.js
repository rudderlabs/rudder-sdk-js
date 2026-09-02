import serve from './server.js';
import config from './config.js';

serve().then(() => {
  // eslint-disable-next-line no-console
  console.log(
    `Harness on ${config.pageUrl}\n  SDK          ${config.sdkUrl}\n  data plane   ${config.dataPlaneUrl}\n  cookie proxy ${config.dataServiceOrigin}/${config.dataServicePath}`,
  );
});
