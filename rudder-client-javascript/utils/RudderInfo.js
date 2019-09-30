//Library information class
class RudderLibraryInfo {
  constructor() {
    this.rl_name = "RudderLabs JavaScript SDK";
    this.rl_version = "1.0.0";
  }
}
//Operating System information class
class RudderOSInfo {
  constructor() {
    this.rl_name = "";
    this.rl_version = "";
  }
}
//Screen information class
class RudderScreenInfo {
  constructor() {
    this.rl_density = 0;
    this.rl_width = 0;
    this.rl_height = 0;
  }
}
//Device information class
class RudderDeviceInfo {
  constructor() {
    this.rl_id = "";
    this.rl_manufacturer = "";
    this.rl_model = "";
    this.rl_name = "";
  }
}
//Carrier information
class RudderNetwork {
  constructor() {
    this.rl_carrier = "";
  }
}
export {
  RudderLibraryInfo,
  RudderOSInfo,
  RudderScreenInfo,
  RudderDeviceInfo,
  RudderNetwork
};
