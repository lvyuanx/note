<template>
  <Child>
    <h1>匿名插槽</h1>
    <!-- scope 用于收集子组件slot标签上的属性 -->
    <template #tips="scope">
      具名插槽 {{ scope.title }} {{ scope.num }}
    </template>
  </Child>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Child from "./06-插槽-子.vue";
</script>

<style lang="scss" scoped></style>
