<template>
	<div>{{ num }}</div>
	<button type="button" @click="add">add</button>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
let obj = {
	num: 99
};
// reactive的obj对象中的num属性结构成响应式数据
let { num } = toRefs(reactive(obj));

const add = () => {
	num.value++;
};
</script>

<style lang="scss" scoped></style>
