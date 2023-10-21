import type { Menu } from './../types/menu.js'

// 定义所有菜单组
export const menus: Menu[] = [
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
        priority: 2000
    },
    {
        key: '/proxy',
        label: '图片代理',
        permission: {
            user: {
                low: true
            }
        },
        priority: 2010
    }
]
