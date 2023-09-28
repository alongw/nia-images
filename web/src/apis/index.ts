import axios from '@/utils/axios'

import type { Response } from '@/utils/axios'

// 登录
export const loginApi = (data: {
    user: string
    password: string
    captcha: {
        ticket: string
        randstr: string
    }
}) => {
    return axios.post<
        Response<{
            token: string
            expiresIn: number
        }>
    >('/public/login', data)
}
