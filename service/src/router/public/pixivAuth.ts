import { Router } from 'express'

import logger from './../../utils/log.js'
import { query } from './../../utils/db.js'
import { checkPermission } from './../../utils/permission.js'

import type { DbUser } from './../../types/user.js'
import type { Images } from './../../types/images.js'
import type { Request } from './../../types/request.js'

const router = Router()

router.post(
    '/',
    async (
        req: Request<{
            key?: string
            token?: string
            pixivImgId?: string
            pixivImgPage?: string
        }>,
        res
    ) => {
        if (
            !req.body ||
            !req.body.key ||
            !req.body.pixivImgId ||
            !req.body.pixivImgPage
        ) {
            return res.send({
                status: 400,
                msg: '参数不足'
            })
        }
        const { key, pixivImgId, pixivImgPage } = req.body

        // 获取用户信息 检查 KEY 是否有效
        const [KEYerr, KEYresult] = await query`
        select * from user where \`key\`=${key}
         `

        if (KEYerr) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        if (KEYresult.length < 1) {
            return res.send({
                status: 403,
                msg: '拒绝访问'
            })
        }

        const user = KEYresult[0] as DbUser

        // 看看有没有这张图
        const [err, result] = await query`
            select * from images where \`source_name\`= 'Pixiv' and \`source_id\`=${pixivImgId}  and \`image_page\`=${pixivImgPage}
        `

        if (err) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }

        if (result.length < 1) {
            logger.info(
                `Pixiv 图片代理 - 用户 ${user.user} （ ${user.uid} ） 尝试请求 Pid ${pixivImgId} 图片，但是没有找到该图片，疑似恶意调用，因此拒绝访问`
            )
            return res.send({
                status: 403,
                msg: '拒绝访问'
            })
        }

        const image = result[0] as Images

        // 看看用户有没有权限拿这张图片 ( 分级 )
        if (
            !(await checkPermission(
                {
                    api: {
                        [`level${image.image_age}`]: true
                    }
                },
                user.uid
            ))
        ) {
            logger.info(
                `Pixiv 图片代理 - 用户 ${user.user} （ ${user.uid} ） 尝试请求 ${image.iid} 号 （ Pid ${image.source_id} , Url ${image.source_url} , Age ${image.image_age} ） 图片，但是由于权限不足而拒绝访问`
            )
            return res.send({
                status: 403,
                msg: '拒绝访问'
            })
        }

        logger.info(
            `Pixiv 图片代理 - 用户 ${user.user} （ UID ${user.uid} ） 请求了 ${image.iid} 号图片，鉴权通过，放行请求`
        )

        return res.send({
            status: 200,
            msg: '鉴权通过'
        })
    }
)

export default router
