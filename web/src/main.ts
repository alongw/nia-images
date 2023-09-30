import '@/assets/style/base.less'
import 'ant-design-vue/dist/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Prism from 'prismjs'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

VMdPreview.use(vuepressTheme, {
    Prism
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VMdPreview)

app.mount('#app')
