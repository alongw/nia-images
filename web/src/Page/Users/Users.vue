<script setup lang="ts">
// import here ...
import { computed, onMounted, ref, createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { getKeyApi, resetKeyApi } from '@/apis'

defineOptions({
    name: 'UserPage'
})

// code here ...
const apikey = ref()

const showkey = computed(() => {
    return apikey.value ? apikey.value : '请稍后...'
})

const getKey = async () => {
    const { data: res } = await getKeyApi()
    apikey.value = res.data.key
}

const resetKey = () => {
    Modal.confirm({
        title: '您确定要重置 KEY 嘛？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '重置 KEY 可能会造成严重的后果，请谨慎选择。重置后原有 KEY 将会失效。',
        cancelText: '打咩',
        okText: '去意已决',
        async onOk() {
            message.info('正在申请重置 KEY （短期内多次申请可能会被拒绝呐~）')
            const { data: res } = await resetKeyApi()

            if (res.status != 200) {
                return message.error(res.msg)
            }
            message.success(res.msg)
            return getKey()
        },
        onCancel() {}
    })
}

onMounted(() => {
    getKey()
})
</script>

<template>
    <div class="main" style="max-width: 800px">
        <h1>用户中心</h1>
        <a-space direction="vertical">
            <div class="card-list" style="width: 100%">
                <a-card title="我的 API KEY">
                    <template #extra
                        ><a-button type="link" @click="resetKey()"
                            >申请重置</a-button
                        ></template
                    >
                    <p>
                        你可以直接在 API 请求时携带 KEY ， 也可以利用 KEY 生成 TOKEN
                        ，然后在请求时携带 TOKEN
                        。具体内容请在文档中查看。哦对，千万别暴露你的 KEY
                        ，因为这非常危险。
                    </p>
                    <p>API KEY ：{{ showkey }}</p>
                </a-card>
            </div>
            <div class="card-list" style="width: 100%">
                <a-card title="TOKEN 管理">
                    <!-- <template #extra>22</template> -->
                    <p>嗯？咕咕咕！？尽然咕了！</p>
                </a-card>
            </div>
        </a-space>
    </div>
</template>
