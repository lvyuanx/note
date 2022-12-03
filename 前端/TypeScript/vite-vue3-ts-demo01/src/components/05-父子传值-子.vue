<template>
  <div>
    子组件 {{ num }}
    <button type="button" @click="childClick">add</button>
    <button type="button" @click="sendClick">send</button>
    <button type="button" @click="updateNum">update</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

let props = defineProps({
  num: {
    type: Number,
    default: 20,
  },
  num2: {
    type: Number,
    default: 20,
  },
});

// 子传父要此案定义好emit
const emit = defineEmits<{
  // (event: '方法名称'): 方法的返回值
  (event: "fn"): void;
  // (event: '方法名称', ...args方法的参数列表): 方法的返回值
  (event: "alertFn", msg: string): void;
  // update:xxx 固定写法，用于修改父组件中v-model绑定的值
  (event: "update:num2", n: number): void;
}>();

const childClick = () => {
  emit("fn");
};

const sendClick = () => {
  emit("alertFn", "child msg: hello world");
};

let n = props.num2;
const updateNum = () => {
  emit("update:num2", n++);
};
</script>

<style lang="scss" scoped></style>
