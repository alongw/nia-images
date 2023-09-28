import fs from 'fs'
import yaml from 'yaml'

import { DbConfigType } from '../types/config'

// 本地配置文件（数据库信息配置）

export const dbConfig = yaml.parse(
    fs.readFileSync('./config.yaml', 'utf8')
) as DbConfigType
