import fs from 'fs'
import yaml from 'yaml'

import type { Config } from './../types/config.ts'

try {
    console.log('Loading ./config.yaml')
    fs.readFileSync('./config.yaml', 'utf8')
} catch (error) {
    console.log('Unable to find the configuration file, try creating')
    try {
        const defaultConfig = fs.readFileSync('./template/_config.yaml', 'utf8')
        fs.writeFileSync('./config.yaml', defaultConfig, 'utf8')
        process.exit()
    } catch (error) {
        console.log('Cannot be created automatically, please create manually')
        process.exit()
    }
}

export const config = yaml.parse(fs.readFileSync('./config.yaml', 'utf8')) as Config
