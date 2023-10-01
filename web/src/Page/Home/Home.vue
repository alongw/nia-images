<script setup lang="ts">
// import here ...

defineOptions({
    name: 'HomePage'
})

// code here ...
</script>

<template>
    <div class="main" style="max-width: 800px">
        <h1>Nia - Api</h1>
        <a-card title="Nia Images" class="card" style="margin-bottom: 30px">
            <!-- <template #extra><a href="#">more</a></template> -->
            <p>
                欢迎使用 Nia Images API ，这是一个获取随机图片（二刺猿为主）的 API
                ，也是一个图床
            </p>
            <p>
                Nia Images 几乎是全网最强大的随机图片 API ，因为他拥有几乎最多的可用选项
            </p>
            <p>
                这是一个完全公益的项目，完全由人工进行维护（更新慢是正常的）。为了防止滥用，我们要求在每一次的
                API 请求中，都需要携带 KEY 或 TOKEN
            </p>
            <p>
                图片来源于互联网，侵权请联系删除（我们会在每一次的 API
                响应中注明图片具体的来源地址）
            </p>
            <p>
                如有需要，请联系我们：<a href="mailto:alongw@alongw.cn"
                    >alongw@alongw.cn</a
                >
            </p>
        </a-card>

        <a-card title="注意事项" class="card">
            <!-- <template #extra><a href="#">more</a></template> -->
            <p>当前系统处于开发阶段，并未开发完整，比如注册功能都没做 ））））））））</p>
            <p>本站 API 的所有内容仅供学习和交流，请勿用于任何非法用途</p>
            <p>本站 API 仅功遵循相关法律的开发者使用，严禁滥用</p>
            <p>图片按理来说应该不会多，而是比较少。因为这些都是我喜欢的（划掉）</p>
        </a-card>
    </div>
</template>
