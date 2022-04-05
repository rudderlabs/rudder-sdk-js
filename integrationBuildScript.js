/* eslint-disable no-console */
import { execSync } from "child_process";
import { configToIntNames } from "./utils/config_to_integration_names";

const intgNamesArr = Object.values(configToIntNames);
let curInt = 1;
let errCount = 0;
intgNamesArr.forEach((intgName) => {
  try {
    console.log(
      `\nBuilding integration module: ${intgName} (${curInt} of ${intgNamesArr.length})`
    );
    let cmd = `npm run buildProdIntegrationCLI --intg=${intgName}`;
    if (process.env.BUNDLE_SIZE_VISUALIZER === "true") {
      cmd = `npm run bundle-size-visual-integration-cli --intg=${intgName}`;
    }
    const cmdOutput = execSync(cmd, { encoding: "utf-8" });
    console.log(cmdOutput);
    console.log("Done!");
  } catch (err) {
    errCount += 1;
    console.log(`${intgName} build failed!!!`);
    console.log("ERROR: ", err);
  }
  curInt += 1;
});
console.log(`Final Status: ${errCount > 0 ? "FAILURE" : "SUCCESS"}`);
console.log(
  `Summary: ${errCount} of ${intgNamesArr.length} integration builds failed`
);
