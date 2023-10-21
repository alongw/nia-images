import express from 'express'
import { config } from './../utils/config.js'
import axios, { AxiosInstance } from 'axios'
import * as tunnel from 'tunnel'

const router = express.Router()

router.all('*', async (req, res) => {
    const pixivImgId = getPixivImgId(req.url)
    const pixivImgPage = getPixivImgPage(req.url)

    if (!req.query || !req.query.key || !pixivImgId) {
        return res.send({
            status: 403,
            message: '参数不足'
        })
    }

    const { key } = req.query

    // auth
    try {
        const auth = await axios.post(`${config.authServer}/public/pixivAuth`, {
            key,
            pixivImgId,
            pixivImgPage
        })
        if (auth.data.status != 200) {
            return res.send(auth.data)
        }
    } catch (error) {
        return res.send({
            status: 500,
            msg: '服务器错误'
        })
    }

    // set proxy
    if (config.proxy.enable) {
        const agent = tunnel.httpsOverHttp({
            proxy: {
                host: config.proxy.host,
                port: config.proxy.port
            }
        })
        axios.defaults.httpAgent = agent
    }

    // get img
    try {
        const img = await axios.get(`https://i.pximg.net${req.path}`, {
            headers: {
                Referer: 'https://www.pixiv.net/',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5410.0 Safari/537.36'
            },
            responseType: 'arraybuffer'
        })

        return res.send(img.data)
    } catch (error) {
        return res.send({
            status: 501,
            msg: '服务器错误'
        })
    }
})

// 从路径中提取 pixivImgId
function getPixivImgId(path: string): string | null {
    const match = path.match(/(\d+)_p\d+/)
    return match ? match[1] : null
}

// 从路径中提取 pixivImgPage
function getPixivImgPage(path: string): string | null {
    const match = path.match(/_p(\d+)/)
    return match ? match[1] : null
}

export default router
