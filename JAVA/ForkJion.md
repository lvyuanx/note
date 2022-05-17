# ForkJion

## 1、ForkJion 简介

![image-20211004154815748](https://gitee.com/testlyx/cloudimage/raw/master/img/202110041548050.png)



## 2、工作窃取算法( work-stealing)
一个大任务拆分成多个小任务,为了减少线程间的竞争,把这些子任务分别放到不同的列中,并且每个队列都有单独的线程来执行队列里的任务,线程和队列—对应。但是会出现这样—种情况:A线程处理完了自己队列的任务,B线程的队列里还有很多任务要处理。

A是一个很热情的线程想过去帮忙,但是如果两个线程访问同一个队列,会产生竞争,所以A想了一个办法,从双端队列的尾部拿任务执行。而B线程永远是从双端队列的头部拿任务执行。

![image-20211004155713513](https://gitee.com/testlyx/cloudimage/raw/master/img/202110041557719.png)

注意:**线程池中的每个线程都有自己的工作队列**(PS,这一点和ThreadPoolExecutor不同, **ThreadPoolExecutor是所有线程公用一个工作队列,所有线程都从这个工作队列中取任务**),当自己队列中的任务都完成以后,会从其它线程的工作队列中偷一个任务执行,这样可以充分利用资源。

**工作窃取算法的优点:**

1. 利用了线程进行并行计算,减少了线程间的竞争

**工作窃取算法的缺点:**

1. 如果双端队列中只有一个任务时,线程间会存在竞争。
2. 窃取算法消耗了更多的系统资源,如会创建多个线程和多个双端队列。



## 3、主要类

1. **ForkJionTask**

   使用该框架,需要创建一个ForkJoin任务,它提供在任务中执行fork和join操作的机制。一般情况下,我们并不需要直接继承 ForkJointask类,只需要继承它的子类,

   它的子类有两个：

   * RecursiveAction: 用于没有返回结果的任务。
   * RecursiveTask: 用于有返回结果的任务

2. **ForkJoinPool**

   任务ForkJoinTask需要通过ForkJoinPool来执行

3. **ForkJoinWorkerThread**

   ForkJoinPool线程池中的一个执行任务的线程。



## 4、测试

> 案例：实现1~100_0000_0000的累加计算

**传统方法单线程实现**

```java
long n = 10_0000_0000L;
long sum = 0;
long start = System.currentTimeMillis();
for (long i = 0; i <= n; i++) {
    sum += i;
}
long end = System.currentTimeMillis();
// out: 累加结果：500000000500000000	累加时间：540
System.out.println("累加结果："+sum +"\t累加时间："+(end-start));
```

**使用多线程ForkJoin实现**

1. 创建ForkJoinTask的子类（由于本程序需要计算结果，使用RecursiveTask）

   ```java
   public class FJDemo extends RecursiveTask<Long> {
   }
   ```

2. 实现compute方法

   ```java
   package com.lyx.forkJoin;
   
   import java.util.concurrent.ExecutionException;
   import java.util.concurrent.ForkJoinPool;
   import java.util.concurrent.ForkJoinTask;
   import java.util.concurrent.RecursiveTask;
   
   /**
    * @author : lv
    * @description : ForkJoin案例
    * @program : juc-pro
    * @className : FJDemo
    * @date : 2021-10-04 17:15:34
    */
   public class FJDemo extends RecursiveTask<Long> {
       /**
        * 开始值
        */
       private Long start;
       /**
        * 结束值
        */
       private Long end;
       /**
        * 临界值，超过就分成若干个子任务
        */
       private final Long step = 10000L;
   
       public FJDemo(Long start, Long end) {
           this.start = start;
           this.end = end;
       }
   
       @Override
       protected Long compute() {
           Long sum = 0L;
           if (end - start < step){
               for (Long i = start; i <= end; i++) {
                   sum += i;
               }
           }else{
               //分解为两个任务
               Long mid = (start + end) / 2;
               FJDemo left = new FJDemo(start, mid);
               FJDemo right = new FJDemo(mid + 1, end);
               //fork
               left.fork();
               right.fork();
               //join
               Long leftSum = left.join();
               Long rightSum = right.join();
               sum = leftSum + rightSum;
           }
           return sum;
       }
   }
   
   ```

3. 调用forkjoin

   ```java
   //使用ForkJoin框架
   //1. 创建一个ForkJoinTask的线程池
   ForkJoinPool forkJoinPool = new ForkJoinPool();
   Long start = System.currentTimeMillis();
   //2. 创建一个任务
   FJDemo fjDemo = new FJDemo(1L, 10_0000_0000L);
   //3. 将任务交给线程池
   ForkJoinTask<Long> task = forkJoinPool.submit(fjDemo);
   //4. 得到计算结果
   Long sum = task.get();
   Long end = System.currentTimeMillis();
   //5. 关闭线程池
   forkJoinPool.shutdown();
   System.out.println("累加结果："+sum +"\t累加时间："+(end-start));
   ```

   



