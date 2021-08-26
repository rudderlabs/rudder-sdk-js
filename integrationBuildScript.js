import { configToIntNames } from "./config_to_integration_names";

Object.keys(configToIntNames).forEach((key) => {
  console.log(configToIntNames[key]);
});
