import * as sizeLimit from "size-limit";
import * as bigLibPlugin from "@size-limit/preset-big-lib";
import * as webpackPlugin from "@size-limit/webpack";
import * as timePlugin from "@size-limit/time";

console.log("\nChecking integrations size limit...");

import { configToIntNames } from "./utils/config_to_integration_names";
const filePaths = Object.values(configToIntNames).map(
  (intgName) => `/dist/integrations/${intgName}.min.js`
);

const limits = {
  size: "563200", // 550 kB
};

sizeLimit
  .default(
    [bigLibPlugin.default, webpackPlugin.default, timePlugin.default],
    filePaths
  )
  .then((result) => {
    console.log("Limits: ", limits);
    if (result && result.length > 0) {
      const actualVals = result[0];
      console.log("Results: ", actualVals);

      Object.keys(limits).forEach((key) => {
        if (Math.ceil(actualVals[key]) > limits[key]) {
          console.log("Error: Limit exceeded!!!");
          console.log(`'${key}' Limit: ${limits[key]}`);
          console.log(`'${key}' Actual: ${actualVals[key]}`);
          process.exit(1);
        }
      });
    }
  });
