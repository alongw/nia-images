import { query, rawQuery } from './db.js'
import { checkPermission } from './permission.js'
import type { DbUser } from './../types/user.js'
import type { Images, Config } from './../types/images.js'
import logger from './log.js'

export const getImg = async (user: DbUser, config?: Config) => {
    // 鉴权请求
    if (config && !(await checkConfigPermission(user, config))) return false

    // 解析请求
    checkPermission(
        {
            api: {
                useApi: true
            }
        },
        user.uid
    )

    // 获取总行数
    const [err, result] = await query`
    SELECT COUNT(*) FROM images;
    `
    if (err) {
        return false
    }

    const all = result[0]['COUNT(*)']

    // 查找图片
    const res = await filterImages(user, all, config)

    return res || false
}

const filterImages = async (
    user: DbUser,
    num: number,
    config?: Config
): Promise<false | Images> => {
    // 生成 sql 语句
    const iid = config?.iid ? `and iid=${JSON.stringify(config.iid)}` : ''

    const age =
        config?.image_age || config?.image_age === 0
            ? `and image_age <= ${JSON.stringify(config.image_age)}`
            : 'and image_age <= 0'

    const artist_name = config?.artist_name
        ? `and artist_name=${JSON.stringify(config.artist_name)}`
        : ''

    const size_type = config?.size_type
        ? `and size_type=${JSON.stringify(config.size_type)}`
        : ''

    const sql = `select * from images where iid>0 ${iid} ${age} ${artist_name} ${size_type} ORDER BY RAND()LIMIT 1;`

    logger.info(`用户 ${user.user}(${user.uid}) 请求图片，查询语句 ${sql}`)

    // 查询该行数据
    const [err, result] = await rawQuery(sql)

    if (err) {
        return false
    }

    // 中奖了，图片不存在，重新查询
    if (result.length < 1) {
        console.log(2222)

        return false
    }

    // 图片存在

    // 处理 Pixiv 代理链接
    const img = pixivProxyUrl(result[0], user)

    logger.info(`向用户 ${user.user}(${user.uid}) 响应 ID 为 ${result[0].iid} 图片`)
    return img
}

const pixivProxyUrl = async (img: Images, user: DbUser) => {
    if (
        img.source_name === 'Pixiv' &&
        img.url_public?.startsWith('https://i.pximg.net')
    ) {
        img.url_public = img.url_public.replace(
            'https://i.pximg.net',
            'https://imgs.ama.moe'
        )
        img.url_public += '?key=' + user.key
    }
    return img
}

// 检查配置项限权
const checkConfigPermission = async (user: DbUser, config: Config) => {
    if (config.iid && !(await checkPermission({ api: { iid: true } }, user.uid)))
        return false
    if (
        config.artist_name &&
        !(await checkPermission({ api: { artist: true } }, +user.uid))
    )
        return false

    if (
        config.size_type &&
        !(await checkPermission(
            {
                api: {
                    ['zip' + config.size_type]: true
                }
            },
            user.uid
        ))
    )
        return false

    if (config.image_age || config?.image_age === 0) {
        for (let i = 0; i < config.image_age; i++) {
            const auth = await checkPermission(
                {
                    api: {
                        ['level' + i]: true
                    }
                },
                user.uid
            )
            if (!auth) return false
        }
    }

    return true
}
