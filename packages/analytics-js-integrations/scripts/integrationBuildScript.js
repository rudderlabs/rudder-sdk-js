/* eslint-disable no-console */
/* eslint-disable import/no-relative-packages */
import { exec } from 'child_process';
import { cpus } from 'os';
import { configToIntNames } from '../../analytics-js-common/src/v1.1/utils/config_to_integration_names';

const intgNamesArr = Object.values(configToIntNames);
const totalIntgCount = intgNamesArr.length;
let passCount = 0;
let curInt = 0;
const numCPUs = cpus().length;

let numRunning = 0;
let index = 0;

// At any given time, create only processes for
// max CPUs available
// Intentionally using 1 less CPU and all cpus in github runner
let maxAtOnce = numCPUs > 1 ? numCPUs - 1 : 1;

console.log(`Environment is CI: ${process.env.CI || false}`);
if (process.env.CI) {
  maxAtOnce = numCPUs;
}

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
