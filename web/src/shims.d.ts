declare module '@kangc/v-md-editor'
declare module '@kangc/v-md-editor/lib/theme/vuepress.js'
declare module '@kangc/v-md-editor/lib/preview'

declare module '*.md?raw' {
    const content: string
    export default content
}
