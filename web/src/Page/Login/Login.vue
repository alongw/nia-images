<script setup lang="ts">
// import here ...
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import getCaptcha from 'dynamic-tencent-captcha'
import { loginApi } from '@/apis'
import router from '@/router'

defineOptions({
    name: 'LoginPage'
})

const formData = ref({
    user: '',
    password: ''
})

const login = async () => {
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
    if (status != 200) {
        return message.error(msg)
    }
    message.success(msg)
    window.localStorage.setItem('token', data.token)
    router.push('/')
}
</script>

<template>
    <div class="login">
        <h1>登录</h1>
        <a-space direction="vertical" style="width: 100%; margin-bottom: 20px">
            <a-input v-model:value="formData.user" placeholder="请输入账号" />
            <a-input-password
                v-model:value="formData.password"
                placeholder="请输入密码"
            />
        </a-space>
        <a-space wrap>
            <a-button type="primary" @click="login()">登录</a-button>
            <a-button>忘记密码</a-button>
            <a-button style="float: right">注册</a-button>
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
