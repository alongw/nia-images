// 本地数据库配置
export interface DbConfigType {
    db: {
        host: string
        port: number
        user: string
        password: string
        database: string
    }
}

// 远程配置文件
export interface Config {
    readonly app: {
        listenPort: number
        baseUrl: string
    }

    readonly jwt: {
        secret: string
        unless: string[]
    }
}
