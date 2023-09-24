import fs from 'fs'
import yaml from 'yaml'

interface ConfigType {
    port: number
    db: {
        host: string
        port: number
        user: string
        password: string
        database: string
    }
    jwt: {
        secret: string
        unless: string[]
    }
    baseUrl: string
}

const config = yaml.parse(fs.readFileSync('./config.yaml', 'utf8')) as ConfigType

export default config
