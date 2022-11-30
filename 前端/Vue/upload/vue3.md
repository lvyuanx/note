# Vue2+Vue3小白零基础教程—vue3篇

> 提示：Vue2系列请参考[Vue2+Vue3小白零基础教程—vue2篇](https://blog.csdn.net/lvyuanxiang/article/details/120445354)文章，本文为vue2小白零基础教程续集。

[TOC]

## 6. Vue3快速上手

![image-20210831103649298](https://gitee.com/testlyx/cloudimage/raw/master/img/202109232316365.png)

### 6.1 简介

* 2020年9月18日,uejs发布3.0版本,代号: One Piece(海贼王)
* 耗时2年多、2600+次提交、30+个RFC、600+次PR、99位贡献者
* github上的tags地址: https://github.com/vuejs/vue-next/releases/tag/v3.0.0



### 6.2  新特性

#### 6.2.1 性能提升

* 打包大小减少41%
* 初次渲染快55%,更新渲染快133%
* 内存减少54%
* ...



#### 6.2.2 源码的升级

* 使用Proxy代替 defineProper实现响应式
* 重写虚拟DOM的实现和 Tree-Shaking
* ...



#### 6.2.3 拥抱 Type Script

* vue3可以更好的支持 TypeScript



#### 6.2.4 新的特性

1. Composition API(组合AP)

  * setup配置
  * ref与 reactive
  * watch与 watch Effect
  * provide与 inject
  * ...

2. 新的内置组件
   * Fragment
   * Teleport
   * Suspense
3. 其他改变
   * 新的生命周期钩子
   * data选项应始终被声明为一个函数
   * 移除 ckey Code支持作为v-on的修饰符
   * ...



## 7. 创建Vue3工程

### 7.1 使用vue-cli创建

官方文档：https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create

```shell
## 查看@vue/cli版本，确保@vue/cli版本在4.5.0以上
vue --version
## 安装或升级你的@vue/cli
npm install -g @vue/cli
## 创建
vue create vue_test
## 启动
cd vue_test
npm run serve
```



### 7.3 使用vite创建

官方文档：https://v3.cn.vuejs.org/guide/installation.html#vite

vte官网: https://vitejs.cn

* 什么是vite?—新代前端构建工具

* 优势如下:

  * 开发环境中,无需打包操作,可快速的冷启动。
  * 轻量快速的热重载(HMR)。
  * 真正的按需编译,不再等待整个应用编译完成

* 传统构建与vite构建对比图

  ![image-20210831111956140](https://gitee.com/testlyx/cloudimage/raw/master/img/202109232314827.png) 

```shell
$ npm init vite <project-name> -- --template vue
$ cd <project-name>
$ npm install
$ npm run dev
```



## 8. 常用 Composition API

官方文档：[介绍 | 组合式API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)



### 8.1 拉开序幕的 setup

1. 理解:We3.0中一个新的配置项,值为一个函数
2. stup是所有 **composition AP(组合AP)**“表演的舞台”。
3. 组件中所用到的:数据、方法等等,均要配置在 setup中

4. setup函数的两种返回值:

* 若返回一个对象,则对象中的属性、方法,在模板中均可以直接使用。(重点关注!)
* 若返回一个渲染函数:则可以自定义渲染内容。(了解

5. 注意点
   * 尽量不要与ue2.x配置混用
     * Vue2X配置(data、 methos、 computed...)中可以访问到 setup中的属性、方法。
     * 但在 setup中不能访问到Vue2x配置(data、 methdos、 computed.)
     * 如果有重名, setup优先
   * setup不能是一个 async函数,因为返回值不再是 return的对象,而是 promise,模板看不到 Return对象中的属性。(后期也可以返回一个 Promise实例,但需要 Suspense和异步组件的配合)

```vue
<template>
  <h1>我的姓名：{{name}}</h1>
  <h1>我的年龄：{{age}}</h1>
  <h1>性别：{{sex}}</h1>
  <h1>a的值是：{{a}}</h1>
  <button @click="sayHello">button</button>
  <br>
  <br>
  <button @click="sayWelcome">welcome</button>
  <br>
  <br>
  <button @click="test1">vue2中调用vue3的方法和属性</button>
  <br>
  <br>
  <button @click="test2">vue3中调用vue2的方法和属性</button>
</template>

<script>
import {h} from "vue"
export default {
  name:"App",
  data(){
    return{
      sex: "男",
      a: 100
    }
  },
  methods:{
    sayWelcome(){
      alert("welcome!")
    },
    test1(){
      console.log(this.name,this.age,this.sayHello)
    }
  },
  //此处只是测试setup函数，暂不考虑响应式的问题
  setup(){
    //数据
    let name = "张三"
    let age  = 18
    let a = 200
    
    //方法
    function sayHello(){
      alert(`我叫${name},我今年${age}岁了!`)
    }
    function test2(){
      console.log(this.sex,this.sayWelcome)
    }

    //返回对象(常用)
    return{
      name,
      age,
      a,
      sayHello,
      test2
    }

    //返回函数(渲染函数)
    // return ()=>{return h('h1', "hello world")}

  }
}
</script>
```



### 8.2 ref函数

* 作用:定义一个响应式的数据
* 语法:`const xxx = ref( initValue)`
  * 创建一个包含响应式数据的**引用对象( reference对象,简称ref对象)**
  * JS中操作数据: `xxx.value`
  * 模板中读取数据:不需要`.value`,直接: `<div>{{xxx}}</div>`
* 备注
  * 接收的数据可以是:==基本类型、也可以是对象类型==。
  * 基本类型的数据:响应式依然是靠 Object.defineProperty()的get与set完成的
  * 对象类型的数据:内部“求助”vue3.0中的一个新函数— reactive函数

```vue
<template>
  <h1>我的姓名：{{name}}</h1>
  <h1>我的年龄：{{age}}</h1>
  <h1>学业信息：{{info.type}}</h1>
  <h1>学号：{{info.sid}}</h1>
  <button @click="updateInfo">button</button>
  <br>

</template>

<script>
import {ref} from "vue"
export default {
  name:"App",
  setup(){
    //数据(响应式)
    let name = ref("张三")
    let age  = ref(18)
    let info = ref({
      type: "大学生",
      sid: "101011001"
    })

    function updateInfo(){
      name.value = "李四"
      age.value = 20
      info.value.type = "小学生"
      info.value.sid = "101022201012"
    }

    //返回对象(常用)
    return{
      name,
      age,
      info,
      updateInfo
    }

    //返回函数(渲染函数)
    // return ()=>{return h('h1', "hello world")}

  }
}
</script>
```



### 8.3 reactive函数

* 作用: 定仪一个==对象类型==的响应式数据(基本类型不要用它,要用ref函数)
* 语法: `const 代理对象= reactive(源对象)`接收一个对象(或数组),返回一个代理对象( proxy对象)
* reactive定义的响应式数据是“深层次的
* 内部基于ES6的` Proxy`实现,通过代理对象操作源对象内部数据进行操作

```vue
<template>
  <h1>我的姓名：{{person.name}}</h1>
  <h1>我的年龄：{{person.age}}</h1>
  <h1>学业信息：{{person.info.type}}</h1>
  <h1>学号：{{person.info.sid}}</h1>
  <h1>爱好: {{person.hibby}}</h1>
  <button @click="updateInfo">button</button>
  <br>

</template>

<script>
import {reactive, ref} from "vue"
export default {
  name:"App",
  setup(){
    let person = reactive({
      //数据(响应式)
      name:ref("张三"),
      age:ref(18),
      info:ref({
        type: "大学生",
        sid: "101011001"
      }),
      hibby:["抽烟", "喝酒", "烫头"]
    })

    function updateInfo(){
      person.name="李四"
      person.age=19
      person.info.sid=22222222
      person.hibby[0]="打篮球"
    }

    //返回对象(常用)
    return{
      person,
      updateInfo
    }

  }
}
</script>
```



### 8.4 vue3.0中的响应式原理

#### 8.4.1 Vue2x的响应式

* 实现原理

  * 对象类型: 通过 `object.defineProperty()`对属性的读取、修改进行拦截(数据劫持)。

  * 数组类型: 通过重写更新数组的**一系列方法**来实现拦截。(对数组的变更方法进行了包裹)

    ```js
    Object.defineProperty(data, 'count', {
        get(){...},
        set(){...}
    })
    ```

* 存在问题

  * 新增属性、删除属性,界面不会更新。
  * 直接通过下标修改数组,界面不会自动更新。



#### 8.4.2 Vue3.0的响应式

* 实现原理:
  * 通过 Proxy(代理): 拦截对象中任意属性的变化,包括:属性值的读写、属性的添加、属性的删除等
  * 通过 Reflect(反射): 对被代理对象的属性进行操作。
  * MDN文档中描述的 Proxy与 Reflect
    * Proxy: [Proxy - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/web/JavaScript/Reference/Global_Objects/Proxy)
    * Reflect: [Reflect - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/web/JavaScript/Reference/Global_Objects/Reflect)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        let person = {
            name: "张三",
            age: 18
        }

        //vue2中的响应式原理
        // let p = {}
        // Object.defineProperty(p, 'name', {
        //     get(){ 
        //         console.log("有人读取了person.name");
        //         return person.name
        //     },
        //     set(value){
        //         console.log("有人修改了person.name");
        //         person.name=value
        //     }
        // })
        // Object.defineProperty(p, 'age', {
        //     get(){ 
        //         console.log("有人读取了person.age");
        //         return person.name
        //     },
        //     set(value){
        //         console.log("有人修改了person.age");
        //         person.name=value
        //     }
        // })

        //vue3中数据响应原理
        let p = new Proxy(person, {
            get(target, propName){
                console.log(`有人读取了person身上的${propName}属性`);
                // return target[propName]
                return Reflect.get(target, propName)
            },
            set(target, propName, value){
                console.log(`有人修改或添加了person身上的${propName}属性`);
                // target[propName] = value
                Reflect.set(target, propName, value)
            },
            deleteProperty(target, propName){
                console.log(`有人删除了person身上的${propName}属性`);
                // return delete target[propName]
                Reflect.deleteProperty(target, propName)
            }
        })
    </script>   
</body>
</html>
```



### 8.5 eactive对ref

从定义数据角度对比

* ref用来定义:**基本类型数据**
* reactive用来定义:**对象(或数组)类型数据**
* 备注: ref可以用来定义对象(或数组)类型数据,它内部会自动通过 reactive转为代理对象

从原理角度对比

* ref通过` Object.defineProperty()`的get与set来实现响应式(数据劫持
* reactive通过使用 `Proxy`来实现响应式(数据劫持),并通过 `Reflect`操作源对象内部的数据。

从使用角度对比

* ref定义的数据:操作数据需要`.value`,读取数据时模板中直接读取不需要`.vaue`
* reactive定义的数据:操作数据与读取数据:均不需要`.value`



### 8.6 setup的两个注意点

* setup执行的时机
  * 在 beforeCreate之前执行一次,this是 undefined。
* setup的参数
  * props:值为对象,包含:组件外部传递过来,且组件内部声明接收了的属性。
  * context:上下文对象
    * atts:值为对象,包含:组件外部传递过来,但没有在pops配置中声明的属性,相当于`this. $attrs`
    * slots:收到的插槽内容相当于`this.slots`
    * emit:分发自定义事件的函数,相当于`this. $emit`

```vue
<template>
  <Demo 
  :name="info.name" 
  :addr="info.addr"
  @show="show">
  <template v-slot:hello>
    <h1>hello world</h1>
  </template>
  </Demo>

</template>

<script>
import {reactive, ref} from "vue"
import Demo from './components/Demo.vue'

export default {
  name:"App",
  components:{Demo},
  setup(){
    let info = reactive({
      name: "武汉东湖",
      addr: "湖北武汉江夏",
    })

    function show(value){
      alert(`hello ${value}`)
    }

    return {
        info,
        show
    }
  }
}
</script>


```

```vue
<template>
    <h1>学校信息</h1>
    <h2>学校名称：{{name}}</h2>
    <h2>学校地址：{{addr}}</h2>
    <button type="button" @click="hello">button</button>
    <slot name="hello"></slot>
</template>

<script>
export default {
    name:"Demo",
    props:["name", "addr"],
    emits:["show"],
    setup(props, context){
        console.log(props);
        console.log(context);
        console.log(context.attrs);
        console.log(context.emit);
        console.log(context.slots);

        function hello(){
            context.emit("show", "张三")
        }
        return{
            hello
        }
    }
}
</script>

<style>

</style>
```



### 8.7 计算属性与监视

#### 8.7.1 computed函数

与vue2x中 computec配置功能一致

写法

```vue
<template>
<h1>个人信息：</h1>
姓: <input type="text" v-model="person.fristName">
名: <input type="text" v-model="person.lastName"><br><br>
<p>全名：{{person.fullName}}</p>
姓名: <input type="text" v-model="person.fullName"><br><br>
</template>

<script>
import {reactive,computed} from "vue"

export default {
  name:"App",
  setup(){
    let person = reactive({
      fristName : "张",
      lastName : "三"
    })

    // 简写：不考虑计算属性修改的情况
    // person.fullName = computed(()=>{
    //   return person.fristName + '-'+ person.lastName
    // })

    // 完整写法：考虑计算属性的读写
    person.fullName = computed({
      get(){
        return person.fristName + '-'+ person.lastName
      },
      set(value){
        const nameArr = value.split("-")
        person.fristName = nameArr[0]
        person.lastName = nameArr[1]
      }
    })

    return{
      person
    }
  }  
}
</script>
```



#### 8.7.2 watch函数

与Ve2x中 watch配置功能一致

两个小“坑”

* 监视 reactive定义的响应式数据时: oldValue无法正确获取、强制开启了深度监视(deep配置失效
* 监视 reactive定义的响应式数据中某个属性时:deep配置有效

```vue
<template>
<h1>num的值为：{{num}}</h1>
<button @click="num++">num++</button>
<hr>
<h1>姓名：{{name}}</h1>
<button @click="name+='*'">修改姓名</button>
<hr>
<h1>学生信息</h1>
<h2>学生姓名：{{student.sname}}</h2>
<h2>学生学号：{{student.sid}}</h2>
<h2>薪水：{{student.job.j1.salary}}</h2>
<button @click="student.sname += '@'">修改学生姓名</button>
<button @click="student.job.j1.salary += 100">修改薪水</button>
</template>

<script>
import {reactive,ref,watch} from "vue"

export default {
  name:"App",
  setup(){
    let num = ref(0)
    let name = ref("张三")
    let student = reactive({
      sname: "李四",
      sid: "1011",
      job:{
        j1:{
          salary: 10000
        }
      }
    })

    //情况一：监视ref定义的一个属性
    // watch(num,(newValue, oldValue)=>{
    //   console.log("num的值发生了变化",newValue, oldValue)
    // },{immediate:true}) //immediate:true 初始化时就开始调用一次


    //情况二：监视ref定义的个属性
    // watch([name,num],(newValue, oldValue)=>{
    //   console.log("name或num的值发生了变化",newValue, oldValue)
    // },{immediate:true}) //immediate:true 初始化时就开始调用一次


    /*情况三：监视reactive定义的全部属性，
        1. 注意：此时无法获取正确的oldValue
        2. 注意：强制开启了深度监视，deep配置无效
    */
    // watch(student,(newValue, oldValue)=>{
    //   console.log("student的值发生了变化",newValue, oldValue)
    // },{immediate:true}) //immediate:true 初始化时就开始调用一次

    //情况四：监视reactive定义的某个属性,此时oldValue能正确获取值
    // watch(()=>student.job.j1.salary,(newValue, oldValue)=>{
    //   console.log("student的值发生了变化",newValue, oldValue)
    // })


    //情况四：监视reactive定义的某些属性,此时oldValue能正确获取值
    // watch([()=>student.job.j1.salary, ()=>student.sname],(newValue, oldValue)=>{
    //   console.log("student的值发生了变化",newValue, oldValue)
    // })

    //情况四：监视reactive定义的深层属性,此时oldValue能正确获取值
    watch(()=>student.job,(newValue, oldValue)=>{
      console.log("student的job值发生了变化",newValue, oldValue)
    },{deep:true})

    return {
      num,
      name,
      student
    }
  }  
}
</script>
```



#### 8.7.3 watchEffect

* watch的套路是: 既要指明监视的属性,也要指明监视的回调
* watchEffect的套路是: **不用指明监视哪个属性,监视的回调中用到哪个属性,那就监视哪个属性。**
* watchEffect有点像 computed
  * 但 computed注重的计算出来的值(回调函数的返回值),所以必须要写返回值。
  * 而 watchEffect更注重的是过程(回调函数的函数体),所以不用写返回值。

```vue
<template>
<h1>num的值为：{{num}}</h1>
<button @click="num++">num++</button>
<hr>
<h1>姓名：{{name}}</h1>
<button @click="name+='*'">修改姓名</button>
<hr>
<h1>学生信息</h1>
<h2>学生姓名：{{student.sname}}</h2>
<h2>学生学号：{{student.sid}}</h2>
<h2>薪水：{{student.job.j1.salary}}</h2>
<button @click="student.sname += '@'">修改学生姓名</button>
<button @click="student.job.j1.salary += 100">修改薪水</button>
</template>

<script>
import {reactive,ref,watchEffect} from "vue"

export default {
  name:"App",
  setup(){
    let num = ref(0)
    let name = ref("张三")
    let student = reactive({
      sname: "李四",
      sid: "1011",
      job:{
        j1:{
          salary: 10000
        }
      }
    })

    //watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调
    watchEffect(()=>{
      let a = num.value
      let b = student.job.j1.salary
      console.log("watchEffect....")
    })

    return {
      num,
      name,
      student
    }
  }  
}
</script>
```



### 8.8 生命周期 

<div><div style="width:49%;height:1150px;float:left;" ><img style="height:100%" src="https://gitee.com/testlyx/cloudimage/raw/master/img/202109232318912.png"> </div><div style="width:49%;height:1150px;float:left;margin-left:2%;"><img style="height:100%" src="https://gitee.com/testlyx/cloudimage/raw/master/img/202109232318913.svg"></div></div>





























































* vue3.0中可以继续使用ue2x中的生命周期钩子,但有有两个被更名
  * `beforeDestroy`改名为 `beforeUnmount`
  * `destroyed`改名为`unmount`
* vue3.0也提供了 Composition API形式的生命周期钩子,与vue2.x中钩子对应关系如下
  * setup() ==> beforeCreate()
  * setup() ==> created()
  * onBeforeMount() ==> beforeMount()
  * onMount() ==> mounted()
  * onBeforeUpdate() ==> beforeUpdate()
  * onUpdated() ==> updated()
  * onBeforeUnmount() ==> beforeDestroy()
  * onUnmount() ==> destroyed()

```vue
<template>
<h1>hello world</h1> 
<h2>num : {{num}}</h2>
<button @click="num ++">num ++</button>
</template>

<script>
import {ref,onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted} from "vue"
export default {
    name:"Demo",
    setup(){
        
      let num = ref(0)
      //组合式api生命周期
      console.log("--setup,相当于：beforeCreate和Created--")
      onBeforeMount(()=>{
          console.log("--onBeforeMount--");
      })
      onMounted(()=>{
          console.log("--onMounted--");
      })
      onBeforeUpdate(()=>{
          console.log("--onBeforeUpdate--");
      })
      onUpdated(()=>{
          console.log("--onUpdated--");
      })
      onBeforeUnmount(()=>{
          console.log("--onBeforeUnmount--");
      })
      onUnmounted(()=>{
          console.log("--onUnmounte--");
      })

      return{
          num
      }  
    },
    //生命周期函数
    // beforeCreate(){
    //     console.log("---beforeCreate--");
    // },
    // created(){
    //     console.log("---created--");
    // },
    // beforeMount(){
    //     console.log("---beforeMount--");
    // },
    // mounted(){
    //     console.log("---mounted--");
    // },
    // beforeUpdate(){
    //     console.log("---beforeUpdate--");
    // },
    // updated(){
    //     console.log("---updated--");
    // },
    // beforeUnmount(){
    //     console.log("---beforeUnmount--");
    // },
    // unmounted(){
    //     console.log("---unmounted--");
    // },
    // vue2x中的生命周期函数，Vue3中被改名为beforeUnmount,unmounted
    // beforeDestroy(){  
    //     console.log("---beforeDestroy--");
    // },
    //destroyed(){
    //     console.log("---destroyed--");
    // },

}
</script>

<style>

</style>
```



### 8.9 自定义hook函数

什么是hook?

* 本质是一个函数,把 setup函数中使用的 Composition AP进行了封装。
* 类似于vue2x中的mixin
* 自定义hok的优势:复用代码,让 setup中的逻辑更清楚易懂

1. hook函数

   ```js
   import {reactive,onMounted, onUnmounted} from "vue"
   export default function(){
       let point = reactive({
           x: 0, 
           y: 0
       })
       function getPoint(event){
           point.x = event.pageX
           point.y = event.pageY
           console.log(point.x,point.y);
       }
       onMounted(()=>{
           window.addEventListener("click", getPoint)
       })
       onUnmounted(()=>{
           window.removeEventListener("click", getPoint)
       })
   
       return point
   }
   ```

   

2. Demo.vue

   ```vue
   <template>
   <h1>hello world</h1> 
   <h2>num : {{num}}</h2>
   <button @click="num ++">num ++</button>
   <hr>
   <h2>鼠标点击的坐标为：x:{{point.x}}, y:{{point.y}}</h2>
   </template>
   
   <script>
   import {ref} from "vue"
   import usePoint from "../hooks/usePoint"
   export default {
       name:"Demo",
       setup(){
           
         let num = ref(0)
         let point = usePoint() //使用hook函数
   
         return{
             num,
             point
         }  
       },
   
   
   }
   </script>
   
   <style>
   
   </style>
   ```



### 8.10 0 toRef

* 作用:创建一个ref对象,其 value值指向另一个对象中的某个属性。
* 语法：`const name =  toRef(person, "name")`
* 应用:要将响应式对象中的某个属性单独提供给外部使用时。
* 扩展: `toRefs`与`toRe`功能一致,但可以批量创建多个re对象,语法: `toRefs(person)`

```vue
<template>
  <h1>{{person}}</h1>
  <h1>我的姓名：{{name}}</h1>
  <h1>我的年龄：{{age}}</h1>
  <h1>学业信息：{{info.type}}</h1>
  <h1>学号：{{info.sid}}</h1>
  <h1>爱好: {{hibby}}</h1>
  <button @click="updateInfo">button</button>
  <br>

</template>

<script>
import {reactive, ref, toRef,toRefs} from "vue"
export default {
  name:"App",
  setup(){
    let person = reactive({
      //数据(响应式)
      name:ref("张三"),
      age:ref(18),
      info:ref({
        type: "大学生",
        sid: "101011001"
      }),
      hibby:["抽烟", "喝酒", "烫头"]
    })

    function updateInfo(){
      person.name="李四"
      person.age=19
      person.info.sid=22222222
      person.hibby[0]="打篮球"
    }

    //返回对象(常用)
    return{
      person,
      // name:toRef(person,"name"),
      // age:toRef(person,"age"),
      ...toRefs(person),
      updateInfo
    }

  }
}
</script>
```



## 9. 其它 Composition API

### 9.1 shallowReactive 与 shallowRef

* shallowReactive:只处理对象最外层属性的响应式(浅响应式)
* shallowRef:只处理基本数据类型的响应式,不进行对象的响应式处理。
* 什么时候使用?
  * 如果有一个对象数据,结构比较深,但变化时只是外层属性变---> shallowReactive
  * 如果有一个对象数据,后续功能不会修改该对象中的属性,而是生新的对象来替换---> shallowRef

> ==**遇到bug**：在多个shallowRef属性时，一个时基本的数据类型，一个是对象类型，先点击修改对象的类型，后点击修改基本数据类型，之前修改而为响应的对象类型也会修改。==

```vue
<template>
<h1>num的值为：{{num}}</h1>
<button @click="num++">num++</button>
<hr>
<h1>x的值为：{{x}}</h1>
<button @click="x.y+=1">x.y++</button>
<button @click="x={y:88}">替换x</button>
<hr>
<hr>
<h1>学生信息</h1>
<h2>学生姓名：{{student.sname}}</h2>
<h2>学生学号：{{student.sid}}</h2>
<h2>薪水：{{student.job.j1.salary}}</h2>
<button @click="student.sname += '@'">修改学生姓名</button>
<button @click="student.job.j1.salary += 100">修改薪水</button>
</template>

<script>
import {shallowReactive,shallowRef} from "vue"

export default {
  name:"App",
  setup(){
    let num = shallowRef(0) //浅层响应式，如果是基本数据类型，有响应式
    let num2 = shallowRef(0) //浅层响应式，如果是基本数据类型，有响应式
    let x = shallowRef({ //浅层响应式，如果是对象类型，没有响应式
      y : 0
    })
    let student = shallowReactive({ //浅层响应式，无法修改深层次属性
      sname: "李四",
      sid: "1011",
      job:{
        j1:{
          salary: 10000
        }
      }
    })

    return {
      num,
      num2,
      x,
      student
    }
  }  
}
</script>
```



### 9.2 readonly 5 shallowReadonly

* readonly: 让一个响应式数据变为只读的(深只读）
* shallowReadonly: 让一个响应式数据变为只读的(浅只读）
* 应用场景:不希望数据被修改时。

```vue
<template>
<h1>num的值为：{{num}}</h1>
<button @click="num++">num++</button>
<hr>

<hr>
<h1>学生信息</h1>
<h2>学生姓名：{{student.sname}}</h2>
<h2>学生学号：{{student.sid}}</h2>
<h2>薪水：{{student.job.j1.salary}}</h2>
<button @click="student.sname += '@'">修改学生姓名</button>
<button @click="student.job.j1.salary += 100">修改薪水</button>
</template>

<script>
import {ref,reactive,readonly,shallowReadonly} from "vue"

export default {
  name:"App",
  setup(){
    let num = ref(0) 
    
    let student = reactive({ 
      sname: "李四",
      sid: "1011",
      job:{
        j1:{
          salary: 10000
        }
      }
    })
    num = readonly(num) //让一个响应式数据变为只读的(深只读）
    student = shallowReadonly(student) //让一个响应式数据变为只读的(浅只读),深层次还可以响应式

    return {
      num,
      student
    }
  }  
}
</script>
```



### 9.3 toRaw与 markAn

* toRaw
  * 作用: 将一个由 reactive生成的**响应式对象**转为**普通对象**
  * 使用场景: 用于读取响应式对象对应的普通对象,对这个普通对象的所有操作,不会引起页面更新
* markRaw
  * 作用: 标记一个对象,使其永远不会再成为响应式对象
  * 应用场景
    1. 有些值不应被设置为响应式的,例如复杂的第三方类库等。
    2. 当渲染具有不可变数据源的大列表时,跳过响应式转换可以提高性能

```vue
<template>
<h1>num的值为：{{num}}</h1>
<button @click="num++">num++</button>
<hr>

<hr>
<h1>学生信息</h1>
<h2>学生姓名：{{student.sname}}</h2>
<h2>学生学号：{{student.sid}}</h2>
<h2>薪水：{{student.job.j1.salary}}</h2>
<h2 v-if="student.car">Car：{{student.car}}</h2>
<button @click="student.sname += '@'">修改学生姓名</button>
<button @click="student.job.j1.salary += 100">修改薪水</button>
<button @click="showStudent">显示学生原始信息</button>
<button @click="addCar">添加一台汽车</button>
<button v-if="student.car" @click="student.car.price ++">修改价格</button>
<button v-if="student.car" @click="student.car.name += '!'">修改汽车名</button>
</template>

<script>
import {ref,reactive,toRaw, markRaw} from "vue"

export default {
  name:"App",
  setup(){
    let num = ref(0) //
    
    let student = reactive({ //
      sname: "李四",
      sid: "1011",
      job:{
        j1:{
          salary: 10000
        }
      }
    })
  
    function showStudent(){
      const stu = toRaw(student) //只能应用在响应式对象身上
      console.log(stu)
    }

    function addCar(){
      let car = {name:"红旗H5", price:40}
      student.car = markRaw(car) //将响应式student中的car标记为非响应式
      console.log(student);
    }

    return {
      num,
      student,
      showStudent,
      addCar
    }
  }  
}
</script>
```



### 9.4 customRef

* 作用: 创建一个自定义的ref,并对其依赖项跟踪和更新触发进行显式控制
* 实现防抖效果:

```vue
<template>
<h1>{{msg}}</h1>
<input type="text" v-model="msg" >
</template>

<script>
import {customRef} from "vue"

export default {
  name:"App",
  setup(){
    let msg = myRef("hello world")
    function myRef(value){
      return customRef((track,trigger)=>{
        let timer
        return{
          get(){
            console.log(`msg：${value}被读取了！`)
            track() //通知vue追踪msg的变化
            return value
          },
          set(newValue){
            console.log(`msg：${value}修改为：${newValue}!`);
            clearTimeout(timer)
            timer = setTimeout(()=>{ //页面延时响应
              value = newValue
              trigger() //通知vue解析模板
            },500)
          }
        }
      })
    }

    return {
      msg
    }
  }  
}
</script>
```



### 9.5 provide与 inject

![image-20210910220500173](https://gitee.com/testlyx/cloudimage/raw/master/img/202109232314825.png)

* 作用: **实现祖孙组件(跨级组件)间通信**

* 套路:父组件有一个` provide`选项来提供数据,子组件有一个` inject`选项来开始使用这些数据

* 具体写法:

  * 祖组件中

    ```vue
    <template>
      <div class="app">
        <h1>祖组件, 汽车品牌：{{name}}, 价格{{price}}</h1>
        <Child/>
      </div>
    </template>
    
    <script>
    import Child from "./components/Child.vue"
    import {reactive,toRefs,provide} from "vue"
    export default {
      name:"App",
      components:{Child},
      setup(){
        let car = reactive({
          name: "红旗H5",
          price: "40w"
        })
        provide("car",car) //将car传给后代
        return{
          ...toRefs(car)
        }
    
      }
    }
    </script>
    
    <style scoped>
    .app{
      padding: 10px;
      background-color: blueviolet;
    }
    </style>
    ```

  * 子组件中(孙组件可以使用provid和inject，也可以使用props)

    ```vue
    <template>
      <div class="child">
        <h1>子组件</h1>
        <Son/>
      </div>
    </template>
    
    <script>
    import Son from "./Son.vue"
    export default {
      name:"Child",
      components:{Son}
    }
    </script>
    
    <style scoped>
    .child{
        padding: 10px;
        background-color: chartreuse;
    }
    </style>
    ```

  * 孙组件中

    ```vue
    <template>
      <div class="son">
        <h1>孙组件, 汽车品牌：{{name}}, 价格{{price}}</h1>
      </div>
    </template>
    
    <script>
    import {inject, toRefs} from "vue"
    export default {
      name:"Son",
      setup(){
        let car = inject("car")
        return{
          ...toRefs(car)  
        }
      }
      
    }
    </script>
    
    <style scoped>
    .son{
        padding: 10px;
        background-color:orange;
    }
    </style>
    ```



### 9.6 响应式数据的判断

* isRef: 检查一个值是否为一个ref对象
* isReactive: 检查一个对象是否是由` reactive`创建的响应式代理
* isReadonly: 检查一个对象是否是由 `readonly`创建的只读代理
* isProxy: 检查一个对象是否是由 `reactive`或者 `readonly`方法创建的代理

```vue
<template>
  <div class="app">
    <h1>祖组件, 汽车品牌：{{name}}, 价格{{price}}</h1>
  </div>
</template>

<script>
import {reactive,ref,readonly,toRefs,isReactive,isRef,isReadonly,isProxy} from "vue"
export default {
  name:"App",
  setup(){
    let car = reactive({
      name: "红旗H5",
      price: "40w"
    })
    let num = ref(0)
    let car2 = readonly(car)
    console.log(isReactive(car));
    console.log(isRef(num));
    console.log(isReadonly(car2));
    console.log(isProxy(car2));
    console.log(isProxy(car));
    
    return{
      ...toRefs(car)
    }

  }
}
</script>

<style scoped>
.app{
  padding: 10px;
  background-color: blueviolet;
}
</style>
```



* ## 10. Componsition API的优势

  ### 10.1 Options API存在的问题

  传统 OptionsAPI中,新增或者修改一个需求,就需要分别在data, methods, computed里修改

  ![1](https://gitee.com/testlyx/cloudimage/raw/master/img/202109232320311.gif)

  

  ### 10.2 Composition API的优势

  我们可以更加优雅的组织我们的代码,函数。让相关功能的代码更加有序的组织在一起

  ![2](https://gitee.com/testlyx/cloudimage/raw/master/img/202109232320303.gif)

  

  ## 11. 新的组件

  ### 11.1 Fragment

  * 在vue2中:组件必须有一个根标签
  * 在vue3中:组件可以没有根标签,内部会将多个标签包含在一个 Fragment虚拟元素中
  * 好处:减少标签层级,减小内存占用

  ### 11.2 Teleport

  * 什么是 Teleport?
  * Teleport是一种能够将我们的组件html结构移动到指定位置的技术

  ```vue
  <template>
      <button @click="isShow = true">显示弹窗</button>
      <teleport to="body">
          <div v-if="isShow" class="mask">
              <div class="dialog">
                  <h1>弹窗</h1>
                  <p>这是一个弹窗</p>
                  <button @click="isShow = false">关闭弹窗</button>
              </div>
          </div>
      </teleport>
      
  </template>
  
  <script>
  import { ref } from 'vue'
  export default {
      name:"Dialog",
      setup(){
          let isShow = ref(false)
          return{
              isShow
          }
      }
  }
  </script>
  
  <style>
  .mask{
      position: absolute;
      top: 0;bottom: 0;left: 0;right: 0;
      background-color: rgba(0, 0, 0, 0.5);
  }
  .dialog{
      background-color: palegreen;
      border-radius: 5px;
      width: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 30px;
      text-align: center;
      border: 4px solid white;
  }
  </style>
  ```

  

  ### 11.3 Suspense

  * 等待异步组件时渲染一些额外内容,让应用有更好的用户体验

  * 使用步骤:

    * 异步引入组件

      ```vue
      <template>
        <div class="app">
          <h1>父组件</h1>
          <Suspense>
            <template v-slot:default>
              <Child/>
            </template>
            <template v-slot:fallback>
              <h3>加载中。。。</h3>
            </template>
          </Suspense>
          
        </div>
      </template>
      
      <script>
      // import Child from "./components/Child.vue" //静态引入
      
      import {defineAsyncComponent} from "vue"
      const Child = defineAsyncComponent(()=> import ("./components/Child.vue")) //异步引入
      
      export default {
        name:"App",
        components:{Child},
      }
      </script>
      
      <style scoped>
      .app{
        padding: 10px;
        background-color: blueviolet;
      }
      </style>
      ```

    * 子组件

      ```vue
      <template>
        <div class="child">
          <h1>子组件</h1>
          <h2>{{num}}</h2>
        </div>
      </template>
      
      <script>
      import { ref } from 'vue'
      export default {
        name:"Child",
        async setup(){
          let num = ref(99)
          let p = new Promise((resolve, reject)=>{
            setTimeout(()=>{
              resolve({num})
            }, 1000)
          })
          return await p
        }
      }
      </script>
      
      <style scoped>
      .child{
          padding: 10px;
          background-color: chartreuse;
      }
      </style>
      ```

  

  ## 12. 其他

  ### 12.1 全局API的转移

  * vue2x有许多全局API和配置

    * 例如:注册全局组件、注册全局指令等

      ```vue
      //注册全局组件
      Vue.component('MyButtom',{
      	data:()=>({
      		count: 0
      	}),
      	template: '<button @click="count++">Chicked {{count}}</button>'
      })
      //注册全局指令
      Vue.directive('focus',{
      	inserted: el => el.focus()
      })
      ```

  * vue3.0中对这些API做出了调整

    * 将全局的API，即: `vue.xxx`调整到应用实例(`app`)上

      ![image-20210911002146145](https://gitee.com/testlyx/cloudimage/raw/master/img/202109232320297.png) 

  

  ### 12.2 其他改变

  * data选项应始终被声明为一个函数

  * 过度类名的更改

    * vue2x写法

      ```vue
      .v-enter
      .v-leave-to{
      	opacity: 0;
      }
      .v-leave,
      .v-enter-to{
      	opacity: 1;
      }
      ```

    * vue3x写法

      ```vue
      .v-enter-from
      .v-leave-to{
      	opacity: 0;
      }
      .v-leave-from,
      .v-enter-to{
      	opacity: 1;
      }
      ```

  * **移除** keyCode作为v-on的修饰符,同时也不再支持 `config.keyCodes`

  * **移除** `v- on.native`修饰符

    * 父组件中绑定事件

      ```vue
      <my-component
      	v-on:close="a"
          v-on:ckick="b"
      />
      ```

    * 子组件中声明自定义事件

      ```vue
      <script>
      	export default{
              emits:['close']
          }
      </script>
      ```

  * **移除**过滤器(fter)

    过滤器虽然这看起来很方便,但它需要一个自定义语法,打破大括号内表达式是“只是 JavaScript"的假设,这不仅有学习成本,而且有实现成本!建议用方法调用或计算属性去替换过滤器。

  * ......