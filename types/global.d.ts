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

declare const __IS_DYNAMIC_CUSTOM_BUNDLE__: boolean;

declare const __IS_LEGACY_BUILD__: boolean;

declare const __BUNDLED_PLUGINS_LIST__: string | undefined;

declare const __LOCK_DEPS_VERSION__: boolean;
