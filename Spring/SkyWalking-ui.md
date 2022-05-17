# Skywalking UI 监控视角与指标介绍

本文介绍 Skywalking UI 6.5.0的主要监控视角和指标，数据来自 [Skywalking Living Demo](http://122.112.182.72:8080/)，Skywalking 缩写为 SW。

Living Demo 版本可能不断升级，与文中截图不一定匹配。

## 主要指标

### cpm 每分钟请求数

cpm 全称 call per minutes，是吞吐量(Throughput)指标。

下图是拼接的全局、服务、实例和接口的吞吐量及平均吞吐量。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/3.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/3.png)

第一条185cpm=185/60=3.08个请求/秒。

### SLA 服务等级协议

SLA 全称 Service-Level Agreement，直译为 **“服务等级协议”**，用来表示提供服务的水平。

在IT中，SLA可以衡量平台的可用性，下面是N个9的计算：

```
1年 = 365天 = 8760小时
99     = 8760 * 1%     => 3.65天
99.9   = 8760 * 0.1%   => 8.76小时
99.99  = 8760 * 0.01%  => 52.6分钟
99.999 = 8760 * 0.001% => 5.26分钟
```

因此，全年只要发生一次较大规模宕机事故，4个9肯定没戏，一般平台3个9差不多。

但2个9就基本不可用了，相当于全年有87.6小时不可用，每周(一个月按4周算)有1.825小时不可用。

下图是服务、实例、接口的SLA，一般看年度、月度即可。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/4.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/4.png)

### Response Time 响应时间

表示请求响应时间，对于人来说，响应时间最好不要超过2秒，超过就会觉得卡顿。对于系统接口交互来说，时间自然越短越好，500ms以内是比较好的。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/6.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/6.png)

### Percent Response 百分位数统计

表示采集样本中某些值的占比，Skywalking 有 **“p50、p75、p90、p95、p99”** 一些列值。

途中的 **“p99:390”** 表示 99% 请求的响应时间在390ms以内。

而99%一般用于抛掉一些极端值，表示绝大多数请求。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/7.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/7.png)

### Slow Endpoint 慢端点

Endpoint 表示具体的服务，例如一个接口。下面是全局Top N的数据，通过这个可以观测平台性能情况。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/8.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/8.png)

## 监控视角

### Heatmap 热力图

Heapmap 可译为热力图、热度图都可以，途中颜色越深，表示请求数越多，这和GitHub Contributions很像，commit越多，颜色越深。

横坐标是响应时间，鼠标放上去，可以看到具体的数量。

通过热力图，一方面可以直观感受平台的整体流量，另一方面也可以感受整体性能。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/9.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/9.png)

### Topology 拓扑图

拓扑图用来描述平台各服务之间的依赖关系，也可以理解为平台服务的整体结构。

下图是整体的依赖关系，正方体上面的小图标表示应用的类型，如：Spring MVC、H2、Kafka

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/10.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/10.png)

当点中某个服务时，会展示该服务的依赖关系。左右也会有该服务的一些指标信息。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/14.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/14.png)

### Trace 追踪

利用Trace功能进行链路追踪，可以跟着请求穿透整个系统。

下面是检索到的一个ERROR请求，耗时 8326ms，跨度14表示14次依赖调用，例如：SpringRestTemplate、H2、Feign、Httpclient、Kafka等。

下图右侧可以了解每个跨度(Spans)的耗时情况，可以一眼看出哪些耗时长。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/15.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/15.png)

而树形结构的图可以看清层次关系。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/16.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/16.png)

而点到具体的跨度上，可以看到明细信息，如点到DB上可以看到具体执行的SQL。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/17.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/17.png)

### Alarm告警信息

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/18.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/18.png)

### JVM 信息

实例中有JVM的堆、GC、CPU、CLR等信息，不过对于监控，Promethus 是个更好的选择。

[![img](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/19.png)](https://blog-1256695615.cos.ap-shanghai.myqcloud.com/2020/02/22/19.png)