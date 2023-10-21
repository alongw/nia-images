export interface Config {
    port: number
    authServer: string
    proxy: {
        enable: boolean
        host: string
        port: number
    }
}
