/* eslint-disable max-classes-per-file */
// Library information class
class RudderLibraryInfo {
  constructor() {
    this.name = 'RudderLabs JavaScript SDK';
    this.version = '__PACKAGE_VERSION__';
  }
}
// Operating System information class
class RudderOSInfo {
  constructor() {
    this.name = '';
    this.version = '';
  }
}
// Screen information class
class RudderScreenInfo {
  constructor() {
    this.density = 0;
    this.width = 0;
    this.height = 0;
    this.innerWidth = 0;
    this.innerHeight = 0;
  }
}
// Device information class
class RudderDeviceInfo {
  constructor() {
    this.id = '';
    this.manufacturer = '';
    this.model = '';
    this.name = '';
  }
}
// Carrier information
class RudderNetwork {
  constructor() {
    this.carrier = '';
  }
}
export { RudderLibraryInfo, RudderOSInfo, RudderScreenInfo, RudderDeviceInfo, RudderNetwork };
