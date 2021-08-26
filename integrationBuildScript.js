import { exec } from "child_process";
import { configToIntNames } from "./config_to_integration_names";

Object.keys(configToIntNames).forEach((key) => {
  console.log(configToIntNames[key]);

  exec(
    `npm run buildProdIntegrationCLI --intg=${configToIntNames[key]}`,
    (err, stdout) => {
      if (err) console.log(err);
      else {
        console.log(stdout);
      }
    }
  );
});
