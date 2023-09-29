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

// 获取菜单
export const getMenuApi = () => {
    return axios.get<
        Response<{
            menu: {
                key: string
                label: string
                permission: {
                    [key: string]: {
                        [key: string]: boolean
                    }
                }
                priority: number
            }[]
        }>
    >('/menu')
}

// 获取 KEY
export const getKeyApi = () => {
    return axios.get<
        Response<{
            key: string
        }>
    >('/user/key')
}

// 重置 KEY
export const resetKeyApi = () => {
    return axios.post<Response<void>>('/user/key')
}
