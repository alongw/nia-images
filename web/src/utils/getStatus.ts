export const getUserLoginStatus = () => {
    const token = localStorage.getItem('token')
    if (!token || token == '') {
        return false
    }

    const expiresIn = localStorage.getItem('expiresIn')
    if (!expiresIn || expiresIn == '') {
        return false
    }

    const date = Date.now()

    if (date > +expiresIn) {
        return false
    }

    return true
}

interface UserInfo {
    uid: number
    user: string
    permission_group: number
    api_img: string
    key: string
    register_time: string
    login_time: string
    user_link: string
    iat: number
    exp: number
}

export const getUserInfo = (): UserInfo | null => {
    const token = localStorage.getItem('token')
    const info = token?.split('.')
    return info ? JSON.parse(atob(info[1])) : null
}
