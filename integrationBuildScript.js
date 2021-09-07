import { execSync } from "child_process";
import logger from "./utils/logUtil";
import { configToIntNames } from "./utils/config_to_integration_names";

logger.setLogLevel("DEBUG");
const intgNamesArr = Object.values(configToIntNames);
let curInt = 1;
intgNamesArr.forEach((intgName) => {
  try {
    logger.debug(
      `\nBuilding integration module: ${intgName} (${curInt} of ${intgNamesArr.length})`
    );
    const cmdOutput = execSync(
      `npm run buildProdIntegrationCLI --intg=${intgName}`,
      { encoding: "utf-8" }
    );
    logger.debug("Done!");
    logger.info("Command output: ", cmdOutput);
  } catch (err) {
    logger.error(`${intgName} build failed!!!`);
    logger.error("ERROR: ", err);
  }
  curInt += 1;
});
