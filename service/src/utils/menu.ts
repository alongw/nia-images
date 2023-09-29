import { checkPermission } from './permission'

import type { Permission } from './../types/permission'

type PartialSub<T> = {
    [k in keyof T]?: {
        [sub in keyof T[k]]?: T[k][sub]
    }
}

interface _Permission extends Permission {
    key: string
    name: string
}

interface Menu {
    key: string
    label: string
    permission: PartialSub<_Permission> | string | null
    priority: number
}

// 定义所有菜单组
const menus: Menu[] = [
    {
        key: '/users',
        label: '用户中心',
        permission: {
            user: {
                login: true
            }
        },
        priority: 1010
    },
    {
        key: '/docs',
        label: '使用文档',
        permission: {
            user: {
                low: true
            }
        },
        priority: 9000
    }
]

// 检查用户权限
export const getMenu = async (user: number) => {
    const menu: Menu[] = []

    await Promise.all(
        menus.map(async (e) => {
            const auth = await checkPermission(e.permission, user)
            if (auth) {
                menu.push(e)
            }
        })
    )

    // 排序选项
    menu.sort((a, b) => a.priority - b.priority)

    return menu
}
