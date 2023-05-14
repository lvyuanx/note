# Flip 动画

原文地址：https://juejin.cn/post/6868914902816915463

```vue
<template>
  <transition-group name="FLIP-wrapper">
    <slot>

    </slot>
  </transition-group>
</template>

<script>
export default {
  name: "FLIPWrapper"
};
</script>

  <!--注意这里的style不能用scoped，否则过渡效果会失效-->
<style>
.FLIP-wrapper-enter-active,
.FLIP-wrapper-leave-active {
  transition: all 0.5s ease;
}

.FLIP-wrapper-leave-active {
  position: absolute;
}

/*元素进入前和离开后的相关样式*/
.FLIP-wrapper-enter,
.FLIP-wrapper-leave-to

/* .component-fade-leave-active for below version 2.1.8 */
  {
  opacity: 0;
  transform: translateY(-100%) scale(0.1);
}

/*使用move class触发FLIP，让兄弟元素产生过渡效果*/
.FLIP-wrapper-move {
  transition: transform 1s, opacity 2s;
}
</style>
```

