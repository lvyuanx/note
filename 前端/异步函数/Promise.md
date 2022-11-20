# 异步函数笔记



## Promise

###  Promise入门

**什么是Promise？**

>Promise用于处理一些需要花费长时间的任务，进行异步处理，防止任务阻塞。一般是说解决了回调地狱的问题。

什么是回调地狱?

```js
getHotPot(function (data) {  //吃火锅
    console.log(data);
    getTea(function (data) {  //吃奶茶
        console.log(data);
        getNailArt(function (data) {  //美甲
            console.log(data);
            getMassage(function (data) {  //按摩
                console.log(data);
                getMovie(function (data) {  //看电影
                    console.log(data);
                })
            })
        })
    })
})
```

为了控制顺序获得结果，并且这个结果是异步操作，那就不能直接return，用回调函数获取，还需要嵌套，嵌套多了就形成了回调地狱，代码不易维护。



**Promise解决了什么问题?**

- 回调地狱，代码难以维护， 常常第一个的函数的输出是第二个函数的输入这种现象
- promise可以支持多个并发的请求，获取并发请求中的数据
- 这个promise可以解决异步的问题，本身不能说promise是异步的



**Promise初体验**

```js
 function rander(m, n) {
     return Math.floor(Math.random() * (n - m + 1) + m)
 }

const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        let n = rander(1, 10)
        if (n < 9) {
            reject(n) // 成功回调
        } else {
            resolve(n) // 失败回调
        }
    }, 2000)
})

p.then((value) => {
    alert("success " + value)
}, (reason) => {
    alert("error " + reason)
})
```



