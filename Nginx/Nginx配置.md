# Nginx配置



## 1. main全局设置

>从配置文件开始到 events 块之间的内容，主要会设置一些影响nginx 服务器整体运行的配置指令，主要包括配 置运行 Nginx 服务器的用户（组）、允许生成的 worker_process 数，进程 PID 存放路径、日志存放路径和类型以 及配置文件的引入等。
>比如上面第一行配置的：

![image-20220314152721554](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220314152721554.png)

```bash
# 指定用户
#user  nobody;
# 指定进程数，一般是核心数的两倍
worker_processes  2;
# 日志记录
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
# 进程id
#pid        logs/nginx.pid;
```





## 2. events工作模式

>events 块涉及的指令**主要影响 Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 work process 下的网络连接进行序列化，是否 允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。**
>上述例子就表示每个 work process 支持的最大连接数为 1024.
>这部分的配置对 Nginx 的性能影响较大，在实际中应该灵活配置

![image-20220314152803498](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220314152803498.png)

```bash
events {
    # 工作模型
    use epoll;
    # 打开的文件数，根据实际性能决定
    worker_connections  1024;
}
```



## 3. http设置



### 3.1 upstream设置

![image-20220314153042034](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220314153042034.png)



### 3.2  server主机设置

![image-20220314153158887](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220314153158887.png)



#### 3.2.1 location（url匹配设置）

![image-20220314153255305](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220314153255305.png)