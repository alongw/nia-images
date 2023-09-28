import { Request as ExpressRequest, Express } from 'express'

export interface User extends Express.User {
    uid: number
    user: string
    permission_group: number
    api_img: number
    key: string
    register_time: string
    login_time: string
}

export interface Request extends ExpressRequest {
    userIp: string
    user: User
}

// player
export interface Inquires extends ExpressRequest {
    parameter: string
}
