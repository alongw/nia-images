<script setup lang="ts">
// import here ...

defineOptions({
    name: 'LoginoutPage'
})

window.localStorage.clear()
window.sessionStorage.clear()
// code here ...
</script>

<template>
    <div class="main" style="max-width: 600px">
        <h1>您已经成功退出登录</h1>
        <h2>但是你最好关闭所有浏览器窗口</h2>
    </div>
</template>
