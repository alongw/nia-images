import express from 'express'

import logger from './utils/log'
import config from './utils/config'

const app = express()

app.listen(config.port, () => {
    logger.info(`nia-images 服务器正在端口 ${config.port} 上运行`)
})
