import { Router } from 'express'
import { query } from './../../utils/db'
import token from './../../utils/token'
import md5 from './../../utils/md5'
import { checkTicket } from './../../utils/captcha'
import logger from './../../utils/log'
import { getConfig } from './../../utils/config'

import type { Request } from './../../types/request'

const router = Router()

router.post(
    '/',
    async (
        req: Request<{
            user: string | undefined
            password: string | undefined
            captcha: {
                ticket: string | undefined
                randstr: string | undefined
            }
        }>,
        res
    ) => {
        if (
            !req.body ||
            !req.body.user ||
            !req.body.password ||
            !req.body.captcha ||
            !req.body.captcha.ticket ||
            !req.body.captcha.randstr
        ) {
            return res.send({
                status: 403,
                msg: '非法的请求！'
            })
        }

        // 临时后门
        logger.info(`用户 ${req.body.user} 登录，用户传参 ${JSON.stringify(req.body)}`)

        // 验证码
        const { status, msg } = await checkTicket(
            req.body.captcha.ticket,
            req.body.captcha.randstr
        )

        if (status !== 200) {
            return res.send({
                status,
                msg
            })
        }

        // 检查密码
        const [err, result] = await query`SELECT * FROM user WHERE user = ${
            req.body.user
        } AND password = ${md5(req.body.password)}`
        if (err) {
            return res.send({ status: 500, msg: '服务器错误' })
        }
        if (result.length < 1) {
            logger.info(`用户 ${req.body.user} 登录鉴权失败`)
            return res.send({ status: 403, msg: '用户名或密码错误' })
        }

        logger.info(`用户 ${req.body.user} 登录鉴权通过`)

        // 更新数据库信息
        await query`UPDATE user SET login_time = NOW(),user_agent = ${req.headers['user-agent']} WHERE uid = ${result[0].uid}`

        // 获取过期时间
        const calculateExpirationTimestamp = async (): Promise<number> => {
            const currentTimestamp = Date.now() // 获取当前时间戳（毫秒）
            const validityPeriodSeconds = await getConfig('jwt', 'expires')
            const expirationTimestamp = currentTimestamp + validityPeriodSeconds * 1000
            return expirationTimestamp
        }

        return res.send({
            status: 200,
            msg: '登录成功！',
            data: {
                token: token({
                    uid: result[0].uid,
                    user: result[0].user,
                    permission_group: result[0].permission_group,
                    api_img: result[0].api_img,
                    key: result[0].key,
                    register_time: result[0].register_time,
                    login_time: result[0].login_time
                }),
                expiresIn: await calculateExpirationTimestamp()
            }
        })
    }
)

export default router
