<template>
	<div ref="div">hello world</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
let div = ref(); // 获取绑定了ref属性且值为div的标签
console.log('setup:', div.value); // setup 相当于原来的createed，beforeCreated,所以此时页面还没有创建，div.value为undefined
onMounted(() => {
	console.log('onmounted:', div.value); // mounted的时候，页面已经加载完成，div.value能够获取到
});

nextTick(() => {
	console.log('nextTick:', div.value); // 在下一次dom更新的时候调用（只会执行一次）
});
</script>

<style lang="scss" scoped></style>
