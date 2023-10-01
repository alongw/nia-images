<script setup lang="ts">
import { ref } from 'vue'
import getCaptcha from 'dynamic-tencent-captcha'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { getMailCodeApi, registerApi } from '@/apis'

defineOptions({
    name: 'RegisterPage'
})

const router = useRouter()

interface FormState {
    user: string
    password: string
    email: string
    emailCode: string
}

const formState = ref<FormState>({
    user: '',
    password: '',
    email: '',
    emailCode: ''
})

const code = ref({
    ticket: '',
    randstr: ''
})

const onFinish = async () => {
    // 注册
    const captchares = await getCaptcha('2046626881')
    code.value = captchares
    registerbtnloading.value = true
    const { data: res } = await registerApi({
        ...formState.value,
        code: code.value
    })
    registerbtnloading.value = false
    if (res.status != 200) {
        return message.error(res.msg)
    }

    message.success(res.msg)
    return router.push({
        path: '/login',
        query: {
            redirect: router.currentRoute.value.fullPath,
            register: 'success',
            click: 'register'
        }
    })
}

const mailbtnlock = ref(false)
const mailbtnloading = ref(false)

const registerbtnloading = ref(false)

const getCode = async () => {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (formState.value.email === '' || !reg.test(formState.value.email)) {
        return message.error('邮箱不合法')
    }

    const captchares = await getCaptcha('2046626881')
    code.value = captchares
    mailbtnloading.value = true
    const { data: res } = await getMailCodeApi({
        email: formState.value.email,
        code: code.value
    })
    mailbtnloading.value = false

    if (res.status != 200) {
        return message.error(res.msg)
    }
    mailbtnlock.value = true
    return message.success(res.msg)
}
</script>

<template>
    <div class="main" style="max-width: 800px">
        <h1>注册</h1>
        <a-form
            :model="formState"
            name="basic"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @finish="onFinish"
        >
            <a-form-item
                label="用户名"
                name="user"
                :rules="[
                    {
                        required: true,
                        type: 'string',
                        pattern: '^[a-zA-Z0-9_-]{6,16}$',
                        message: '请输入 6-16 位用户名 仅允许字母、数字、下划线'
                    }
                ]"
            >
                <a-input v-model:value="formState.user" />
            </a-form-item>

            <a-form-item
                label="密码"
                name="password"
                :rules="[
                    {
                        required: true,
                        type: 'string',
                        pattern: '^[a-zA-Z0-9_-]{6,16}$',
                        message: '请输入 6-16 位密码 仅允许字母、数字、下划线'
                    }
                ]"
            >
                <a-input-password v-model:value="formState.password" />
            </a-form-item>
            <a-form-item
                label="邮箱"
                name="email"
                :rules="[{ required: true, type: 'email', message: '请输入邮箱' }]"
            >
                <a-input v-model:value="formState.email" />

                <p style="margin-top: 8px">
                    注：每个邮箱仅能获取一次验证码，除非验证码获取错误。如有需要，请联系管理员。
                </p>

                <a-button
                    type="primary"
                    @click="getCode()"
                    :loading="mailbtnloading"
                    :disabled="mailbtnlock"
                    >获取验证码</a-button
                >
                <p style="color: #fa7298" v-if="mailbtnlock">
                    您已经成功获取验证码，无法重新获取。若长时间未接收到请检查垃圾箱。若不小心刷新页面，您无需重新获取。直接输入原来的既可。
                </p>
            </a-form-item>

            <a-form-item
                label="验证码"
                name="emailCode"
                :rules="[
                    {
                        required: true,
                        type: 'string',
                        message: '请输入邮箱验证码'
                    }
                ]"
            >
                <a-input v-model:value="formState.emailCode" />
            </a-form-item>

            <a-form-item>
                <a-space>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :loading="registerbtnloading"
                    >
                        注册
                    </a-button>
                    <a-button
                        html-type="button"
                        @click="
                            router.push({
                                path: '/login',
                                query: {
                                    redirect: router.currentRoute.value.fullPath,
                                    click: 'button'
                                }
                            })
                        "
                    >
                        已有账号，去登录
                    </a-button>
                </a-space>
            </a-form-item>
        </a-form>
    </div>
</template>
