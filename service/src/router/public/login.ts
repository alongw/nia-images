import { Router } from 'express'
import { OkPacket } from 'mysql2'
import { query } from './../../utils/db.js'
import token from './../../utils/token.js'
import md5 from './../../utils/md5.js'
import { checkTicket } from './../../utils/captcha.js'
import logger from './../../utils/log.js'
import { getConfig } from './../../utils/config.js'
import { checkPermission } from './../../utils/permission.js'

import axios from 'axios'

import type { Request } from './../../types/request.js'

const router = Router()

router.post(
    '/oauth',
    async (
        req: Request<{
            code: string | undefined
        }>,
        res
    ) => {
        if (!req.body.code || req.body.code.length < 20) {
            return res.send({
                status: 403,
                msg: '认证失败'
            })
        }

        const appid = await getConfig('nya', 'appid')
        const appkey = await getConfig('nya', 'key')
        const redirect_uri = await getConfig('nya', 'redirect')

        let userInfoBack: {
            uid: string
            nickname: string
            avatar: string
            status: number
        } = null

        try {
            const data = await axios.post('https://api.liyxi.com/node/v0/token', {
                grant_type: 'authorization_code',
                code: req.body.code,
                client_id: appid,
                client_secret: appkey,
                type: 'info',
                redirect_uri: redirect_uri
            })

            userInfoBack = data.data
        } catch (error) {
            if (error.code === 'ERR_BAD_REQUEST') {
                return res.send({
                    status: 401,
                    msg: '认证失败'
                })
            }
        }

        // 检查是否有账户
        const [err, result] =
            await query`SELECT * FROM user WHERE uid = ${userInfoBack.uid}`

        if (err) {
            return res.send({ status: 500, msg: '服务器错误' })
        }

        if (result.length < 1) {
            // 注册
            // 保存用户数据
            const [err3, result3] = await query`
            INSERT INTO user
            SET uid = ${userInfoBack.uid},
                permission_group = 1,
                register_time = NOW(),
                user = ${userInfoBack.nickname || 'cutie'};
            `

            if (err3 || result3.length < 1) {
                return res.send({
                    status: 500,
                    msg: '服务器错误'
                })
            }
        }

        // 登录
        const auth = await checkPermission(
            {
                user: {
                    login: true
                }
            },
            userInfoBack.uid
        )

        if (!auth) {
            logger.info(`用户 ${userInfoBack.uid} 尝试登录，但是无权登录，因此拒绝登录`)
            return res.send({
                status: 403,
                msg: '您的账号被禁止登录，详细请咨询管理员！'
            })
        }

        logger.info(`用户 ${userInfoBack.uid} 登录鉴权通过`)

        // 更新数据库信息
        await query`UPDATE user SET login_time = NOW(),user_agent = ${req.headers['user-agent']} WHERE uid = ${userInfoBack.uid}`

        // 获取过期时间
        const calculateExpirationTimestamp = async (): Promise<number> => {
            const currentTimestamp = Date.now() // 获取当前时间戳（毫秒）
            const validityPeriodSeconds = await getConfig('jwt', 'expires')
            const expirationTimestamp = currentTimestamp + validityPeriodSeconds * 1000
            return expirationTimestamp
        }

        const [logerr] = await query<OkPacket>`
            insert into login_log (uid,time,ip,\`user-agent\`,headers)
            values (${userInfoBack.uid},NOW(),${req.ip},${JSON.stringify(
            req.headers['user-agent']
        )},${JSON.stringify(req.headers)});
            `
        if (logerr) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        const [err3, result3] =
            await query`SELECT * FROM user WHERE uid = ${userInfoBack.uid}`

        if (err3) {
            return res.send({ status: 500, msg: '服务器错误' })
        }

        return res.send({
            status: 200,
            msg: '登录成功！',
            data: {
                token: token({
                    uid: userInfoBack.uid,
                    user: result3[0].user,
                    permission_group: result3[0].permission_group,
                    api_img: result3[0].api_img,
                    key: result3[0].key,
                    register_time: result3[0].register_time,
                    login_time: result3[0].login_time,
                    user_link: result3[0].user_link
                }),
                expiresIn: await calculateExpirationTimestamp()
            }
        })
    }
)

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
        return res.send({ status: 403, msg: '用户名或密码错误' })

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        // 鉴权
        const auth = await checkPermission(
            {
                user: {
                    login: true
                }
            },
            result[0].uid
        )
        if (!auth) {
            logger.info(`用户 ${req.body.user} 尝试登录，但是无权登录，因此拒绝登录`)
            return res.send({
                status: 403,
                msg: '您的账号被禁止登录，详细请咨询管理员！'
            })
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

        const [logerr] = await query<OkPacket>`
            insert into login_log (uid,time,ip,\`user-agent\`,headers)
            values (${result[0].uid},NOW(),${req.ip},${JSON.stringify(
            req.headers['user-agent']
        )},${JSON.stringify(req.headers)});
            `
        if (logerr) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
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
                    login_time: result[0].login_time,
                    user_link: result[0].user_link
                }),
                expiresIn: await calculateExpirationTimestamp()
            }
        })
    }
)

export default router
