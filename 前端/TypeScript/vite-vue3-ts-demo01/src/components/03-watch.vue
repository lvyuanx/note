<template>
	<div>{{ num }} <button type="button" @click="num++">add</button></div>
	<div>{{ objRet.num }} <button type="button" @click="objRet.num++">add</button></div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, watch, watchEffect } from 'vue';

let obj = {
	num: 0
};
let { num } = toRefs(reactive(obj));

// watch(要监听的响应式数据, 数据更新时候执行的回调函数)
watch(num, (newVal, oldVal) => {
	console.log(newVal, oldVal);
});

let obj2 = {
	num: 0
};
let objRet = reactive(obj2);
// 当监听的数据没有结构出来的话，可以通过() => 对象.属性 的方式监听
watch(
	() => objRet.num,
	(newVal, oldVal) => {
		console.log(newVal, oldVal);
	}
);

// watch可以同时监听多个数据
watch([() => objRet.num, num], (newVal, oldVal) => {
	console.log('监听多个', newVal, oldVal);
});

// watchEffect在页面刷新的时候就会立即调用
watchEffect(() => {
	// 凡是写在这里面的数据，都会监视
	console.log('watchEffect', objRet.num);
});
</script>

<style lang="scss" scoped></style>
