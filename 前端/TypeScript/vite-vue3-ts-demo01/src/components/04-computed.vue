<template>
	<div>{{ cpNum }} <button type="button" @click="num++">add</button></div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
let num = ref(0);

// 返回值就是计算属性的值
let cpNum = computed(() => {
	return num.value * 2;
});

let cpNum2 = computed({
	get() {
		return num.value * 2;
	},
	set(value) {
		num.value += value;
	}
});
</script>

<style lang="scss" scoped></style>
