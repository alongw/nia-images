<script setup lang="ts">
// import here ...
import { getUserLoginStatus, getUserInfo } from '@/utils/getStatus'

defineOptions({
    name: 'NavComponent'
})
</script>

<template>
    <div class="nav">
        <div class="title" @click="$router.push('/')">Nia Images</div>
        <div class="user" v-if="$route.path != '/login'">
            <div v-if="!getUserLoginStatus()">
                <RouterLink to="/login" class="button-link">您好，请登录</RouterLink>
            </div>

            <div v-else>
                <a-space>
                    <div>您好，{{ getUserInfo()?.user }}</div>
                    |
                    <div>
                        <RouterLink
                            to="/loginout"
                            class="button-link"
                            style="color: #727171"
                        >
                            退出登录
                        </RouterLink>
                    </div>
                </a-space>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.nav {
    display: flex;
    height: 60px;
    padding: 0 30px;
    align-items: center;
    justify-content: space-between;
    box-shadow:
        0 1px 2px 0 rgba(0, 0, 0, 0.03),
        0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px 0 rgba(0, 0, 0, 0.02);
    .title {
        font-size: 20px;
        user-select: none;
        cursor: pointer;
    }
}
</style>
