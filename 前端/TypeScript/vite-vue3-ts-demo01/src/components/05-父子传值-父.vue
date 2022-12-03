<template>
  <div>父组件 {{ num }}</div>
  <Child
    :num="num"
    v-model:num2="num"
    @fn="changeNum"
    @alertFn="alertMsg"
  ></Child>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Child from "@/components/05-父子传值-子.vue";

let num = ref(99);

const changeNum = () => {
  num.value++;
};

const alertMsg = (msg: string) => {
  alert(msg);
};
</script>

<style lang="scss" scoped></style>
