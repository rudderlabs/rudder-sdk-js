/* eslint-disable no-console */
import { exec } from 'child_process';
import { cpus } from 'os';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { configToIntNames } from '../../analytics-js-legacy-utilities/src/config_to_integration_names.js';

const intgNamesArr = Object.values(configToIntNames);
const totalIntgCount = intgNamesArr.length;
let passCount = 0;
let curInt = 0;
const numCPUs = cpus().length;
const MAX_CONCURRENT_BUILDS = 4;

let numRunning = 0;
let index = 0;

// Cap concurrent integration builds so memory usage does not depend on host vCPU count.
const availableCPUs = process.env.CI ? Math.max(numCPUs, 1) : Math.max(numCPUs - 1, 1);
const maxAtOnce = Math.min(availableCPUs, MAX_CONCURRENT_BUILDS);

console.log(`Environment is CI: ${process.env.CI || false}`);

console.log(`Total CPUs to use: ${maxAtOnce}`);
console.log(`Total integrations to build: ${totalIntgCount}`);
console.log(`Maximum number of concurrent processes: ${maxAtOnce}`);

function buildIntegrations() {
  // if there are more waiting, run them
  while (numRunning < maxAtOnce && index < totalIntgCount) {
    numRunning += 1;
    const intgName = intgNamesArr[index];
    index += 1;

    let cmd = `npm run build:integration:cli --intg=${intgName}`;

    if (process.env.VISUALIZER === 'true') {
      cmd = `npm run build:integration:bundle-size:cli --intg=${intgName}`;
    }

    // eslint-disable-next-line no-loop-func
    exec(cmd, (error, stdout, stderr) => {
      curInt += 1;
      console.log(
        `\nCompleted building integration: ${intgName} (${curInt} out of ${totalIntgCount})`,
      );
      console.log(stdout);
      console.log(stderr);
      if (error) {
        console.log(`${intgName} build failed!!!`);
        console.log('ERROR: ', error);
      } else {
        passCount += 1;
      }
      numRunning -= 1;

      // Trigger more builds
      buildIntegrations();
    });
  }

  if (numRunning === 0) {
    // All the integrations are built
    console.log(`Final Status: ${passCount !== totalIntgCount ? 'FAILURE' : 'SUCCESS'}`);
    console.log(
      `Summary: ${passCount} out of ${totalIntgCount} integration builds were successful`,
    );

    if (passCount !== totalIntgCount) {
      // Force exit to indicate failure
      process.exit(1);
    }
  }
}

// Kickoff the builds
buildIntegrations();
