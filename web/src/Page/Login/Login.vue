<script setup lang="ts">
// import here ...
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import getCaptcha from 'nia-captcha'
import { loginApi } from '@/apis'
import router from '@/router'

defineOptions({
    name: 'LoginPage'
})

const formData = ref({
    user: '',
    password: ''
})

const loading = ref(false)

const login = async () => {
    // 表单效验
    if (!formData.value.user || !formData.value.password) {
        return message.error('账号或密码不能为空')
    }
    loading.value = true
    // 验证码
    const captchares = await getCaptcha('2046626881')
    const { data: res } = await loginApi({
        ...formData.value,
        captcha: {
            ticket: captchares.ticket,
            randstr: captchares.randstr
        }
    })
    const { status, msg, data } = res
    loading.value = false
    if (status != 200) {
        return message.error(msg)
    }
    message.success(msg)
    window.localStorage.setItem('token', data.token)
    window.localStorage.setItem('expiresIn', data.expiresIn.toString())
    router.push({
        path: '/',
        query: {
            redirect: router.currentRoute.value.fullPath,
            login: 'success'
        }
    })
}
</script>

<template>
    <div class="login">
        <h1>登录</h1>
        <a-space direction="vertical" style="width: 100%; margin-bottom: 20px">
            <h2>使用 Nya Account 登录</h2>
        </a-space>
    </div>
    <div class="login">
        <h2>旧版账号密码登录</h2>
        <a-space direction="vertical" style="width: 100%; margin-bottom: 20px">
            <a-input v-model:value="formData.user" placeholder="请输入账号" />
            <a-input-password
                v-model:value="formData.password"
                placeholder="请输入密码"
            />
        </a-space>
        <a-space wrap>
            <a-button type="primary" @click="login()" :loading="loading">登录</a-button>
            <a-button>忘记密码</a-button>
            <a-button
                style="float: right"
                @click="
                    $router.push({
                        path: '/register',
                        query: {
                            redirect: router.currentRoute.value.fullPath,
                            click: 'button'
                        }
                    })
                "
                disabled
                >注册</a-button
            >
        </a-space>
    </div>
</template>

<style scoped lang="less">
.login {
    width: 100%;
    max-width: 500px;
    margin: 50px auto;
    // background-color: pink;
}
</style>
