import { Router } from 'express'
import { auth } from './../../utils/permission.js'
import { query } from './../../utils/db.js'
import { getConfig } from './../../utils/config.js'
import md5 from './../../utils/md5.js'

import type { Request } from './../../types/express.js'
import logger from './../../utils/log.js'

const router = Router()

router.get('/key', auth('user', 'getKey'), async (req: Request, res) => {
    const [err, result] = await query`select * from user where uid=${req.user.uid}`

    if (err) {
        return res.send({
            status: 500,
            msg: '服务器错误'
        })
    }

    if (result[0].key == '' || result[0].key == null) {
        return res.send({
            status: 200,
            msg: '未创建 KEY',
            data: {
                key: '您还未创建过 KEY ，请点击申请重置按钮来创建您的第一个 KEY'
            }
        })
    }

    res.send({
        status: 200,
        msg: 'key获取成功',
        data: {
            key: result[0].key
        }
    })
})

router.post('/key', auth('user', 'resetKey'), async (req: Request, res) => {
    const key = `${md5(req.user.uid.toString() + Date.now().toString())}${md5(
        Date.now().toString() + (await getConfig('user', 'key'))
    )}`

    const [err, result] =
        await query`update user set \`key\`=${key} where uid=${req.user.uid}`

    if (err) {
        return res.send({
            status: 500,
            msg: '服务器错误'
        })
    }

    if (result.affectedRows <= 0) {
        return res.send({
            status: 500,
            msg: '服务器错误'
        })
    }

    logger.info(
        `用户 ${req.user.user} 自助重置 KEY ，系统已自动批准，用户的新 KEY 为 ${key}`
    )

    res.send({
        status: 200,
        msg: '重置成功'
    })
})

export default router
