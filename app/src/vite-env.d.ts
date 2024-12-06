/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_URL: string
    readonly VITE_OPENWEATHER_API_KEY: string
    readonly VITE_NOAA_API_ENDPOINT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
