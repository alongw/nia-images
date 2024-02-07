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
        mail: {
            host: string
            port: number
            secure: boolean
            from: string
            auth: {
                user: string
                pass: string
            }
        }
    }

    readonly jwt: {
        secret: string
        unless: string[]
        expires: number
    }

    readonly user: {
        key: string
    }

    readonly images: {
        pixivProxy: string
    }

    readonly nya: {
        appid: string
        key: string
        redirect: string
    }
}
