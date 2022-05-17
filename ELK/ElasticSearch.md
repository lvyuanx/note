# ElasticSearch 笔记

## 1. Elasticsearch初体验

### 1.1 下载

> 安装环境要求：JDK1.8及以上版本

下载地址：

* [华为镜像下载](https://mirrors.huaweicloud.com/elasticsearch/?C=N&O=D)
* [官方下下载](https://www.elastic.co/cn/elasticsearch/)



### 1.2 windows下安装

> 直接解压官网下载的压缩包即可使用了

![image-20220219224038250](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219224038250.png)



### 1.3 熟悉常用目录结构

```
bin 	存放启动文件等批处理文件
config	配置文件
	log4j2				日志配置文件
	jvm.options			java虚拟机相关的配置
	elasticsearch.yml	elasticsearch的配置文件
lib		存放jar包的目录
logs	日志目录
modules	功能模块的目录
plugins	插件目录
```



### 1.4 启动Elasticsearch

双击bin目录下的elasticsearch.bat文件，即可启动。

![image-20220219225413036](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219225413036.png)

![image-20220219225631966](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219225631966.png)

浏览器访问：localhost:9200,如图所示。

![image-20220219225738572](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219225738572.png)



### 1.5 安装可视化界面

> 需要nodejs的环境才可以运行项目

下载地址：[elasticsearch-head](https://github.com/mobz/elasticsearch-head/)

![image-20220219230349295](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219230349295.png)



1. 安装

   ```bash
   npm install
   ```

    ![image-20220219230551730](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219230551730.png)

2. 运行

   ==需要修改elasticsearch的config目录下的application.yml文件，添加以下配置，解决跨域问题==

   ![image-20220219231321236](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219231321236.png)

   ```bash
   npm run start
   ```

    ![image-20220219230901636](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219230901636.png)

3. 访问测试

    ![image-20220219232620984](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20220219232620984.png) 

   