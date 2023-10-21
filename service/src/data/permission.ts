import type { Permission } from '../types/permission.js'

/**
 * 默认权限
 * 不区分是否登录 账号权限
 */
export const defaultPermission: Permission = {
    user: {
        // user
        login: true,
        low: true,
        getKey: true,
        resetKey: true
    },
    admin: {
        // admin
    },
    api: {
        useApi: true,
        level0: true,
        level1: true,
        level2: false,
        level3: false,
        level4: false,
        level5: false,
        zip0: true,
        zip1: true,
        zip2: false,
        iid: false,
        artist: false,
        lite: true,
        json: false
    }
}
