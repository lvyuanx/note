<template>
  <slot></slot>
  <slot name="tips" title="title" :num="num"></slot>
</template>

<script lang="ts" setup>
import { ref } from "vue";
let num = ref(10);
</script>

<style lang="scss" scoped></style>
