import { Router, Request, Response } from 'express'
import { query } from './../../utils/db'
import { getImg } from './../../utils/img'
import { checkPermission } from './../../utils/permission'
import { OkPacket } from 'mysql2'

// import type { Request } from './../../types/express'
import type { DbUser } from './../../types/user'
import type { Config } from './../../types/images'

const router = Router()

router.get('/', async (req, res) => {
    // 检查参数
    if (!req.query || !req.query.key) {
        return res.send({
            status: 403,
            msg: '无效的秘钥'
        })
    }

    i(req, res, 'get')
})

router.post('/', async (req, res) => {
    // 检查参数
    if (!req.body || !req.body.key) {
        return res.send({
            status: 403,
            msg: '无效的秘钥'
        })
    }

    i(req, res, 'post')
})

const i = async (req: Request, res: Response, type: string) => {
    const userkey = type === 'post' ? req.body.key : req.query.key

    // 获取用户信息，验证 key 情况
    const [KEYerr, KEYresult] = await query`
    select * from user where \`key\`=${userkey}
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
            msg: '无效的秘钥'
        })
    }

    const user = KEYresult[0] as DbUser

    // 秘钥正确，判断是否有权限获取图片
    const auth = await checkPermission(
        {
            api: {
                useApi: true
            }
        },
        user.uid
    )

    if (!auth) {
        return res.send({
            status: 403,
            msg: '您无权获取新的图片'
        })
    }

    const img = await getImg(
        user,
        (type === 'post' ? req.body.config : req.query.config) as Config | undefined
    )

    if (!img) {
        return res.send({
            status: 404,
            msg: '图片获取失败'
        })
    }
    if (!req.body || !req.body.type) {
        if (
            !addDb(
                user,
                req.ip,
                req.headers['user-agent'],
                img.iid.toString(),
                'redirect'
            )
        ) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }
        return res.redirect(img.url_external || img.url_public)
    }

    // 鉴权是否有权限获取 JSON
    const need = req.body.type

    if (need == 'lite') {
        const auth = await checkPermission(
            {
                api: {
                    lite: true
                }
            },
            user.uid
        )
        if (!auth) {
            return res.send({
                status: 403,
                msg: '您无权获取 JSON (Lite) 数据'
            })
        }
        if (!addDb(user, req.ip, req.headers['user-agent'], img.iid.toString(), 'lite')) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }
        return res.send({
            status: 200,
            msg: 'JSON （Lite） 数据获取成功',
            data: {
                iid: img.iid,
                x: img.x,
                y: img.y,
                image_age: img.image_age,
                url: img.url_external || img.url_public,
                source: '由于特殊原因，本图片不直接提供来源信息，请联系管理员获取'
            }
        })
    }

    if (need == 'json') {
        const auth = await checkPermission(
            {
                api: {
                    json: true
                }
            },
            user.uid
        )
        if (!auth) {
            return res.send({
                status: 403,
                msg: '您无权获取 JSON 完整数据'
            })
        }
        if (!addDb(user, req.ip, req.headers['user-agent'], img.iid.toString(), 'json')) {
            return res.send({
                status: 500,
                msg: '服务器错误'
            })
        }
        return res.send({
            status: 200,
            msg: 'JSON 完整数据获取成功',
            data: img
        })
    }

    return res.send({
        status: 404,
        msg: '未知的参数'
    })
}

const addDb = async (user: DbUser, ip: string, ua: string, iid: string, type: string) => {
    const [err] = await query<OkPacket>`
            insert into api_log (uid,time,ip,\`user-agent\`,iid,type)
            values (${user.uid},NOW(),${ip},${JSON.stringify(ua)},${iid},${type});
            `
    if (err) {
        return false
    }

    const [err2] = await query<OkPacket>`
            update user set api_time = NOW(),api_img = ${iid} where uid = ${user.uid};
            `
    if (err2) {
        return false
    }

    return true
}

export default router
