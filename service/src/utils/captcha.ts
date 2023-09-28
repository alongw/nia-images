import axios, { AxiosResponse } from 'axios'
import https from 'https'

import logger from './log'

export async function checkTicket(
    ticket: string,
    randstr: string
): Promise<{
    status: number
    msg: string
}> {
    const url = `https://cgi.urlsec.qq.com/index.php?m=check&a=gw_check&callback=url_query&url=https%3A%2F%2Fwww.qq.com%2F${Math.floor(
        Math.random() * (999999 - 111111 + 1) + 111111
    )}&ticket=${encodeURIComponent(ticket)}&randstr=${encodeURIComponent(randstr)}`

    const options = {
        headers: {
            Accept: 'application/json',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            Referer: 'https://urlsec.qq.com/check.html',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    }

    try {
        const response: AxiosResponse = await axios.get(url, options)
        const arr = jsonpDecode(response.data)

        if (arr.reCode === 0) {
            logger.info('验证码验证通过')
            return {
                status: 200,
                msg: '验证码验证通过'
            }
        } else if (arr.reCode === -109) {
            logger.info('验证码验证不通过')
            return {
                status: 403,
                msg: '验证码验证不通过'
            }
        } else {
            logger.info('验证码验证失败')
            return {
                status: 403,
                msg: '验证码验证失败'
            }
        }
    } catch (error) {
        logger.warn('验证码功能报错')
        return {
            status: 500,
            msg: '服务器错误'
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonpDecode(jsonp: string): any {
    jsonp = jsonp.trim()
    let begin = 0
    let end = 0

    if (jsonp[0] !== '[' && jsonp[0] !== '{') {
        begin = jsonp.indexOf('(')
        if (begin !== -1) {
            end = jsonp.lastIndexOf(')')
            if (end !== -1) {
                jsonp = jsonp.substring(begin + 1, end)
            }
        }
    }

    return JSON.parse(jsonp)
}
