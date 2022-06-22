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