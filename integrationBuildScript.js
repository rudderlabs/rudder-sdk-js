import { exec } from "child_process";
import logger from "./utils/logUtil";
import { configToIntNames } from "./config_to_integration_names";

Object.keys(configToIntNames).forEach((key) => {
  exec(
    `npm run buildProdIntegrationCLI --intg=${configToIntNames[key]}`,
    (err, stdout) => {
      if (err)
        logger.error(
          `== Error occured while building ${configToIntNames[key]} ==`,
          err
        );
      else {
        logger.debug(
          `== build completed for ${configToIntNames[key]} ==`,
          stdout
        );
      }
    }
  );
});
