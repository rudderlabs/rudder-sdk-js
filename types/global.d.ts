// @ts-ignore
declare global {
  namespace NodeJS {
    interface Global extends Window {
      document: Document;
      navigator: Navigator;
      [name: string]: any;
    }
  }
}

declare const __BUNDLE_ALL_PLUGINS__: boolean;

declare const __IS_LEGACY_BUILD__: boolean;

declare const __LOCK_DEPS_VERSION__: boolean;

declare const __PACKAGE_VERSION__: string;

declare const __MODULE_TYPE__: string;

declare const __BASE_CDN_URL__: string;

declare const __RS_POLYFILLIO_SDK_URL__: string;

declare const __RS_BUGSNAG_RELEASE_STAGE__: string;

declare const __REPOSITORY_URL__: string;
