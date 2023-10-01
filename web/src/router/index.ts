import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/Page/Home/Home.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/Page/Login/Login.vue')
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('@/Page/Users/Users.vue')
        },
        {
            path: '/docs',
            name: 'docs',
            component: () => import('@/Page/Docs/Docs.vue')
        },
        {
            path: '/loginout',
            name: 'loginout',
            component: () => import('@/Page/Loginout/Loginout.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/Page/Register/Register.vue')
        }
    ]
})

export default router
