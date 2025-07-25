/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOAP_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENABLE_LOGS: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_MUNICIPALITY: string
  readonly VITE_CACHE_TTL: string
  readonly VITE_ENABLE_CACHE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
