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

export const loginOauthApi = (data: { code: string }) => {
    return axios.post<
        Response<{
            token: string
            expiresIn: number
        }>
    >('/public/login/oauth', data)
}

// 注册获取验证码
export const getMailCodeApi = (data: {
    email: string
    code: {
        ticket: string
        randstr: string
    }
}) => {
    return axios.post<Response<void>>('/public/register/getEmailCode', data)
}

// 注册
export const registerApi = (data: {
    user: string
    password: string
    email: string
    code: {
        ticket: string
        randstr: string
    }
    emailCode: string
}) => {
    return axios.post<Response<void>>('/public/register/register', data)
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
