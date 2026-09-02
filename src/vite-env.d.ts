/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STANDALONE_EXPORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
