export interface DbUser {
    uid: number
    user: string
    password: string
    permission_group: number
    api_time: string
    login_time: string
    register_time: string
    api_img: number
    key: string
    user_link: string[]
    user_agent: string
}
