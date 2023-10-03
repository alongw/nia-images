<script setup lang="ts">
// import here ...
import docsFile from './docs.md?raw'

defineOptions({
    name: 'ProxyPage'
})
</script>

<template>
    <div class="docs">
        <v-md-preview :text="docsFile"></v-md-preview>
    </div>
</template>

<style scoped lang="less">
.docs {
    width: 100%;
    margin: 0 auto;
    height: 100%;
    display: flex;
    overflow: scroll;
}
::-webkit-scrollbar {
    height: 5px;
    width: 8px;
    padding: 0 5px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(160, 163, 171, 0.5) !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 10px;
    transition: background 0.3s ease;
    opacity: 0.1;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(250, 114, 152, 0.5) !important;
}
</style>
