<script setup lang="ts">
// import here ...
import { ref, computed, onMounted, watch } from 'vue'
import { MenuProps } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'

import { getMenuApi } from '@/apis'
import { getUserLoginStatus } from '@/utils/getStatus'

defineOptions({
    name: 'MenuComponent'
})

// code here ...
const router = useRouter()
const route = useRoute()

watch(
    () => route.path,
    () => {
        if (route.name == 'home') {
            getMenu()
        }
    }
)

const current = ref<string[]>([''])

const defaultitems = ref<MenuProps['items']>([
    {
        key: '/',
        label: '首页'
    }
])

const newitems = ref<MenuProps['items']>([
    {
        key: '/login',
        label: '登录'
    },
    {
        key: '/register',
        label: '注册'
    }
])
const getMenu = async () => {
    if (!getUserLoginStatus()) return
    const { data: res } = await getMenuApi()
    newitems.value = res.data.menu
}

const items = computed(() => {
    return defaultitems.value?.concat(newitems.value || [])
})

const click = (e: string) => {
    router.push(e)
}

onMounted(() => {
    getMenu()
})
</script>

<template>
    <a-menu
        v-model:selectedKeys="current"
        mode="vertical"
        @click="click($event.key)"
        :items="items"
        style="width: 30%; max-width: 200px"
    />
</template>
