# JUC并发编程

## 1、 集合类不安全

### 1.1 面试总结

> 面试小知识：
>
> 1. new ArrayList(); 实际上是new了一个**长度为10类型为Object的数组**
> 2. **数组扩容为原来一半的长度**（向下取整）
> 3. 数组扩容使用的是**Arrays.copyOf()** 方法，将旧的数组复制到新的数组上
> 4. **ArrayList线程不安全**
> 5. HashSet 底层是new了一个HashMap<>(), 其中Key为添加的元素，保证了元素的唯一性，value是一个Object类型的常量



### 1.2 集合类线程不安全

> 异常类型：java.util.ConcurrentModificationException （并发修改异常）

**示例：**

```java
package com.lyx.集合类不安全;

import java.util.ArrayList;

/**
 * <p>
 * 集合类线程不安全示例
 * </p>
 *
 * @author lvyx
 * @since 2022-06-22 15:28:52
 */
public class NotSafeDemo01 {
    public static void main(String[] args) {
        List<String> numbers = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            int finalI = i;
            new Thread(() -> {
                numbers.add(String.valueOf(finalI));
                System.out.println(numbers);
            }, String.valueOf(i)).start();
        }
    }
}
```

![image-20220622160556748](JUC笔记.assets/image-20220622160556748.png)



### 1.3 解决方法

#### 1. 使用Vector(不推荐)

```java
package com.lyx.集合类不安全;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * <p>
 * 集合类线程不安全示例
 * 解决方法：
 * 1.
 * </p>
 *
 * @author lvyx
 * @since 2022-06-22 15:28:52
 */
public class NotSafeDemo01 {
    public static void main(String[] args) {
        List<String> numbers = new Vector<>();
        for (int i = 0; i < 30; i++) {
            int finalI = i;
            new Thread(() -> {
                numbers.add(String.valueOf(finalI));
                System.out.println(numbers);
            }, String.valueOf(i)).start();
        }
    }
}
```

![image-20220622160728038](JUC笔记.assets/image-20220622160728038.png)



解决原理：

> 底层使用了synchronized加锁，保证了线程的安全

![image-20220622160917494](JUC笔记.assets/image-20220622160917494.png)



#### 2. 使用Collections.synchronizedList() (不推荐)

```java
package com.lyx.集合类不安全;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Vector;

/**
 * <p>
 * 集合类线程不安全示例
 * </p>
 *
 * @author lvyx
 * @since 2022-06-22 15:28:52
 */
public class NotSafeDemo01 {
    public static void main(String[] args) {
        List<String> numbers = Collections.synchronizedList(new ArrayList<>());
        for (int i = 0; i < 30; i++) {
            int finalI = i;
            new Thread(() -> {
                numbers.add(String.valueOf(finalI));
                System.out.println(numbers);
            }, String.valueOf(i)).start();
        }
    }
}
```

![image-20220622161549092](JUC笔记.assets/image-20220622161549092.png)



#### 3. 使用CopyOnWriteArrayList() (推荐)

> **写时复制技术**
>
> CopyOnwrite容器即写时复制的容器。往一个容器添加元素的时候，不直接往当前容器object[]添加，而是先将当前容器object[]进行Copy,复制出一个新的容器object[] newELements,然后新的容器object[] newELements里添加元素，添加完元素之后，再将原容器的引用指向新的容器setArray(newELements)j。这样做的好处是可以对CopyOnwrite容器进行并发的读，而不需要加锁，因为当前容器不会添加任何元素。**所以CopyOnwrite容器也是一种读写分离的思想，读和写不同的容器**

![image-20220622162153821](JUC笔记.assets/image-20220622162153821.png)

```java
package com.lyx.集合类不安全;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Vector;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * <p>
 * 集合类线程不安全示例
 * </p>
 *
 * @author lvyx
 * @since 2022-06-22 15:28:52
 */
public class NotSafeDemo01 {
    public static void main(String[] args) {
        List<String> numbers = new CopyOnWriteArrayList<>();
        for (int i = 0; i < 30; i++) {
            int finalI = i;
            new Thread(() -> {
                numbers.add(String.valueOf(finalI));
                System.out.println(numbers);
            }, String.valueOf(i)).start();
        }
    }
}

```

![image-20220622161909633](JUC笔记.assets/image-20220622161909633.png)



解决原理：底层使用lock锁

![image-20220622163450215](JUC笔记.assets/image-20220622163450215.png)





## 2、八锁问题

### 2.1 锁1

>**同一个对象，同一时刻，只允许有一个线程访问同步方法**
>
>解释：只要一个线程访问了一个资源类里面的任何一个同步方法，那么它会将整个资源类所在的对象锁住。所以，当短信线程得到资源时，电话线程会等待短信线程释放资源，才会继续向下运行。

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *   * 短信加锁
 *   * 邮件加锁
 * 普通调用资源类
 *
 * ** 同一个对象，同一时刻，只允许有一个线程访问同步方法
 *
 * 解释：只要一个线程访问了一个资源类里面的任何一个同步方法，那么它会将
 * 整个资源类所在的对象锁住。所以，当短信线程得到资源时，电话线程会等待
 * 短信线程释放资源，才会继续向下运行。
 *
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 14:05:37
 */
public class Demo01 {

    public static void main(String[] args) {
        Phone phone = new Phone();

        new Thread(() -> {
            phone.sendSMS();
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone.sendEmail();
        }).start();
    }
}

class Phone{
    public synchronized void sendSMS(){
        System.out.println("发送短信");
    }

    public synchronized void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



### 2.2 锁2

>解释：只要一个线程访问了一个资源类里面的任何一个同步方法，那么它会将整个资源类所在的对象锁住。所以，当短信线程得到资源时，电话线程会等待短信线程释放资源，才会继续向下运行。

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *     * 短信加锁
 *     * 邮件加锁
 *  发短信内部暂停4秒
 *
 *  解释：只要一个线程访问了一个资源类里面的任何一个同步方法，那么它会将
 *  整个资源类所在的对象锁住。所以，当短信线程得到资源时，电话线程会等待
 *  短信线程释放资源，才会继续向下运行。
 *
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 14:05:37
 */
public class Demo02 {

    public static void main(String[] args) {
        Phone2 phone = new Phone2();

        new Thread(() -> {
            try {
                phone.sendSMS();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone.sendEmail();
        }).start();
    }
}

class Phone2{
    public synchronized void sendSMS() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("发送短信");
    }

    public synchronized void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



### 2.3 锁3

>解释： 同步代码方法，无法锁住普通方法

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *  * 短信加锁
 *  * 邮件不加锁
 *  短信内部暂停4秒
 * </p>
 *
 * 解释： 同步代码方法，无法锁住普通方法
 *
 * @author lvyx
 * @since 2022-06-23 14:05:37
 */
public class Demo03 {

    public static void main(String[] args) {
        Phone3 phone = new Phone3();

        new Thread(() -> {
            try {
                phone.sendSMS();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone.sendEmail();
        }).start();
    }
}

class Phone3{
    public synchronized void sendSMS() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("发送短信");
    }

    public void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



### 2.4 锁4

> 解释：两台手机分别是不同的对象，所以都只能锁住所在对象的同步方法。

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *  * 短信加锁
 *  * 邮件加锁
 *  短信内部暂停4秒，使用两台手机分别调用短信和邮件
 *
 *  解释：两台手机分别是不同的对象，所以都只能锁住所在对象的同步方法。
 *
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 14:05:37
 */
public class Demo04 {

    public static void main(String[] args) {
        Phone4 phone1 = new Phone4();
        Phone4 phone2 = new Phone4();

        new Thread(() -> {
            try {
                phone1.sendSMS();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone2.sendEmail();
        }).start();
    }
}

class Phone4{
    public synchronized void sendSMS() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("发送短信");
    }

    public synchronized void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



### 2.5 锁5

>解释： 由于是静态方法，所以锁的是Class类类型，所以，不管是不是同一个对象，他们都是同一个字节码文件。静态同步方法相当于是全局锁。

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *  * 短信加锁，静态方法
 *  * 邮件加锁，静态方法
 *  短信内部暂停4秒, 两台手机分别调用短信和邮件方法
 *
 *  解释： 由于是静态方法，所以锁的是Class类类型，所以，
 *  不管是不是同一个对象，他们都是同一个字节码文件。静态同步
 *  方法相当于是全局锁。
 *
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 15:05:37
 */
public class Demo05 {

    public static void main(String[] args) {
        Phone5 phone1 = new Phone5();
        Phone5 phone2 = new Phone5();

        new Thread(() -> {
            try {
                phone1.sendSMS();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone2.sendEmail();
        }).start();
    }
}

class Phone5{
    public static synchronized void sendSMS() throws InterruptedException {
        TimeUnit.SECONDS.sleep(4);
        System.out.println("发送短信");
    }

    public static synchronized void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



### 2.6 锁6

>解释： 由于是静态方法，所以锁的是Class类类型，所以，不管是不是同一个对象，他们都是同一个字节码文件。静态同步方法相当于是全局锁。

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *  * 短信加锁，静态方法
 *  * 邮件加锁，静态方法
 *  短信内部暂停4秒, 一台手机
 * </p>
 *
 *  解释： 由于是静态方法，所以锁的是Class类类型，所以，
 *  不管是不是同一个对象，他们都是同一个字节码文件。静态同步
 *  方法相当于是全局锁。
 *
 * @author lvyx
 * @since 2022-06-23 15:05:37
 */
public class Demo06 {

    public static void main(String[] args) {
        Phone6 phone = new Phone6();

        new Thread(() -> {
            try {
                phone.sendSMS();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone.sendEmail();
        }).start();
    }
}

class Phone6{
    public static synchronized void sendSMS() throws InterruptedException {
        TimeUnit.SECONDS.sleep(6);
        System.out.println("发送短信");
    }

    public static synchronized void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



### 2.7 锁7

>解释：短信锁的是Class对象，而邮件锁的是this对象，两个锁的对象不一样。所以，两把锁不会互相干扰

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *  * 短信加锁，静态方法
 *  * 邮件加锁
 *  短信内部暂停4秒, 一台手机
 *
 *  解释：短信锁的是Class对象，而邮件锁的是this对象，两个锁的对象不一样
 *  所以，两把锁不会互相干扰
 *
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 15:05:37
 */
public class Demo07 {

    public static void main(String[] args) {
        Phone7 phone = new Phone7();

        new Thread(() -> {
            try {
                phone.sendSMS();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone.sendEmail();
        }).start();
    }
}

class Phone7{
    public static synchronized void sendSMS() throws InterruptedException {
        TimeUnit.SECONDS.sleep(6);
        System.out.println("发送短信");
    }

    public synchronized void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



### 2.8 锁8

>解释：短信锁的是Class对象，而邮件锁的是this对象，两个锁的对象不一样。所以，两把锁不会互相干扰

```java
package com.lyx.八锁问题;

import java.util.concurrent.TimeUnit;

/**
 * <p>
 *  * 短信加锁，静态方法
 *  * 邮件加锁
 *  短信内部暂停4秒, 两台手机分别调用邮件和短信的方法
 * </p>
 *
 * 解释：短信锁的是Class对象，而邮件锁的是this对象，两个锁的对象不一样
 * 所以，两把锁不会互相干扰
 *
 * @author lvyx
 * @since 2022-06-23 15:55:37
 */
public class Demo08 {

    public static void main(String[] args) {
        Phone8 phone1 = new Phone8();
        Phone8 phone2 = new Phone8();

        new Thread(() -> {
            try {
                phone1.sendSMS();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }).start();
        // 等待100毫秒, 保证短信线程优先抢夺到资源
        try {
            TimeUnit.MILLISECONDS.sleep(100);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        new Thread(() -> {
            phone2.sendEmail();
        }).start();
    }
}

class Phone8{
    public static synchronized void sendSMS() throws InterruptedException {
        TimeUnit.SECONDS.sleep(6);
        System.out.println("发送短信");
    }

    public synchronized void sendEmail(){
        System.out.println("发送邮件");
    }
}
```



## 3、生产者消费者

### 3.1 synchronized锁

> 创建两个线程，生产者线程和消费者线程
>
> 生产者线程对资源进行 +1 ， 消费者线程对资源进行 -1 
>
> 当资源为0时生产者进行+1操作，当资源不为0时消费者进行-1操作。

```java
package com.lyx.生产者消费者;

/**
 * <p>
 * 生产者消费者问题
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 16:23:50
 */
public class ProdConsumer {
    public static void main(String[] args) {
        ResourceClass resourceClass = new ResourceClass();
        
        new Thread(() -> {
            for (int i = 0; i < 30; i++) {
                try {
                    resourceClass.increment();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, "生产者").start();

        new Thread(() -> {
            for (int i = 0; i < 30; i++) {
                try {
                    resourceClass.decrement();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, "消费者").start();
    }

}

class ResourceClass{

    private int number;

    public synchronized void increment() throws InterruptedException {
        // 判断
        while (number != 0){
            // wait()会释放资源  sleep()不会释放资源
            // wait()会从哪里等待，从哪里唤醒，需要使用while来判断，否则会出现虚假唤醒现象
            this.wait();
        }
        // 操作
        number ++;
        System.out.println(Thread.currentThread().getName() + " : " + number);
        // 唤醒其他等待线程
        this.notify();
    }


    public synchronized void decrement() throws InterruptedException {
        // 判断
        while (number == 0){
            this.wait();
        }
        // 操作
        number --;
        System.out.println(Thread.currentThread().getName() + " : " + number);
        // 唤醒其他等待线程
        this.notify();
    }

}
```



### 3.2 lock锁

```
package com.lyx.生产者消费者;

import java.time.Clock;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * <p>
 * 生产者消费者问题-使用lock锁解决
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 16:23:50
 */
public class ProdConsumerLock {
    public static void main(String[] args) {
        ResourceClass resourceClass = new ResourceClass();

        new Thread(() -> {
            for (int i = 0; i < 30; i++) {
                try {
                    resourceClass.increment();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, "生产者").start();

        new Thread(() -> {
            for (int i = 0; i < 30; i++) {
                try {
                    resourceClass.decrement();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, "消费者").start();
    }

}

class LockResourceClass{

    private int number;
    private Lock lock = new ReentrantLock();
    private Condition condition = lock.newCondition();

    public synchronized void increment() throws InterruptedException {
        lock.lock();
        try{
            // 判断
            while (number != 0){
                condition.await();
            }
            // 操作
            number ++;
            System.out.println(Thread.currentThread().getName() + " : " + number);
            // 唤醒其他等待线程
            condition.signalAll();
        }finally {
            lock.unlock();
        }
    }


    public synchronized void decrement() throws InterruptedException {
        lock.lock();
        try{
            // 判断
            while (number == 0){
                condition.await();
            }
            // 操作
            number --;
            System.out.println(Thread.currentThread().getName() + " : " + number);
            // 唤醒其他等待线程
            condition.signalAll();
        }finally {
            lock.unlock();
        }
    }

}
```



## 4、Condition精确唤醒

```java
package com.lyx.精确唤醒;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * <p>
 * 精确唤醒
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 17:19:59
 */
public class ConditionDemo {
    public static void main(String[] args) {
        ShareDemo shareDemo = new ShareDemo();
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareDemo.print1();
            }
        }, "A").start();
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareDemo.print2();
            }
        }, "B").start();
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareDemo.print3();
            }
        }, "C").start();
    }
}

class ShareDemo {

    private Integer flag = 1; // 标志位： A:1 B:2 C:3

    private Lock lock = new ReentrantLock();

    private Condition c1 = lock.newCondition();
    private Condition c2 = lock.newCondition();
    private Condition c3 = lock.newCondition();


    public void print1(){
        lock.lock();
        try {
            // 等待
            if (flag != 1){
                c1.await();
            }
            // 操作
            System.out.println(Thread.currentThread().getName() + " 标志位：" + flag);
            // 唤醒
            flag = 2;
            // 精确唤醒
            c2.signal();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();
        }
    }

    public void print2(){
        lock.lock();
        try {
            // 等待
            if (flag != 2){
                c2.await();
            }
            // 操作
            System.out.println(Thread.currentThread().getName() + " 标志位：" + flag);
            // 唤醒
            flag = 3;
            // 精确唤醒
            c3.signal();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();
        }
    }

    public void print3(){
        lock.lock();
        try {
            // 等待
            if (flag != 3){
                c3.await();
            }
            // 操作
            System.out.println(Thread.currentThread().getName() + " 标志位：" + flag);
            // 唤醒
            flag = 1;
            // 精确唤醒
            c1.signal();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();
        }
    }


}
```



## 5、Callable

> 实现Callable方法创建线程

```java
package com.lyx.callable创建线程;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 实现Callable接口方式创建线程
 * </p>
 *
 * @author lvyx
 * @since 2022-06-23 18:22:32
 */
public class CallableDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        FutureTask<String> stringFutureTask = new FutureTask<>(new CallableThread());
        new Thread(stringFutureTask, "CallableThread").start();
        String result = stringFutureTask.get();
        System.out.println(result);
    }
}

class CallableThread implements Callable<String>{

    @Override
    public String call() throws Exception {
        System.out.println("... call method runtime");
        TimeUnit.SECONDS.sleep(2);
        return "hello world";
    }
}
```

**总结：**

1. 使用get()方法获取线程的返回值时，应该放在方法的最后，否则会阻塞方法的执行。

2. 使用同一个FutureTask对象创建多个线程，线程只会执行一次，后面的线程会复用第一次的结果。

   ```java
   package com.lyx.callable创建线程;
   
   import java.util.concurrent.Callable;
   import java.util.concurrent.ExecutionException;
   import java.util.concurrent.FutureTask;
   import java.util.concurrent.TimeUnit;
   
   /**
    * <p>
    * 实现Callable接口方式创建线程
    * </p>
    *
    * @author lvyx
    * @since 2022-06-23 18:22:32
    */
   public class CallableDemo {
       public static void main(String[] args) throws ExecutionException, InterruptedException {
           FutureTask<String> stringFutureTask = new FutureTask<>(new CallableThread());
           new Thread(stringFutureTask, "CallableThread2").start();
           String result1 = stringFutureTask.get();
           System.out.println(result1);
           new Thread(stringFutureTask, "CallableThread1").start();
           String result2 = stringFutureTask.get();
           System.out.println(result2);
       }
   }
   
   class CallableThread implements Callable<String>{
   
       @Override
       public String call() throws Exception {
           System.out.println("... call method runtime");
           System.out.println(Thread.currentThread().getName());
           TimeUnit.SECONDS.sleep(2);
      
           return "hello world";
       }
   }
   ```



## 6、JUC工具类

### 6.1 CountDownLatch

>CountDownLatch是一个**同步工具类**，用来协调多个线程之间的同步，或者说起到线程之间的通信（而不是用作互斥的作用）。
>
>CountDownLatch能够使一个线程在等待另外一些线程完成各自工作之后，再继续执行。使用一个计数器进行实现。计数器初始值为线程的数量。当每一个线程完成自己任务后，计数器的值就会减一。当计数器的值为0时，表示所有的线程都已经完成一些任务，然后在CountDownLatch上等待的线程就可以恢复执行接下来的任务。

```java
package com.lyx.JUC工具类;

import java.util.concurrent.CountDownLatch;

/**
 * <p>
 * TODO(类描述信息)
 * </p>
 *
 * @author lvyx
 * @since 2022-06-24 00:31:41
 */
public class CountDownLatchDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(6);
        for (int i = 0; i < 6; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName());
                // 计数器 -1
                countDownLatch.countDown();
            }, String.valueOf(i)).start();
        }
        // 阻塞线程，指导计数器归零，程序才向下执行
        countDownLatch.await();
        System.out.println(Thread.currentThread().getName() + " game over");
    }
}
```



### 6.2 CyclicBarrier

> CyclicBarrier 是另外一种多线程并发控制工具。和 CountDownLatch 非常类似，它也可以实现线程间的计数等待，但它的功能比 CountDownLatch 更加复杂且强大。
>
> CyclicBarrier 可以理解为循环栅栏。当所有线程运行到栅栏位置会进行等待，直到达到规定的线程数量，程序才会往下执行。若CyclicBarrier传入了Runnable接口实现类，当规定数量线程等待，才会运行传入的线程。知道传入的线程结束后，等待的线程才会继续向下执行。
>

```java
package com.lyx.JUC工具类;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 加法计数器
 * </p>
 *
 * @author lvyx
 * @since 2022-06-24 00:42:08
 */
public class CyclicBarrierDemo {

    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7, () -> {
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("cyclicBarrier game over");
        });
        for (int i = 0; i < 7; i++) {
            new Thread(() -> {
                System.out.println("come on thread:" + Thread.currentThread().getName());
                try {
                    cyclicBarrier.await();
                    System.out.println(Thread.currentThread().getName() + " game over");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } catch (BrokenBarrierException e) {
                    throw new RuntimeException(e);
                }
            }, String.valueOf(i)).start();
        }
    }

}
```

