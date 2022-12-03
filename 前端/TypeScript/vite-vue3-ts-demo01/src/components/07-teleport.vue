<template>
  <!-- 能够把里面的标签传送到指定位置去-->
  <Teleport to="body">
    <div>hello</div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue";
</script>

<style lang="scss" scoped></style>
