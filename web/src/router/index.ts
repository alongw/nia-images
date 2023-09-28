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
        }
    ]
})

export default router
