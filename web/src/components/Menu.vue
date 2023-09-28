<script setup lang="ts">
// import here ...
import { ref } from 'vue'
import { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'

defineOptions({
    name: 'MenuComponent'
})

// code here ...
const router = useRouter()

const current = ref<string[]>([''])
const items = ref<MenuProps['items']>([
    {
        key: '/',
        label: '首页'
    }
])

const click = (e: string) => {
    router.push(e)
}
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
