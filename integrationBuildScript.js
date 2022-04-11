/* eslint-disable no-console */
import { exec } from "child_process";
import { configToIntNames } from "./utils/config_to_integration_names";

const intgNamesArr = Object.values(configToIntNames);
let errCount = 0;
let curInt = 0;
const numCPUs = require("os").cpus().length;

let numRunning = 0;
let index = 0;

// At any given time, create only processes for
// max CPUs available
const maxAtOnce = numCPUs - 1;

function buildIntegrations() {
  // if there are more waiting, run them
  while (numRunning < maxAtOnce && index < intgNamesArr.length) {
    numRunning += 1;
    const intgName = intgNamesArr[index];
    index += 1;

    let cmd = `npm run buildProdIntegrationCLI --intg=${intgName}`;
    if (process.env.BUNDLE_SIZE_VISUALIZER === "true") {
      cmd = `npm run bundle-size-visual-integration-cli --intg=${intgName}`;
    }

    // eslint-disable-next-line no-loop-func
    exec(cmd, (error, stdout, stderr) => {
      curInt += 1;
      console.log(
        `\nCompleted building integration: ${intgName} (${curInt} of ${intgNamesArr.length})`
      );
      console.log(stdout);
      console.log(stderr);
      if (error) {
        errCount += 1;

        console.log(`${intgName} build failed!!!`);
        console.log("ERROR: ", error);
      }
      numRunning -= 1;

      // Trigger more builds
      buildIntegrations();
    });
  }

  if (numRunning === 0) {
    // All the integrations are built
    console.log(`Final Status: ${errCount > 0 ? "FAILURE" : "SUCCESS"}`);
    console.log(
      `Summary: ${errCount} of ${intgNamesArr.length} integration builds failed`
    );
  }
}

// Kickoff the builds
buildIntegrations();
