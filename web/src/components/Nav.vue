<script setup lang="ts">
// import here ...

defineOptions({
    name: 'NavComponent'
})
</script>

<template>
    <div class="nav">
        <div class="title" @click="$router.push('/')">Nia Images</div>
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
