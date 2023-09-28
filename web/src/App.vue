<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import Menu from '@/components/Menu.vue'

defineOptions({
    name: 'App'
})
</script>

<template>
    <Nav />

    <div class="app" style="display: flex; height: calc(100vh - 60px)">
        <Menu />
        <div style="width: 100%; height: 100%">
            <router-view />
        </div>
    </div>
</template>
