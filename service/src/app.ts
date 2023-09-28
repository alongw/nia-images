import app from './utils/express'
import logger from './utils/log'
import { getConfig } from './utils/config'

const _port = await getConfig('app', 'listenPort')

app.use(await getConfig('app', 'baseUrl'), async (req, res, next) =>
    (await import('./router/index')).default(req, res, next)
)

app.listen(_port, () => {
    logger.info(`nia-images 服务器正在端口 ${_port} 上运行`)
})
