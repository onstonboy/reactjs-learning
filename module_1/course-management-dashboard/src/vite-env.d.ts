/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCK_API_DELAY_MS?: string;
  readonly VITE_MOCK_API_SHOULD_FAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
