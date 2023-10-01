import { Router } from 'express'
import { sendMail } from './../../utils/mail.js'
import { checkTicket } from './../../utils/captcha.js'
import { query } from './../../utils/db.js'
import type { Request } from './../../types/request.js'
import logger from './../../utils/log.js'
import md5 from './../../utils/md5.js'

const router = Router()

router.post(
    '/getEmailCode',
    async (
        req: Request<{
            email?: string
            code?: {
                ticket?: string
                randstr?: string
            }
        }>,
        res
    ) => {
        if (
            !req.body.email ||
            !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(req.body.email)
        ) {
            return res.send({
                status: 400,
                msg: '邮箱不合法'
            })
        }

        // 验证码
        if (!(req.body.code?.randstr && req.body.code?.ticket)) {
            return res.send({
                status: 400,
                msg: '验证码不合法'
            })
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, msg } = await checkTicket(
            req.body.code.ticket,
            req.body.code.randstr
        )
        // if (status !== 200) {
        //     return res.send({
        //         status,
        //         msg
        //     })
        // }

        // 查询邮箱是否被占用
        const [err, result] =
            await query`SELECT * FROM \`user\` WHERE \`email\` = ${req.body.email}`

        if (result.length > 0) {
            return res.send({
                status: 400,
                msg: '该邮箱已获取过验证码'
            })
        }

        // 获取验证码
        const code = Math.floor(100000 + Math.random() * 900000)

        // 写入数据
        const [err2, result2] =
            await query`INSERT INTO \`user\` (\`code\`, \`email\`, \`code_time\`, \`user_agent\`)
            VALUES (
              ${code},
              ${req.body.email},
              ${Date.now()},
              ${JSON.stringify(req.headers['user-agent'])}
            )`

        if (err2 || result2.length < 1) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        if (err) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        // 发送邮件
        try {
            await sendMail({
                from: 'NIA-API<info-api-mail@liyxi.com>',
                subject: '注册验证码',
                to: req.body.email,
                html: `
                <h1>[NIA-IMAGES]您的注册验证码为 ${code} , 5 分钟内有效</h1>
                `
            })
            logger.info(`用户 邮箱 ${req.body.email} 获取注册验证码成功 ${code}`)
        } catch (error) {
            logger.info(
                `用户 邮箱 ${req.body.email} 获取注册验证码出错 ${code} 具体出现在 ${error.message} - ${error}`
            )
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        res.send({
            status: 200,
            msg: '发送成功'
        })
    }
)

router.post(
    '/register',
    async (
        req: Request<{
            user?: string
            password?: string
            email?: string
            code?: {
                ticket?: string
                randstr?: string
            }
            emailCode?: string
        }>,
        res
    ) => {
        if (
            !req.body.user ||
            !req.body.password ||
            !req.body.email ||
            !req.body.code?.randstr ||
            !req.body.code?.ticket ||
            !req.body.emailCode
        ) {
            return res.send({
                status: 403,
                msg: '非法的请求'
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, msg } = await checkTicket(
            req.body.code.ticket,
            req.body.code.randstr
        )
        // if (status !== 200) {
        //     return res.send({
        //         status,
        //         msg
        //     })
        // }

        // 查询邮箱验证码是否正确
        const [err, result] =
            await query`SELECT * FROM \`user\` WHERE \`email\` = ${req.body.email} AND \`code\` = ${req.body.emailCode}`

        if (err) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        if (result.length < 1) {
            logger.info(
                `用户 邮箱 ${req.body.email} 验证码不正确 用户传入 ${req.body.emailCode}`
            )
            return res.send({
                status: 403,
                msg: '验证码不正确'
            })
        }

        const user = result[0]

        // 判断用户名是否合法
        if (!/^[a-zA-Z0-9_-]{6,16}$/.test(req.body.user)) {
            return res.send({
                status: 403,
                msg: '用户名不合法'
            })
        }

        // 判断是否已经注册过
        if (user['register_time']) {
            logger.info(`用户 ${user.user} 重复注册被拦截`)
            return res.send({
                status: 403,
                msg: '您已成功注册，请勿重复注册！'
            })
        }

        // 判断用户名是否重复
        const [err2, result2] =
            await query`SELECT * FROM \`user\` WHERE \`user\` = ${req.body.user}`

        if (err2) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        if (result2.length > 0) {
            return res.send({
                status: 403,
                msg: '用户名不可用，请更换用户名！'
            })
        }

        // 判断密码是否合法
        if (!/^[a-zA-Z0-9_-]{6,16}$/.test(req.body.password)) {
            return res.send({
                status: 403,
                msg: '密码不合法'
            })
        }

        // 保存用户数据
        const [err3, result3] = await query`
        update user set user = ${req.body.user}, password = ${md5(
            req.body.password
        )} , permission_group = 1 , register_time = NOW() where uid = ${user.uid}
            `

        if (err3 || result3.length < 1) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        // 小后门
        logger.info(`用户 ${req.body.user} 注册成功 用户传参 ${JSON.stringify(req.body)}`)

        res.send({
            status: 200,
            msg: '注册成功，请登录'
        })
    }
)

export default router
