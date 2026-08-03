/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMPLITUDE_API_KEY?: string;
  readonly VITE_RUDDERSTACK_CONFIG_URL?: string;
  readonly VITE_RUDDERSTACK_DATA_PLANE_URL?: string;
  readonly VITE_RUDDERSTACK_WRITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
