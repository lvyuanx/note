JUC并发编程

## 1、什么是JUC

**JUC是java.util.concurrent的简写**。在jdk官方手册中可以看到juc相关的jar包有三个。

用中文概括一下，JUC的意思就是java并发编程工具包

![image-20210928195942396](https://gitee.com/testlyx/cloudimage/raw/master/img/202109281959549.png)

**实现多线程有三种方式：Thread、Runnable、Callable，其中Callable就位于concurrent包下** 



## 2、进程和线程的区别

**进程：**是并发执行的程序在执行过程中分配和管理资源的基本单位，是一个动态概念，竞争**计算机系统资源的基本单位**。

**线程：**是**进程的一个执行单元**，是进程内科调度实体。比进程更小的独立运行的基本单位。线程也被称为轻量级进程。



一个程序至少一个进程，一个进程至少一个线程。

**java程序最少有两个线程：**

1. 主线程Main

2. 垃圾回收线程GC

   

<font style="color:red">**Java真的可以开启线程吗？**</font>

java语言无法直接操控计算机硬件，只等调用底层c++代码开启线程。



## 3、并发和并行

**并行：**指两个或多个事件在**同一时刻点**发生；

* cpu单核，模拟出来多条线路，各线程间交替进行

**并发：**指两个或多个事件在**同一时间段**内发生。

* cpu多核，多个线程可以同时进行

```java
public class Test01 {
    public static void main(String[] args) {
        //查看cpu核心数
        System.out.println(Runtime.getRuntime().availableProcessors());
    }
}
```



## 4、线程的状态

```java
public enum State {
        /**
         * 新生
         */
        NEW,

        /**
         * 运行
         */
        RUNNABLE,

        /**
         * 阻塞
         */
        BLOCKED,

        /**
         * 等待
         */
        WAITING,

        /**
         * 超时等待
         */
        TIMED_WAITING,

        /**
         * 终止
         */
        TERMINATED;
    }
```



## 5、wait和sleep的区别

1. 来自不同的类
   1. wait => Object
   2. sleep => Thread
2. 是否释放锁
   1. wait会释放锁、
   2. sleep不会释放，相当于抱着锁睡觉
3. 使用的范围是不同的
   1. wait必须在同步代码块中
   2. sleep可以在任何地方
4. 是否需要捕获异常
   1. wait不需要不会异常
   2. 需要捕获异常



## 6、Synchronized (回顾)

多线程购票问题

```java
package com.lyx.demo01;

/**
 * @author : lv
 * @description : Synchronized解决多线程买票问题
 * @program : juc-pro
 * @className : SaleTicketDemo
 * @date : 2021-09-28 20:38:02
 */
public class SaleTicketDemo {
    public static void main(String[] args) {
        //并发：多线程操作统一资源，将资源丢入线程即可
        SaleTicket saleTicket = new SaleTicket();

        new Thread(()->{for (int i = 0; i < 100; i++) saleTicket.sale();}, "t1").start();
        new Thread(()->{for (int i = 0; i < 100; i++) saleTicket.sale();}, "t2").start();
        new Thread(()->{for (int i = 0; i < 100; i++) saleTicket.sale();}, "t3").start();

    }
}

/**
 * 资源类
 * 买票
 */
class SaleTicket{
    /**
     *  默认100张车票
     */
    private int ticket = 100;

    /**
     * 售票
     */
    public synchronized void sale(){
        // 票数大于0可购买到票
        if(ticket > 0){
            System.out.println(Thread.currentThread().getName()+"购买了第"+(ticket--)+"张票");
        }
    }
}
```



## 7、lock锁（重点）

> lock接口

![image-20210928205941360](https://gitee.com/testlyx/cloudimage/raw/master/img/202109282059516.png)

![image-20210928210108056](https://gitee.com/testlyx/cloudimage/raw/master/img/202109282101169.png)

lock锁解锁多线程售票问题

```java
package com.lyx.demo01;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author : lv
 * @description : lock解决多线程买票问题
 * @program : juc-pro
 * @className : SaleTicketDemo
 * @date : 2021-09-28 20:38:02
 */
public class SaleTicketDemo2 {
    public static void main(String[] args) {
        //并发：多线程操作统一资源，将资源丢入线程即可
        SaleTicket saleTicket = new SaleTicket();
        
        new Thread(()->{for (int i = 0; i < 100; i++) saleTicket.sale();}, "t1").start();
        new Thread(()->{for (int i = 0; i < 100; i++) saleTicket.sale();}, "t2").start();
        new Thread(()->{for (int i = 0; i < 100; i++) saleTicket.sale();}, "t3").start();

    }
}

/**
 * 资源类
 * 买票
 */
class SaleTicket2{
    /**
     *  默认100张车票
     */
    private int ticket = 100;

    /**
     * 锁
     * 默认是非公平锁，可根据cpu调度插队
     * 传入false为公平锁，先来后到，必须排队
     */
    private final Lock lock = new ReentrantLock();

    /**
     * 售票
     */
    public void sale(){
        //加锁
        lock.lock();
        // 票数大于0可购买到票
        try {
            if(ticket > 0){
                System.out.println(Thread.currentThread().getName()+"购买了第"+(ticket--)+"张票");
            }
        }finally {
            //解锁
            lock.unlock();
        }

    }
}
```



### 7.1 Synchrnoized 和 Lock的区别

1. Synchronized 是java内置关键字，Lock是一个类
2. Synchronized 无法判断锁的状态，Lock可以判断是否获取到了锁
3. Synchronized 会自动释放锁，lock必须手动释放锁，如果不释放会**死锁**
4. Synchronized 如果线程1（获得锁后阻塞），线程2会一直等待。lock锁就不一定会等待下去
5. Synchronized 可重入锁，不可中断，非公平。可重入锁，可中断，默认非公平（可以自己设置为公平）。
6. Synchronized 适合少量的代码同步问题，Lock适合锁大量的同步代码



## 8、生产者消费者问题

### 8.1 Synchrnoized锁实现

```java
package com.lyx.pc;

/**
 * @author : lv
 * @description : 生产者消费者问题
 * @program : juc-pro
 * @className : ProductAndConsumer
 * @date : 2021-09-28 21:33:06
 */
public class ProductAndConsumer {
    public static void main(String[] args)  {
        Factory f = new Factory();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.product();}, "生产者").start();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.consumer();}, "消费者").start();
    }

}

/**
 * 资源
 */
class Factory{

    /**
     * 库存
     */
    int number = 0;

    /**
     * +1操作
     */
    public synchronized void product() {
        //库存不为0，通知生产者停止生产
        if(number != 0){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        number ++;
        System.out.println(Thread.currentThread().getName()+"生产+1，库存为："+number);
        //唤醒所有等待的线程
        this.notifyAll();
    }

    /**
     * -1操作
     */
    public synchronized void consumer() {
        //库存为0，通知消费者停止消费
        if(number == 0){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        number --;
        System.out.println(Thread.currentThread().getName()+"生产-1，库存为："+number);
        //唤醒所有等待的线程
        this.notifyAll();
    }

}
```



### 8.2 代码中的bug

当有线程中有多个生产者和消费者会出现的bug



![image-20210928220344563](https://gitee.com/testlyx/cloudimage/raw/master/img/202109282203659.png)

**因为使用if只会判断异常在等待结束后不会继续判断，因此出现虚假唤醒，需要在使用wait的情况下使用while来判断，就会在唤醒后继续判断。**

将所有的if判断改为while判断

```java
package com.lyx.pc;

/**
 * @author : lv
 * @description : 生产者消费者问题
 * @program : juc-pro
 * @className : ProductAndConsumer
 * @date : 2021-09-28 21:33:06
 */
public class ProductAndConsumer {
    public static void main(String[] args)  {
        Factory f = new Factory();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.product();}, "生产者1").start();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.consumer();}, "消费者1").start();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.consumer();}, "消费者2").start();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.product();}, "生产者2").start();
    }

}

/**
 * 资源
 */
class Factory{

    /**
     * 库存
     */
    int number = 0;

    /**
     * +1操作
     */
    public synchronized void product() {
        //库存不为0，通知生产者停止生产
        while(number != 0){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        number ++;
        System.out.println(Thread.currentThread().getName()+"生产+1，库存为："+number);
        //唤醒所有等待的线程
        this.notifyAll();
    }

    /**
     * -1操作
     */
    public synchronized void consumer() {
        //库存为0，通知消费者停止消费
        while(number == 0){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        number --;
        System.out.println(Thread.currentThread().getName()+"生产-1，库存为："+number);
        //唤醒所有等待的线程
        this.notifyAll();
    }

}
```

![image-20210928230808577](https://gitee.com/testlyx/cloudimage/raw/master/img/202109282308662.png)



### 8.3 JUC实现

![image-20210929090645211](https://gitee.com/testlyx/cloudimage/raw/master/img/202109290906769.png)

![image-20210929090759196](https://gitee.com/testlyx/cloudimage/raw/master/img/202109290907466.png)

代码实现

```java
package com.lyx.pc;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author : lv
 * @description : 生产者消费者问题juc解决
 * @program : juc-pro
 * @className : ProductAndConsumer
 * @date : 2021-09-28 21:33:06
 */
public class ProductAndConsumerJUC {
    public static void main(String[] args)  {
        Factory2 f = new Factory2();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.product();}, "生产者1").start();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.consumer();}, "消费者1").start();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.consumer();}, "消费者2").start();
        new Thread(()->{for(int i = 0 ; i < 10; i ++) f.product();}, "生产者2").start();
    }

}

/**
 * 资源
 */
class Factory2{

    /**
     * 库存
     */
    int number = 0;

    /**
     * lock锁
     */
    private final Lock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();


    /**
     * +1操作
     */
    public void product() {
        lock.lock();
        try {
            //库存不为0，通知生产者停止生产
            while(number != 0){
                try {
                    condition.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            number ++;
            System.out.println(Thread.currentThread().getName()+"生产+1，库存为："+number);
            //唤醒所有等待的线程
            condition.signalAll();
        }finally {
            lock.unlock();
        }
    }

    /**
     * -1操作
     */
    public synchronized void consumer() {
        lock.lock();
        try {
            //库存为0，通知消费者停止消费
            while(number == 0){
                try {
                    condition.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            number --;
            System.out.println(Thread.currentThread().getName()+"生产-1，库存为："+number);
            //唤醒所有等待的线程
            condition.signalAll();
        }finally {
            lock.unlock();
        }

    }

}
```



### 8.4 Condition实现精准线程唤醒

```java
package com.lyx.pc;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author : lv
 * @description : Condition 实现精准唤醒
 * @program : juc-pro
 * @className : ConditionDemo
 * @date : 2021-09-29 09:14:27
 */
public class ConditionDemo {
    public static void main(String[] args) {
        Cdn c = new Cdn();
        new Thread(()->{for (int i = 0; i < 10; i ++) c.printA();}, "A").start();
        new Thread(()->{for (int i = 0; i < 10; i ++) c.printB();}, "B").start();
        new Thread(()->{for (int i = 0; i < 10; i ++) c.printC();}, "C").start();
    }
}

class Cdn{
    private final Lock lock = new ReentrantLock();
    private final Condition conditionA = lock.newCondition();
    private final Condition conditionB = lock.newCondition();
    private final Condition conditionC = lock.newCondition();
    private int flag = 1;

    public void printA(){
        lock.lock();
        try {
            if(flag != 1){
                conditionA.await();
            }
            flag = 2;
            System.out.println(Thread.currentThread().getName() +"--->"+ "AAA");
            //精准唤醒
            conditionB.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }

    public void printB(){
        lock.lock();
        try {
            if(flag != 2){
                conditionB.await();
            }
            flag = 3;
            System.out.println(Thread.currentThread().getName() +"--->"+ "BBB");
            //精准唤醒
            conditionC.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }

    public void printC(){
        lock.lock();
        try {
            if(flag != 3){
                conditionC.await();
            }
            flag = 1;
            System.out.println(Thread.currentThread().getName() +"--->"+ "CCC");
            //精准唤醒
            conditionA.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
}
```



## 9、八锁问题

```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test1 {
    public static void main(String[] args) {
        Phone1 phone = new Phone1();
        new Thread(phone::sendSms).start();
        try {
            //睡1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(phone::call).start();
    }
}

/**
 * 标准情况：
 *  1. 两个线程，是先打电话还是先发短信？
 *      由于主线程需要暂停1s才能启动电话线程，所以都是短信线程先拿到锁，所以短信先执行，
 *      短信执行完后解锁，电话线程才能执行。
 */
class Phone1{
    public synchronized void sendSms(){
        System.out.println("短信发送成功！");
    }

    public synchronized void call(){
        System.out.println("电话拨打成功！");
    }
}

```



```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test2 {
    public static void main(String[] args) {
        Phone2 phone = new Phone2();
        new Thread(phone::sendSms).start();
        try {
            //暂停1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(phone::call).start();
    }
}

/**
 *  1. 两个线程，短信线程内等待2秒，主线程等待1秒后执行电话线程，短信线程还是电话线程先输出？
 *      由于synchronized锁的都是同一个this，短信线程会比电话线程先拿到锁，所以短信线程先执行，
 *      短信线程执行后解锁，电话线程才会执行
 */
class Phone2{
    public synchronized void sendSms(){
        try {
            // 睡1秒钟
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("短信发送成功！");
    }

    public synchronized void call(){
        System.out.println("电话拨打成功！");
    }
}

```



```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test3 {
    public static void main(String[] args) {
        Phone3 phone = new Phone3();
        new Thread(phone::sendSms).start();
        try {
            //暂停1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(phone::call).start();
    }
}

/**
 *  1. 两个线程短，短信线程加锁，线程内暂停1s，电话线程没有加锁，但是主线程会暂停1s调用，短信和电话谁先输出？
 *      由于synchronized能锁住this，但是电话线程没有加锁，不受短信线程的锁的影响，
 *      由于短信线程需要等待2s，而电话线程只需要等待1s，所有电话线程先输出
 */
class Phone3{
    public synchronized void sendSms(){
        try {
            // 睡1秒钟
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("短信发送成功！");
    }

    public  void call(){
        System.out.println("电话拨打成功！");
    }
}

```



```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test4 {
    public static void main(String[] args) {
        Phone4 phone1 = new Phone4();
        Phone4 phone2 = new Phone4();
        new Thread(phone1::sendSms).start();
        try {
            //暂停1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(phone2::call).start();
    }
}

/**
 *  1. 两个方法都加锁，但是使用不同的对象调用两个方法，电话还是短信先输出？
 *      由于synchronized只能锁定this，而两个不同的对象分别为不同的this，所有锁互不干扰
 *      所有电话线程先输出
 */
class Phone4{
    public synchronized void sendSms(){
        try {
            // 睡1秒钟
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("短信发送成功！");
    }

    public synchronized   void call(){
        System.out.println("电话拨打成功！");
    }
}
```



```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test5 {
    public static void main(String[] args) {
        new Thread(Phone5::sendSms).start();
        try {
            //暂停1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(Phone5::call).start();
    }
}

/**
 *  1. 两个静态方法方法都加锁，电话还是短信先输出？
 *  由于是静态方法，synchronized锁的是Class模板，由于使用的都是Phone5.class
 *  短信线程会比电话线程先执行，所以短信线程先拿到锁，短信线程释放锁，电话线程才执行，所以电话先输出
 */
class Phone5{
    public static synchronized void sendSms(){
        try {
            // 睡1秒钟
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("短信发送成功！");
    }

    public static synchronized   void call(){
        System.out.println("电话拨打成功！");
    }
}
```



```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test6 {
    public static void main(String[] args) {
        Phone6 p1 = new Phone6();
        Phone6 p2 = new Phone6();
        new Thread(()->{p1.sendSms();}).start();
        try {
            //暂停1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(()->{p1.call();}).start();
    }
}

/**
 *  1. 两个静态方法方法都加锁.用两个实例去调用，电话还是短信先输出？
 *    由于静态方法锁的都是Class模板，短信线程会比电话线程先拿到锁
 *    所以短信线程先输出
 */
class Phone6{
    public static synchronized void sendSms(){
        try {
            // 睡1秒钟
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("短信发送成功！");
    }

    public static synchronized   void call(){
        System.out.println("电话拨打成功！");
    }
}
```



```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test7 {
    public static void main(String[] args) {
        Phone7 p1 = new Phone7();
        new Thread(Phone5::sendSms).start();
        try {
            //暂停1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(p1::call).start();
    }
}

/**
 *  1. 一个静态方法，一个普通方法都加锁，主线程会延迟1s调用静态方法，电话还是短信先输出？
 *  由于短信线程锁的是Class模板，而短信线程锁的是调用者，所以短信线程拿到锁后对电话线程无影响
 *  由于短信线程内需要延迟2s输出，所以电话线程先输出
 */
class Phone7{
    public static synchronized void sendSms(){
        try {
            // 睡1秒钟
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("短信发送成功！");
    }

    public synchronized   void call(){
        System.out.println("电话拨打成功！");
    }
}
```



```java
package com.lyx.lock8;

import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 8锁问题
 * @program : juc-pro
 * @className : Test1
 * @date : 2021-09-29 14:06:03
 */
public class Test8 {
    public static void main(String[] args) {
        Phone8 p1 = new Phone8();
        Phone8 p2 = new Phone8();
        new Thread(()->{p1.sendSms();}).start();
        try {
            //暂停1s
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(p2::call).start();
    }
}

/**
 *  1. 一个静态方法，一个普通方法都加锁,使用两个对象去调用，主线程会延迟1s调用静态方法，电话还是短信先输出？
 *  由于短信线程锁的是Class模板，而短信线程锁的是调用者，所以短信线程拿到锁后对电话线程无影响
 *  由于短信线程内需要延迟2s输出，所以电话线程先输出
 */
class Phone8{
    public static synchronized void sendSms(){
        try {
            // 睡1秒钟
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("短信发送成功！");
    }

    public synchronized   void call(){
        System.out.println("电话拨打成功！");
    }
}
```



## 10、集合类不安全

### 10.1 ArrayList

多线程下给ArrayList添加元素，有几率出现`ConcurrentModificationException`异常（并发修改异常）

```java
List<String> list = new ArrayList<>();
for (int i = 0; i < 10; i++) {
    new Thread(()->{
        list.add(UUID.randomUUID().toString().substring(0,5));
        System.out.println(list);
    }).start();
}
```

![image-20211001180820722](https://gitee.com/testlyx/cloudimage/raw/master/img/202110011808997.png)

**解决办法：**

1. 使用`Vector`添加元素，Vector中的add方法使用了synchronized修饰（效率低），多线程安全

   ![image-20211001181300020](https://gitee.com/testlyx/cloudimage/raw/master/img/202110011813139.png) 

   ```java
   List<String> list = new Vector<>();
   for (int i = 0; i < 10; i++) {
       new Thread(()->{
           list.add(UUID.randomUUID().toString().substring(0,5));
           System.out.println(list);
       }).start();
   }
   ```



2. 使用`Collections`类创建多线程安全的list

   ```java
    List<String> list = Collections.synchronizedList(new ArrayList<>());
   for (int i = 0; i < 10; i++) {
       new Thread(()->{
           list.add(UUID.randomUUID().toString().substring(0,5));
           System.out.println(list);
       }).start();
   }
   ```



3. 使用JUC下的`CoopyOnWriteArrayList`

   CopyOnWrite: 写入时先复制，写完再在插入。计算机程序设计领域的一种优化策略COW

   ```java
   List<String> list = new CopyOnWriteArrayList<>();
   for (int i = 0; i < 10; i++) {
       new Thread(()->{
           list.add(UUID.randomUUID().toString().substring(0,5));
           System.out.println(list);
       }).start();
   }
   ```

   

### 10.2 HashSet

多线程下给HashSet添加元素，有几率出现`ConcurrentModificationException`异常（并发修改异常）

```java
Set<String> set = new HashSet<>();
for (int i = 0; i < 35; i++) {
    new Thread(()->{
        set.add(UUID.randomUUID().toString().substring(0,5));
        System.out.println(set);
    }).start();
}
```

 ![image-20211001183603037](https://gitee.com/testlyx/cloudimage/raw/master/img/202110011836174.png)

**解决办法：**

1. 使用`Collections`类创建多线程安全的Set

   ```java
   Set<String> set = Collections.synchronizedSet(new HashSet<>());
   for (int i = 0; i < 35; i++) {
       new Thread(()->{
           set.add(UUID.randomUUID().toString().substring(0,5));
           System.out.println(set);
       }).start();
   }
   ```



2. 使用JUC下的`CoopyOnWriteHashSet`

   ```java
   Set<String> set = new CopyOnWriteArraySet<>();
   for (int i = 0; i < 35; i++) {
       new Thread(()->{
           set.add(UUID.randomUUID().toString().substring(0,5));
           System.out.println(set);
       }).start();
   }
   ```



### 10.2 HashMap

```java
Map<String, Object> map = new HashMap<>();
for (int i = 0; i < 35; i++) {
    new Thread(()->{
        map.put(UUID.randomUUID().toString().substring(0,5), UUID.randomUUID().toString().substring(0,5));
        System.out.println(map);
    }).start();
}
```

![image-20211001185127486](https://gitee.com/testlyx/cloudimage/raw/master/img/202110011851594.png)

**解决办法：**

1. 使用`Collections`类创建多线程安全的Map

   ```java
   Map<String, Object> map = Collections.synchronizedMap(new HashMap<>());
   for (int i = 0; i < 35; i++) {
       new Thread(()->{
           map.put(UUID.randomUUID().toString().substring(0,5), UUID.randomUUID().toString().substring(0,5));
           System.out.println(map);
       }).start();
   }
   ```



3. 使用JUC下的`ConcurrentHashMap`

   ```java
   Map<String, Object> map = new ConcurrentHashMap<>();
   for (int i = 0; i < 35; i++) {
       new Thread(()->{
           map.put(UUID.randomUUID().toString().substring(0,5), UUID.randomUUID().toString().substring(0,5));
           System.out.println(map);
       }).start();
   }
   ```



## 11、Callable

![image-20211001185753251](https://gitee.com/testlyx/cloudimage/raw/master/img/202110011857357.png)

1. 一有返回值
2. 可以抛出异常
3. 方法不同 run() / call()

**Callable启动：**

![image-20211001225633380](https://gitee.com/testlyx/cloudimage/raw/master/img/202110012256537.png) 

```java
package com.lyx.callable;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

/**
 * @author : lv
 * @description : Callable体验
 * @program : juc-pro
 * @className : CallableTest
 * @date : 2021-10-01 22:51:05
 */
public class CallableTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //适配类
        FutureTask<String> myThread = new FutureTask<>(new myThread());
        new Thread(myThread, "Callable Thread1").start();
        new Thread(myThread, "Callable Thread2").start();
        //get方法需要等待线程执行结果，可能会产生阻塞，可以放在程序最后一行，或者使用异步通信
        String s1 = myThread.get();
        //结果会被缓存
        String s2 = myThread.get();
        // out: Callable Thread1
        System.out.println(s2);
    }
}

class myThread implements Callable<String> {
    @Override
    public String call() throws Exception {
        return Thread.currentThread().getName();
    }
}
```



## 12、常用辅助类

### 12.1 CountDownLatch

>CountDownLatch是JDK提供的一个同步工具，它可以让一个或多个线程等待，一直等到其他线程中执行完成一组操作。

```java
package com.lyx.add;

import java.util.concurrent.CountDownLatch;

/**
 * @author : lv
 * @description : 计数器
 * @program : juc-pro
 * @className : CountDownLatchTest
 * @date : 2021-10-01 23:26:20
 */
public class CountDownLatchTest {
    public static void main(String[] args) throws InterruptedException {
        //计数器总数为6
        CountDownLatch count = new CountDownLatch(6);
        for (int i = 0; i < 6; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName());
                //计数器-1
                //调用countDown的线程可以继续执行，不需要等待计数器被减到0
                count.countDown();
            }).start();
        }
        //等待计数器归零向下执行
        //调用await方法的线程需要等待
        count.await();
        System.out.println("hello world");
    }
}
```



### 12.2 CyclicBarrier

```java
package com.lyx.add;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

/**
 * @author : lv
 * @description : 加法计数器
 * @program : juc-pro
 * @className : CyclicBarrierTest
 * @date : 2021-10-01 23:50:38
 */
public class CyclicBarrierTest {
    public static void main(String[] args) {
        //加法计数器
        CyclicBarrier cyclicBarrier = new CyclicBarrier(6, () -> {
            System.out.println("hello world");
        });

        for (int i = 0; i < 6; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"------start");
                try {
                    //计数器+1，等待计数器到达设的值后继续执行
                    cyclicBarrier.await();
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName()+"------end");
            }).start();
        }
    }
}
```



### 12.3 Semaphore

> 信号量

```java
package com.lyx.add;

import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 信号量
 * @program : juc-pro
 * @className : Semaphore
 * @date : 2021-10-02 00:11:04
 */
public class SemaphoreTest {
    public static void main(String[] args) {
        //保证最多只有3个线程
        Semaphore semaphore = new Semaphore(3);
        for (int i = 0; i < 6; i++) {
            new Thread(()->{
                try {
                    //得到
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName()+"------start");
                    TimeUnit.SECONDS.sleep(2);
                    System.out.println(Thread.currentThread().getName()+"------end");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    //释放
                    semaphore.release();
                }
            }).start();
        }

    }
}
```

acquire()：获得，加入线程已经满了，就等待线程其他线程被释放后唤醒。

release()：释放，会将当前信号量+1，然后唤醒等待的线程。



## 13、读写锁

**ReadWriteLock**

独占锁（写锁）：一次只能被一个线程占有

共享锁（读锁）：一次可以同时多个线程占有

![image-20211002132238836](https://gitee.com/testlyx/cloudimage/raw/master/img/202110021322018.png)

```java
package com.lyx.rc;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * @author : lv
 * @description : 读写锁
 * @program : juc-pro
 * @className : ReadWriteLockTest
 * @date : 2021-10-02 13:35:30
 */
public class ReadWriteLockTest {
    public static void main(String[] args) throws InterruptedException {
        MyCache cache = new MyCache();
        //计数器总数为6
        CountDownLatch count = new CountDownLatch(5);
        for (int i = 0; i < 5; i++) {
            final int temp = i;
            new Thread(()->{
                cache.put(temp+"", UUID.randomUUID().toString().substring(5));
                count.countDown();
            }).start();
        }
        //等待写入完成进入读取线程
        count.await();
        for (int i = 0; i < 5; i++) {
            final int temp = i;
            new Thread(()->{
                Object value = cache.get(temp + "");
            }).start();
        }
    }
}

class MyCache{
    /**
     * 模拟自定义缓存
     */
    private volatile Map<String, Object> cache = new ConcurrentHashMap<>();

    /**
     * 读写锁
     */
    private final ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    /**
     * 写入缓存
     * @param key 键
     * @param value 值
     */
    public void put(String key, Object value){
        readWriteLock.writeLock().lock();
        try {
            System.out.println(Thread.currentThread().getName() + "写入缓存中！");
            cache.put(key, value);
            System.out.println(Thread.currentThread().getName() + "写入缓存结束！");
        }finally {
            readWriteLock.writeLock().unlock();
        }

    }

    /**
     * 读取缓存
     * @param key 键
     * @return 值
     */
    public Object get(String key){
        readWriteLock.readLock().lock();
        try {
            System.out.println(Thread.currentThread().getName() + "读取缓存中！");
            Object value = cache.get(key);
            System.out.println(value);
            System.out.println(Thread.currentThread().getName() + "读取缓存结束！");
            return value;
        }finally {
            readWriteLock.readLock().unlock();
        }

    }
}
```

 

## 14、阻塞队列

![image-20211002140919858](https://gitee.com/testlyx/cloudimage/raw/master/img/202110021409041.png)

**四组API**

| 方式         | 抛出异常  | 有返回值不抛出异常 | 阻塞等待 | 超时等待                   |
| ------------ | --------- | ------------------ | -------- | -------------------------- |
| 添加         | add()     | offer()            | put()    | offer(e, timeout,unit)     |
| 移除         | remove()  | poll()             | take()   | poll(offer(timeout, unit)) |
| 检测队首元素 | element() | peek()             | -        | -                          |

```java
/**
 * 抛出异常
 */
public static void test1(){
    //队列的大小3
    ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);
    //add() 添加元素，返回值类型为boolean
    // out: ture
    System.out.println(blockingQueue.add("a"));
    // out: true
    System.out.println(blockingQueue.add("b"));
    // out: true
    System.out.println(blockingQueue.add("c"));

    //element(): 检测队首元素
    // out: a
    System.out.println(blockingQueue.element());

    //超出队列大小，抛出异常 java.lang.IllegalStateException: Queue full
    //System.out.println(blockingQueue.add("d"));
    
    System.out.println("****************");
    
    //remove() 返回值为移除的元素
    // out: a
    System.out.println(blockingQueue.remove());
    // out: b
    System.out.println(blockingQueue.remove());
    // out: c
    System.out.println(blockingQueue.remove());

    //队首没有元素，抛出异常java.util.NoSuchElementException
    //System.out.println(blockingQueue.element());

    //队列中没有值，抛出异常 java.util.NoSuchElementException
    //System.out.println(blockingQueue.remove());
}
```



```java
/**
 * 有返回值，不抛出异常
 */
public static void test2(){
    //队列大小为3
    ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);
    //offer() 返回值类型为boolean
    // out: true
    System.out.println(blockingQueue.offer("a"));
    // out: true
    System.out.println(blockingQueue.offer("b"));
    // out: true
    System.out.println(blockingQueue.offer("c"));
    // out: false
    System.out.println(blockingQueue.offer("d"));

    //peek() 检测检测队首元素
    // out: a
    System.out.println(blockingQueue.peek());

    System.out.println("****************");
    //remove() 返回值为移除的元素
    // out: a
    System.out.println(blockingQueue.poll());
    // out: b
    System.out.println(blockingQueue.poll());
    // out: c
    System.out.println(blockingQueue.poll());

    // out: null
    System.out.println(blockingQueue.peek());

    // out: null
    System.out.println(blockingQueue.poll());

}
```



```java
/**
 * 阻塞等待
 */
public static void test3() throws InterruptedException {
    //队列大小
    ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);
    //put() 向队列中添加元素，如果队列满了，就一直阻塞到队列有位置
    blockingQueue.put("a");
    blockingQueue.put("b");
    blockingQueue.put("c");
    // 阻塞
    //blockingQueue.put("d");

    // out: a
    System.out.println(blockingQueue.take());
    // out: b
    System.out.println(blockingQueue.take());
    // out: c
    System.out.println(blockingQueue.take());
    // 阻塞
    //System.out.println(blockingQueue.take());
}
```



```java
/**
 * 超时等待
 */
public static void test4() throws InterruptedException {
    ArrayBlockingQueue<Object> blockingQueue = new ArrayBlockingQueue<>(3);
    //offer(E e, long timeout, TimeUnit unit) 向对列中添加元素，如果队列满了就阻塞等待，超时就会返回false
    // out: true
    System.out.println(blockingQueue.offer("a", 2, TimeUnit.SECONDS));
    // out: true
    System.out.println(blockingQueue.offer("b", 2, TimeUnit.SECONDS));
    // out: true
    System.out.println(blockingQueue.offer("c", 2, TimeUnit.SECONDS));
    // out: false
    System.out.println(blockingQueue.offer("d", 2, TimeUnit.SECONDS));

    System.out.println("************");

    //offer(E e, long timeout, TimeUnit unit) 向对列中删除元素，如果队列满了就阻塞等待，超时就会返回null
    // out: a
    System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS));
    // out: b
    System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS));
    // out: c
    System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS));
    // out: null
    System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS));
}
```



### 14.1 同步队列

```java
/**
 * 同步队列
 *  队列没有容量
 *  进去一个元素后，进入阻塞状态，必须等待取出来才能继续
 */
public static void test1(){
    SynchronousQueue<String> synchronousQueue = new SynchronousQueue<>();
    new Thread(()->{
        try {
            System.out.println(Thread.currentThread().getName()+"put 1");
            synchronousQueue.put("1");
            System.out.println(Thread.currentThread().getName()+"put 2");
            synchronousQueue.put("2");
            System.out.println(Thread.currentThread().getName()+"put 3");
            synchronousQueue.put("3");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }).start();
    new Thread(()->{
        try {
            //等待2s，让上面线程先执行
            TimeUnit.SECONDS.sleep(2);
            System.out.println(Thread.currentThread().getName()+ "==>" + synchronousQueue.take());
            //等待2s，让上面线程先执行
            TimeUnit.SECONDS.sleep(2);
            System.out.println(Thread.currentThread().getName()+ "==>" + synchronousQueue.take());
            //等待2s，让上面线程先执行
            TimeUnit.SECONDS.sleep(2);
            System.out.println(Thread.currentThread().getName()+ "==>" + synchronousQueue.take());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }).start();
}
```



## 15、线程池（重点）

线程池：三大方法，七大参数，四种拒绝策略

### 15.1 池化技术

程序运行的本质：占用系统的资源！优化资源的使用 => 池化技术

池化技术：事先准备好一些要用的资源，有人要用，就来我这里拿，用完之后还给我。



**线程池的好处：**

1. 降低资源的消耗
2. 提高响应的速度
3. 方便管理

线程服用，可以控制最大并发数，管理线程



### 15.2 三大方法

**1. 单个线程的线程池**

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();
```

**2. 固定线程数量的线程池**

```java
ExecutorService executorService = Executors.newFixedThreadPool(5);
```

**3. 可伸缩线程池**

```java
ExecutorService executorService = Executors.newCachedThreadPool();
```

快速体验：

```java
package com.lyx.pool;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 线程池三大方法
 * @program : juc-pro
 * @className : Demo01
 * @date : 2021-10-02 22:30:30
 */
public class Demo01 {
    public static void main(String[] args) {

        //单个线程的线程池
        //ExecutorService executorService = Executors.newSingleThreadExecutor();
        //固定线程数量的线程池
        //ExecutorService executorService = Executors.newFixedThreadPool(5);
        //可伸缩线程池
        ExecutorService executorService = Executors.newCachedThreadPool();
        try {
            for (int i = 0; i < 10; i++) {
                executorService.execute(()->{
                    System.out.println(Thread.currentThread().getName());
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                });
            }
        }finally {
            //关闭线程池
            executorService.shutdown();
        }

    }
}
```



### 15.3 七大参数

三大方法源码分析

1. newSingleThreadExecutor

   ```java
   public static ExecutorService newSingleThreadExecutor() {
       return new FinalizableDelegatedExecutorService
           (new ThreadPoolExecutor(1, 1,
                                   0L, TimeUnit.MILLISECONDS,
                                   new LinkedBlockingQueue<Runnable>()));
   }
   ```

2. newFixedThreadPool

   ```java
   public static ExecutorService newFixedThreadPool(int nThreads) {
       return new ThreadPoolExecutor(nThreads, nThreads,
                                     0L, TimeUnit.MILLISECONDS,
                                     new LinkedBlockingQueue<Runnable>());
   }
   ```

3. newCachedThreadPool

   ```java
   public static ExecutorService newCachedThreadPool() {
       return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                     60L, TimeUnit.SECONDS,
                                     new SynchronousQueue<Runnable>());
   }
   ```

经过分析可以看到，三大方法都是使用ThreadPoolExecutor创建线程池的

```java
    public ThreadPoolExecutor(int corePoolSize, //核心线程池大小
                              int maximumPoolSize, //最大核心线程池大小
                              long keepAliveTime, //超时了没有人调用就会释放
                              TimeUnit unit, //超时单位
                              BlockingQueue<Runnable> workQueue, //阻塞队列
                              ThreadFactory threadFactory, //线程工厂，创建线程的，一般不用动
                              RejectedExecutionHandler handler //拒绝策略
                             ) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.acc = System.getSecurityManager() == null ?
                null :
                AccessController.getContext();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```

根据阿里巴巴开发手册

![image-20211002232412959](https://gitee.com/testlyx/cloudimage/raw/master/img/202110022324167.png)

ThreadPoolExecutor创建线程的原理图

![image-20211002233034550](https://gitee.com/testlyx/cloudimage/raw/master/img/202110022330729.png)



### 15.4 自定义线程池

```java
package com.lyx.pool;


import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 自定义线程池
 * @program : juc-pro
 * @className : MyThreadPool
 * @date : 2021-10-02 23:36:31
 */
public class MyThreadPool {
    /**
     * 拒绝策略:
     *      AbortPolicy() 直接抛出异常java.util.concurrent.RejectedExecutionException
     *      CallerRunsPolicy() 从哪个线程来的就由哪个线程执行
     *      DiscardOldestPolicy() 尝试和最早的竞争，竞争失败不会抛出异常
     *      DiscardPolicy() 队列满了直接丢掉认为，不会抛出异常
     */
    private static final ThreadPoolExecutor pool = new ThreadPoolExecutor(
            //核心线程数
            3,
            //最大线程数
            5,
            //超时时间
            3,
            //超时单位
            TimeUnit.SECONDS,
            //线程队列
            new LinkedBlockingQueue<>(3),
            //线程工厂
            Executors.defaultThreadFactory(),
            //拒绝策略
            new ThreadPoolExecutor.DiscardPolicy()
    );


    public static void main(String[] args) {
       try {
           //正在运行的线程数 <= 核心线程数 + 等待队列中的线程数， 线程池中只有三个线程
           //核心线程数 + 等待队列中的线程数 < 正在运行的线程数 <= 最大核心线程数 + 等待队列中的线程数， 线程池中有正在运行的线程数
           //正在运行的线程数 > 最大核心线程数 + 等待队列中的线程数, 就会触发拒绝策略
           for (int i = 0; i < 9; i++) {
               pool.execute(()->{
                   System.out.println(Thread.currentThread().getName());
//                   try {
//                       TimeUnit.SECONDS.sleep(1);
//                       System.out.println(Thread.currentThread().getName());
//                   } catch (InterruptedException e) {
//                       e.printStackTrace();
//                   }
               });
           }
       }finally {
           //关闭线程池
          pool.shutdown();
       }
    }
}
```



### 15.5 CPU密集型和IO密集型（拓展）

线程池最大核心线程数如何去设置？

1. CPU密集型：根据cpu的核心数去设置线程池最大核心线程数

   ```java
   private static final ThreadPoolExecutor pool = new ThreadPoolExecutor(
       //核心线程数
       3,
       //最大线程数
       //cpu核心数
       Runtime.getRuntime().availableProcessors(),
       //超时时间
       3,
       //超时单位
       TimeUnit.SECONDS,
       //线程队列
       new LinkedBlockingQueue<>(3),
       //线程工厂
       Executors.defaultThreadFactory(),
       //拒绝策略
       new ThreadPoolExecutor.DiscardPolicy()
   );
   ```

2. IO密集型：根据程序中十分耗资源IO的线程，最大核心数大于io线程数



## 16、四大函数式接口（必须掌握）

> 新时代的程序员：Lambda表达式、链式编程、函数式接口、Stream流式计算



### 16.1 函数式接口

> 只有一个方法 的接口

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}

//使用FunctionalInterface注解
//简化编程模型，在新版本框架中有大量应用
```

![image-20211003140947005](https://gitee.com/testlyx/cloudimage/raw/master/img/202110031409362.png)

#### 16.1.1 函数型接口 Function

![image-20211003141502515](https://gitee.com/testlyx/cloudimage/raw/master/img/202110031415651.png)

```java
//        Function function = new Function<String, Object>() {
//            @Override
//            public Object apply(String s) {
//                return s;
//            }
//        };
        //使用Lambda表达式简化
        Function<String, Object> function = (str)->{return str;};
        System.out.println(function.apply("hello"));
```



#### 16.1.2 断定型接口 Predicate

```java
//        Predicate<String> predicate = new Predicate<String>() {
//            @Override
//            public boolean test(String str) {
//                return str.isEmpty();
//            }
//        };
        //lambda表达式简化
        Predicate<String> predicate = (str)->{return str.isEmpty();};
        System.out.println(predicate.test(""));
```



#### 16.1.3 消费型接口 Consumer

```java
//        Consumer<String> consumer = new Consumer<String>() {
//            @Override
//            public void accept(String s) {
//                System.out.println("consumer:"+s);
//            }
//        };
		// 使用Lambda表达式简化
        Consumer<String> consumer = (s)->{System.out.println("consumer:"+s);};
        consumer.accept("hello");
```



#### 16.1.4 供给型接口 Supplier

```java
//        Supplier<Integer> supplier = new Supplier<Integer>() {
//            @Override
//            public Integer get() {
//                System.out.println("get()");
//                return 123;
//            }
//        };
        Supplier<Integer> supplier = ()->{return 123;};
        System.out.println(supplier.get());
```



## 17、Stream流式计算

```java
package com.lyx.stream;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import sun.applet.Main;

import java.util.Arrays;
import java.util.List;

/**
 * @author : lv
 * @description : 测试Stream流式计算
 * @program : juc-pro
 * @className : Demo01
 * @date : 2021-10-03 19:09:36
 */
public class Demo01 {
    public static void main(String[] args) {
        List<User> users = Arrays.asList(
                new User(1L, "a", 18),
                new User(2L, "b", 19),
                new User(3L, "c", 20),
                new User(4L, "d", 21),
                new User(5L, "e", 22),
                new User(6L, "e", 23)
        );
        /*
        题目要求：一分钟内完成此题，只能用一行代码实现！
            现在又5个用户，进行筛选：
                1. ID必须为偶数
                2. 年龄必须大于20岁
                3. 用户名转为大写字母
                4. 用户名字符倒着排序
                5. 只输出一个用户
         */
        //链式编程
        users.stream()
                .filter(user-> user.getId() % 2 == 0)
                .filter(user -> user.getAge() > 20)
                .map(user -> user.getName().toUpperCase())
                .sorted((u1,u2) -> {return u2.compareTo(u1);})
                .limit(1)
                .forEach(System.out::println);
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class User{
    private Long id;
    private String name;
    private Integer age;
}
```



## 18、 ForkJoin

### 18.1ForkJion 简介

![image-20211004154815748](https://gitee.com/testlyx/cloudimage/raw/master/img/202110042046666.png)



### 18.2 工作窃取算法( work-stealing)

一个大任务拆分成多个小任务,为了减少线程间的竞争,把这些子任务分别放到不同的列中,并且每个队列都有单独的线程来执行队列里的任务,线程和队列—对应。但是会出现这样—种情况:A线程处理完了自己队列的任务,B线程的队列里还有很多任务要处理。

A是一个很热情的线程想过去帮忙,但是如果两个线程访问同一个队列,会产生竞争,所以A想了一个办法,从双端队列的尾部拿任务执行。而B线程永远是从双端队列的头部拿任务执行。

![image-20211004155713513](https://gitee.com/testlyx/cloudimage/raw/master/img/202110042046608.png)

注意:**线程池中的每个线程都有自己的工作队列**(PS,这一点和ThreadPoolExecutor不同, **ThreadPoolExecutor是所有线程公用一个工作队列,所有线程都从这个工作队列中取任务**),当自己队列中的任务都完成以后,会从其它线程的工作队列中偷一个任务执行,这样可以充分利用资源。

**工作窃取算法的优点:**

1. 利用了线程进行并行计算,减少了线程间的竞争

**工作窃取算法的缺点:**

1. 如果双端队列中只有一个任务时,线程间会存在竞争。
2. 窃取算法消耗了更多的系统资源,如会创建多个线程和多个双端队列。



### 18.3 主要类

1. **ForkJionTask**

   使用该框架,需要创建一个ForkJoin任务,它提供在任务中执行fork和join操作的机制。一般情况下,我们并不需要直接继承 ForkJointask类,只需要继承它的子类,

   它的子类有两个：

   * RecursiveAction: 用于没有返回结果的任务。
   * RecursiveTask: 用于有返回结果的任务

2. **ForkJoinPool**

   任务ForkJoinTask需要通过ForkJoinPool来执行

3. **ForkJoinWorkerThread**

   ForkJoinPool线程池中的一个执行任务的线程。



### 18.4 测试

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



## 19、异步回调

没有返回值的异步回调

```java
package com.lyx.future;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * @author : lv
 * @description : 没有返回值的异步执行
 * @program : juc-pro
 * @className : RunAsyncDemo
 * @date : 2021-10-04 21:11:36
 */
public class RunAsyncDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(()->{
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+"runAsync Void");
        });
        //获取阻塞执行结果
        completableFuture.get();
    }
}
```

有返回值的异步回调

```java
package com.lyx.future;

import com.sun.org.apache.xalan.internal.xsltc.compiler.util.ErrorMsg;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

/**
 * @author : lv
 * @description : 有返回值的异步执行
 * @program : juc-pro
 * @className : SupplyAsyncDemo
 * @date : 2021-10-04 21:16:04
 */
public class SupplyAsyncDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<Integer> integerCompletableFuture = CompletableFuture.supplyAsync(() -> {
            //模拟异常
            int i = 1/0;
            return 200;
        });
        Integer i = integerCompletableFuture.whenComplete((t, u) -> {
            System.out.println("result: " + t);
            System.out.println("errorMsg: " + u);
        }).exceptionally((e) -> {
            e.printStackTrace();
            return 500;
        }).get();

        System.out.println(i);
    }
}
```



## 20、JMM

### 20.1 Volatile简述

Volatile是java虚拟机提供的**轻量级同步机制**

1. 保证可见性
2. 不保证原子性
3. 禁止指令重排



### 20.2 什么是JMM

JMM: java内存模型，是不存在的，是概念约定。



#### 20.2.1 关于JMM的一些同步的约定：

1. 线程解锁前，必须把共享变量**立刻**刷回主存
2. 线程加锁前，必须读取主存中的最新值到工作内存中
3. 加锁和解锁是同一把锁



#### 20.2.2 8种操作

![image-20211006142818219](https://gitee.com/testlyx/cloudimage/raw/master/img/202110061428461.png)



![image-20211006143118357](https://gitee.com/testlyx/cloudimage/raw/master/img/202110061431521.png)

**内存模型-同步八种操作:**

1. lock（锁定）：    把主内存变量标识为一条线程独占，此时不允许其他线程对此变量进行读写。
2. unlock（解锁）：解锁一个主内存变量。
3. read（读取）：   把一个主内存变量值读入到线程的工作内存，强调的是读入这个过程。
4. load（载入）：   把read到变量值保存到线程工作内存中作为变量副本，强调的是读入的值的保存过程。
5. use（使用）：    线程执行期间，把工作内存中的变量值传给字节码执行引擎。
6. assign（赋值）：字节码执行引擎把运算结果传回工作内存，赋值给工作内存中的结果变量。
7. store（存储）： 把工作内存中的变量值传送到主内存，强调传送的过程。
8. write（写入）： 把store传送进来的变量值写入主内存的变量中，强调保存的过程。

**同步规则分析：**

* 不允许read和load、store和write操作之一单独出现。即使用了read必须load,使用了store必须write
* 不允许线程丢弃他最近的assign操作，即工作变量的数据改变了之后，必须告知主存
* 不允许一个线程将没有assign的数据从工作内存同步回主内存
* 一个新的变量必须在主内存中诞生，不允许工作内存直接使用一个未被初始化的变量。就是对变量实施use、store操作之
  前，必须经过assign和load操作
* 一个变量同一时间只有一个线程能对其进行lock。多次lock后，必须执行相同次数的unlock才能解锁
* 如果对一个变量进行lock操作，会清空所有工作内存中此变量的值，在执行引擎使用这个变量前，必须重新load或assign
  操作初始化变量的值
* 如果一个变量没有被lock,就不能对其进行unlock操作。也不能unlock一个被其他线程锁住的变量
* 对 

问题：程序不知道主内存中的值被修改过了

![image-20211006150026655](https://gitee.com/testlyx/cloudimage/raw/master/img/202110061500854.png)



### 20.3 Volatile

1. **可见性**

   ```java
   package com.lyx.volatile1;
   
   import java.util.concurrent.TimeUnit;
   
   /**
    * @author : lv
    * @description : Volatile可见性
    * @program : juc-pro
    * @className : Demo01
    * @date : 2021-10-06 15:10:29
    */
   public class Demo01 {
       // 不加volatile线程会一直执行下去
       private volatile static boolean flag = true;
       public static void main(String[] args) throws InterruptedException {
           new Thread(()->{
               while (flag){
               }
           }).start();
           TimeUnit.SECONDS.sleep(1);
           flag = false;
       }
   }
   ```

2. **不保证原子性**

   ```java
   package com.lyx.volatile1;
   
   /**
    * @author : lv
    * @description : Volatile不保证原子性
    * @program : juc-pro
    * @className : Demo02
    * @date : 2021-10-06 15:22:17
    */
   public class Demo02 {
       private static int sum;
   
       public static void add(){
           sum ++;
       }
       public static void main(String[] args) {
           for (int i = 0; i < 100; i++) {
               new Thread(()->{
                   for (int j = 0; j < 10000; j++) {
                       add();
                   }
               }).start();
           }
   
           while (Thread.activeCount() > 2){
               Thread.yield();
           }
           //理论值为：1000000
           //实际输出很少出现 1000000 大概在984184左右
           System.out.println("sum: "+sum);
       }
   }
   ```



**如何不使用Lock和Synchronized来保证原子性？**

![image-20211006154603700](https://gitee.com/testlyx/cloudimage/raw/master/img/202110061546874.png)

由字节码文件可知，sum++并不是一个原子性的操作，其中包含很多步骤。

**使用原子类来实现原子性**

![image-20211006154845661](https://gitee.com/testlyx/cloudimage/raw/master/img/202110061548833.png) 

```java
package com.lyx.volatile1;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author : lv
 * @description : Volatile不保证原子性，解决办法
 * @program : juc-pro
 * @className : Demo02
 * @date : 2021-10-06 15:22:17
 */
public class Demo02 {
//    private static int sum;
    private volatile static AtomicInteger sum = new AtomicInteger();

    public static void add(){
        //AtomicInteger的加一方法，底层使用的是CAS，执行效率极高
        sum.getAndIncrement();
    }
    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            new Thread(()->{
                for (int j = 0; j < 10000; j++) {
                    add();
                }
            }).start();
        }

        while (Thread.activeCount() > 2){
            Thread.yield();
        }
        //理论值为：1000000
        //实际输出很少出现 1000000 大概在984184左右
        System.out.println("sum: "+sum);
    }
}
```



3. **禁止指令重排**

   什么是指令重排？

   **你写的程序，计算机并不是按照你写的那样去执行**

   源代码 => 编码器优化的重排 => 指令并行的重排 => 内存系统也会重排 => 执行

   ___处理器在指令重排的时候会考虑数据间的依赖性！___

   单线程下指令重排：

   ```java
   int a = 1;
   int b = 2;
   a = a + 1;
   b = b * a;
   
   //我们期望执行的顺序是：1->2->3->4
   //但是实际执行的可以是：1->3->2->4	2->1->3->4 等
   //但是绝对不可能是：1->4->2->3 等
   ```

   多线程情况下指令重排：(a,b,x,y默认值为0)

   | 线程a | 线程b |
   | ----- | ----- |
   | x=a   | y=b   |
   | b=1   | a=2   |

   由于指令重排可能出现：

   | 线程a | 线程b |
   | ----- | ----- |
   | b=1   | a=2   |
   | x=a   | y=b   |

   导致出现结果：x=2，y=1

   **volatile可以避免指令重排：**

   使用了内存屏障（cpu指令），作用：

   1. 保证特定的操作的执行顺序

   2. 可以保证某些变量的内存可见性（利用这些特性volatile实现了可见性）

      ![image-20211006191801905](https://gitee.com/testlyx/cloudimage/raw/master/img/202110061918233.png) 		



## 21、单例模式

### 21.1 饿汉式单利模式

```java
package com.lyx.single;

/**
 * @author : lv
 * @description : 饿汉式单利模式
 * @program : juc-pro
 * @className : HungryMan
 * @date : 2021-10-06 19:40:07
 */
public class HungryMan {
    private HungryMan(){
        System.out.println("hello");
    }

    /**
     * 在初始化时就会占用这些空间，会造成空间浪费
     */
    private int[] data1 = new int[1024];
    private int[] data2 = new int[1024];
    private int[] data3 = new int[1024];

    private final static HungryMan HUNGRY_MAN = new HungryMan();

    public static HungryMan getInstance(){
        return HUNGRY_MAN;
    }

    public static void main(String[] args) {
        HungryMan h1 = HungryMan.getInstance();
        HungryMan h2 = HungryMan.getInstance();
        // out: com.lyx.single.HungryMan@1540e19d
        System.out.println(h1);
        // out: com.lyx.single.HungryMan@1540e19d
        System.out.println(h2);
    }
}
```



### 21.2 懒汉式单例模式

```java
package com.lyx.single;

import sun.applet.Main;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

/**
 * @author : lv
 * @description : 懒汉式单例模式
 * @program : juc-pro
 * @className : LazyMan
 * @date : 2021-10-06 22:26:34
 */
public class LazyMan {

    private static volatile LazyMan lazyMan;
    private static boolean flage = false;

    private LazyMan (){
        synchronized (LazyMan.class){
            if(!flage){
                flage = true;
            }else{
                throw new RuntimeException("不要视图使用反射破坏单例");
            }
        }

    }

    /**
     * 双重检测所模式的懒汉模式（DCL懒汉式单例模式）
     */
    public static LazyMan getInstance(){
        if(lazyMan == null){
            synchronized (LazyMan.class){
                if(lazyMan == null){
                    /*
                        不是一个原子性操作
                        涉及的步骤有：
                            1、分配内存空间
                            2、执行构造方法，初始化对象
                            3、把这个对象指向这个空间
                        所以可能发生指令重排，需要在lazyMan加锁volatile,以保证不会指令重排
                     */
                    lazyMan = new LazyMan();
                }
            }
        }
        return lazyMan;
    }

    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
//        LazyMan lazyMan1 = LazyMan.getInstance();
        Constructor<LazyMan> declaredConstructor = LazyMan.class.getDeclaredConstructor(null);
        declaredConstructor.setAccessible(true);
        LazyMan lazyMan2 = declaredConstructor.newInstance();
        LazyMan lazyMan1 = declaredConstructor.newInstance();
        System.out.println(lazyMan1);
        System.out.println(lazyMan2);
    }

}
```



### 21.3 静态内部类单例模式

```java
package com.lyx.single;

/**
 * @author : lv
 * @description : 静态内不类实现单例模式
 * @program : juc-pro
 * @className : Holder
 * @date : 2021-10-06 22:42:06
 */
public class Holder {
    private Holder(){}

    private static Holder getInstance(){
        return InnerClass.holder;
    }
    public static class InnerClass{
        private static final Holder holder = new Holder();
    }
}
```



### 21.4 枚举类型单例模式

```java
package com.lyx.single;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

/**
 * @author : lv
 * @description : 枚举单例
 * @program : juc-pro
 * @className : EnumSingle
 * @date : 2021-10-06 23:02:32
 */
public enum EnumSingle {
    INSTANCE;
    public EnumSingle getInstance(){
        return INSTANCE;
    }
}

class Test{
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        EnumSingle enumSingle = EnumSingle.INSTANCE;
        Constructor<EnumSingle> declaredConstructor = EnumSingle.class.getDeclaredConstructor(String.class, int.class);
        declaredConstructor.setAccessible(true);
        EnumSingle enumSingle1 = declaredConstructor.newInstance();
        System.out.println(enumSingle1);
        System.out.println(enumSingle);
    }
}
```

​	