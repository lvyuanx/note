## 1、mysql

### 1.1 数据库操作

#### 1. 创建数据库

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS test1
```



#### 2. 删除数据库

```sql
-- 删除数据库
DROP DATABASE IF EXISTS test1
```



#### 3. 进入数据库

```sql
-- 进入数据库
USE test1
```



#### 4. 查看所有数据库

```sql
-- 查看数据库
SHOW DATABASES
```



### 1.2 数据类型

#### 1. 数值型

| 名称      | 含义           | 长度    |
| --------- | -------------- | ------- |
| tinyint   | 十分小的数据   | 1个字节 |
| smallint  | 较小的数据     | 2个字节 |
| mediumint | 中等大小的数据 | 3个字节 |
| int       | 标准整数       | 4个字节 |
| bigint    | 较大的数据     | 8个字节 |
| float     | 浮点数         | 4个字节 |
| double    | 浮点数         | 8个字节 |
| decimal   | 字符形式浮点数 |         |



#### 2. 字符串

| 名称     | 含义           | 长度    |
| -------- | -------------- | ------- |
| char     | 固定大小的字符 | 0~255   |
| varchar  | 可变类型字符串 | 0~65535 |
| tinytext | 微型文本       | 2^8 -1  |
| text     | 文本串         | 2^16 -1 |



#### 3. 时间类型

| 名称      | 格式                | 含义                         |
| --------- | ------------------- | ---------------------------- |
| date      | YYYY-MM-DD          | 日期格式                     |
| time      | HH:mm:ss            | 时间格式                     |
| datetime  | YYYY-MM-DD HH:mm:ss | 具体时间格式                 |
| timestamp |                     | 时间戳，1970.1.1至今的毫秒数 |



#### 4. null

* 没有值，未知
* 不要使用null进行运算



### 1.3 字段属性

![image-20210920090932791](https://gitee.com/testlyx/cloudimage/raw/master/img/202109260713547.png)



#### 1. PRIMARY KEY

* 主键



#### 2. NOT NULL

* 非空



#### 3. Unsigned

* 无符号整数
* 声明了，该列不能有负数



#### 4. AUTO_INCREMENT

* 自增
* 通常为在上一步的基础上+1
* 一般用于主键的自增
* 可以自定义设计主键的起始值和步长



#### 5. default

* 默认值
* 如果没有值，就使用默认值



#### 6. Zerofill

* 位数不足，0填充



#### 7. COMMENT

* 注释



### 1.4 最佳建表（拓展)

| 字段       | 含义     |
| ---------- | -------- |
| id         | 主键     |
| version    | 乐观锁   |
| is_delete  | 伪删除   |
| gmt_create | 创建时间 |
| gmt_update | 修改时间 |



### 1.5 创建数据库

```sql
DROP TABLE IF EXISTS `student`;  
 
 CREATE TABLE `student` (
	`id` INT(10) NOT NULL AUTO_INCREMENT COMMENT 'id主键',
	`student_name` VARCHAR(10) NOT NULL DEFAULT '匿名' COMMENT '学生姓名',
	`user` VARCHAR(10) NOT NULL DEFAULT '匿名用户' COMMENT '用户名',
	`password` VARCHAR(30) NOT NULL COMMENT '密码',
	`sex` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '性别',
	`birthday` DATETIME NOT NULL DEFAULT NOW() COMMENT '生日',
	PRIMARY KEY(`id`)
 ) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 查看创建数据库语句
SHOW CREATE DATABASE test1
-- 查看创建表语句
SHOW CREATE TABLE student
-- 显示表结构
desc student
```



### 1.6 数据表的类型

|              | MYISAM | INNODB |
| ------------ | ------ | ------ |
| 事务支持     | 不支持 | 支持   |
| 数据行锁     | 不支持 | 支持   |
| 外键约束     | 不支持 | 支持   |
| 全文索引     | 支持   | 不支持 |
| 表空间的大小 | 较小   | 较大   |

* MYISAM：节约空间，速度快
* INNODB：安全性高，事务处理，多表多用户操作



### 1.7 修改和删除表的字段

#### 1. 修改表名

```sql
-- 修改表名
ALTER TABLE `user` RENAME AS `user1`
```



#### 2. 增加表字段

```sql
-- 增加表的字段
ALTER TABLE `user1` ADD `sname` INT(10) NOT NULL DEFAULT 1 COMMENT '学生姓名'
```



#### 3. 修改字段的约束

```sql
-- 修改表的字段约束
ALTER TABLE `user1` MODIFY `sname` VARCHAR(10)
```



#### 4. 修改字段约束和字段名

```sql
-- 修改表的字段名和约束
ALTER TABLE `user1` CHANGE `sname` `studentname` VARCHAR(20)
```



#### 5. 删除表的字段

```sql
-- 删除表的字段
ALTER TABLE `user1` DROP `studentname`
```



#### 6. 删除表

```sql
-- 删除表
DROP TABLE IF EXISTS `user1`
```



### 1.8 外键

#### 1. 创建表的时候添加外键

```sql
DROP TABLE IF EXISTS `student`; 
DROP TABLE IF EXISTS `school`;

CREATE TABLE `school`(
	`id` INT(10) NOT NULL AUTO_INCREMENT COMMENT '学校id',
	`school_name` VARCHAR(10) NOT NULL DEFAULT '匿名学校',
	PRIMARY KEY(`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 
 CREATE TABLE `student` (
     `id` INT(10) NOT NULL AUTO_INCREMENT COMMENT 'id主键',
     `student_name` VARCHAR(10) NOT NULL DEFAULT '匿名' COMMENT '学生姓名',
     `user` VARCHAR(10) NOT NULL DEFAULT '匿名用户' COMMENT '用户名',
     `password` VARCHAR(30) NOT NULL COMMENT '密码',
     `sex` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '性别',
     `birthday` DATETIME NOT NULL DEFAULT NOW() COMMENT '生日',
     `school_id` INT(10) NOT NULL COMMENT '学校id',
     PRIMARY KEY(`id`),
     -- 创建外键
     KEY `FK_school_id` (`school_id`),
     CONSTRAINT `FK_school_id` FOREIGN KEY (`school_id`) REFERENCES `school`(`id`)
 ) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

![image-20210920104513838](https://gitee.com/testlyx/cloudimage/raw/master/img/202109260713501.png)



#### 2. 给没有外键的表添加

```sql
 ALTER TABLE `student` 
 ADD CONSTRAINT `FK_school_id` FOREIGN KEY (`school_id`) REFERENCES `school`(`id`)
```



### 1.9 DML语言

#### 1. 增

```sql
insert into 表名 ([字段名1, 字段名2, 字段名3 ...]) values ([值1, 值2, 值3 ...])
```



#### 2. 删

1. 删除表部分数据

   ```sql
   delete from 表名 where 字段名=值
   ```



2. 删除表全部数据

   * delete

     ```sql
     delete from 表名
     ```

     

   * truncate

     ```sql
     truncate from 表名
     ```

   

   > delete 和 truncate都能删除表中的数据，表的结构不会改变，但是使用delete删除时，表中自增字段会重置，而truncate不会重置

   

#### 3. 改

```sql
update 表名 set 字段名=值 [where 条件]
```



### 1.10 DQL查询

#### 1. 基本使用

```sql
-- 查询所有数据
select * from 表名
-- 根据条件查询部分
select 字段名1[, 字段名2, 字段名3 ...] from 表名 where 条件
-- 别名
select 字段名 as 别名 from 表名 别名 where 条件
-- 拼接，将a和b拼接在一起
select concat(a, b) from 表名 where 条件
```



#### 2. 去重

```sql
-- 查询指定字段并去掉重复
SELECT DISTINCT 字段1[, 字段2, 字段3...] FROM 表名
```



#### 3. 表达式

```sql
-- 乘法
select 1*2

-- 查询自增步长
SELECT @@auto_increment_inment
```



#### 4. 模糊查询

| 运算符      | 语法                | 描述                              |
| ----------- | ------------------- | --------------------------------- |
| is null     | a is null           | 如果a为null，结果为真             |
| is not null | a is not null       | 如果a不为null， 结果为真          |
| between     | a between c and d   | 若果a在c和d之间，结果为真         |
| like        | a like b            | 若果a匹配b，结果为真              |
| in          | a in （a1, a2, a3） | 如果a是a1,a2,a3中的一个，结果为真 |

```sql
-- like结合 %(通配0到任意字符) _(通配一个字符)
SELECT * FROM result WHERE `type` LIKE '%学'
SELECT * FROM result WHERE `type` LIKE '_学'

-- 查询分数为100和110的两条信息
SELECT * FROM result WHERE `source` IN (100, 110)
```



#### 5. inner join

![xxx join](https://gitee.com/testlyx/cloudimage/raw/master/img/202109260713111.png)

* inner join ：查询两表中都有数据的部分
* left join ：左连接会读取左边数据表的全部数据，即使右边数据表没有对应数据
* right join ：右连接会读取右边数据表的全部数据，即使左边数据表没有对应数据

```sql
-- 内连接
select * from 表名1 inner join 表名1 on 表名1.字段名 = 表名2.字段名
-- 左连接
select * from 表名1 left join 表名1 on 表名1.字段名 = 表名2.字段名
-- 右连接
select * from 表名1 right join 表名1 on 表名1.字段名 = 表名2.字段名
```



#### 6. 分页和排序

##### a、分页

```sql
select * from 表名 
limit 起始条数,步长
```



##### b、排序

* order by 

  根据所选字段进行排序，asc 升序，desc 降序

  ```sql
  SELECT column1, column2,...
  FROM tbl
  ORDER BY column1 [ASC|DESC], column2 [ASC|DESC],...
  ```

  

* group by

  根据所选字段进行分组

  ```sql
  -- 列出每个部门最高薪水的结果，sql语句如下
  SELECT DEPT as '部门', MAX(SALARY) AS '最高薪水' FROM STAFF GROUP BY DEPT
  -- having用于过滤分组后的条件，功能相当于where
  having 条件
  ```



#### 7、 子查询

```sql
-- 连接查询
SELECT g.goods_name,g.note
FROM t_user u
INNER JOIN t_goods g
ON u.id = g.user_id
WHERE u.user_name = 'admin'

-- 子查询
SELECT g.goods_name,g.note
FROM t_goods g
WHERE g.user_id = ( -- 只有单个结果
SELECT id FROM t_user WHERE user_name = 'admin'
)

-- 子查询
SELECT g.goods_name,g.note
FROM t_goods g
WHERE g.user_id on ( -- 只有单个结果
SELECT id FROM t_user WHERE user_name = 'admin'
)
```



#### 8、聚合函数

| 函数名  | 描述   |
| ------- | ------ |
| count() | 计数   |
| sum()   | 求和   |
| avg()   | 平均值 |
| max()   | 最大值 |
| min()   | 最小值 |



### 1.11 事物

#### 1. ACID原则

1. **原子性**（Atomicity）：事务开始后所有操作，**要么全部做完，要么全部不做**，不可能停滞在中间环节。事务执行过程中出错，会回滚到事务开始前的状态，所有的操作就像没有发生一样。也就是说事务是一个不可分割的整体，就像化学中学过的原子，是物质构成的基本单位。
2. **一致性**（Consistency）：事务开始前和结束后，数据库的完整性约束没有被破坏 。比如A向B转账，不可能A扣了钱，B却没收到。其实一致性也是因为原子型的一种表现
3. **隔离性**（Isolation）：同一时间，只允许一个事务请求同一数据，不同的事务之间彼此没有任何干扰。比如A正在从一张银行卡中取钱，在A取钱的过程结束前，B不能向这张卡转账。串行化
4. **持久性**（Durability）：一旦事务提交，则其所做的修改会被永久保存到数据库中。

 

#### 2. 隔离所导致的问题

1. **脏读**：事务A读取了事务B更新的数据，然后B回滚操作，那么A读取到的数据是脏数据，与表中最终的实际数据不一致
2. **不可重复读**：事务 A 多次读取同一数据，事务 B 在事务A多次读取的过程中，对数据作了更新并提交，导致事务A多次读取同一数据时，结果 不一致。读取结果与上次结果不一致
3. **幻读**：系统管理员A将数据库中所有学生的成绩从具体分数改为ABCDE等级，但是系统管理员B就在这个时候插入了一条具体分数的记录，当系统管理员A改结束后发现还有一条记录没有改过来，就好像发生了幻觉一样，这就叫幻读。修改过来了但又被改了，导致结果和预期不一样

　　小结：不可重复读的和幻读很容易混淆，不可重复读侧重于修改，幻读侧重于新增或删除。解决不可重复读的问题只需锁住满足条件的行，解决幻读需要锁表



#### 3. 四种隔离级别

1. **read uncomitted(读取未提交)**
   A事务可以读取到B事务未提交的数据，如果B事务rollback,那么A事务此前读取到的数据就是没有意义，也称为脏读。

2. **read committed(读取已提交)**
   A事务只能读取已提交的数据，解决了read uncommitted中的脏读问题，但是A事务在两次读的过程中，可能会出现B提交事务的情况，导致A的两次读操作结果不一致，也称为不可重复读。

3. **repeatable read(可重复读)**
   这是mysql的默认隔离级别，它确保同一个事务的多个实例在并发读取数据时，会看到相同的数据行。但是在读取过程中，若B事务在A事务的读取范围内添加了数据，A事务在commit之前都无法读取B事务添加的数据，也称为“幻读”

4. **Serializable (串行化)：**最高的隔离级别，通过强制事务排序，使之不可能相互冲突，从而解决“幻读”的问题。它在每个读的数据行上加上共享锁，可能会导致大量的超时等待和锁竞争。



#### 4. 事物操作

```sql
-- 1. 关闭事物自动提交
SET autocommit = 0;
-- 2. 开启事物
START TRANSACTION;
-- 3. 数据操作
UPDATE USER SET money = (money - 100) WHERE id = 1;
UPDATE USER SET money = (money + 100) WHERE id = 2;
-- 4. 提交事物
COMMIT;
-- 5. 事物回滚
ROLLBACK;
-- 6. 开启事物自动提交
SET autocommit = 0;
```



### 1.12 索引

> mysql官方定义：<font style="color:red">索引（index）是mysql高效获取数据的数据结构</font>
>
> 提取句子主干可以的到索引的本质：**索引就是数据结构**

* 主键索引 (primary key)
  * 必须为主键字段创建一个索引，这个索引就是所谓的"主索引"。主索引与唯一索引的唯一区别是：前者在定义时使用的关键字是PRIMARY而不是UNIQUE。
* 唯一索引（unique key）
  * 如果能确定某个数据列将只包含彼此各不相同的值，在为这个数据列创建索引的时候就应该用关键字UNIQUE把它定义为一个唯一索引。
  * 这么做的好处：一是简化了mysql对这个索引的管理工作，这个索引也因此而变得更有效率；二是**MySQL会在有新记录插入数据表时，自动检查新记录的这个字段的值是否已经在某个记录的这个字段里出现过了；如果是，MySQL将拒绝插入那条新记录。**
  * 也就是说，唯一索引可以保证数据记录的唯一性。事实上，在许多场合，**人们创建唯一索引的目的往往不是为了提高访问速度，而只是为了避免数据出现重复。**
* 常规索引 （key/index）
  * 普通索引（由关键字KEY或INDEX定义的索引）的唯一任务是加快对数据的访问速度
* 全文索引 （FullText）
  * 文本字段上的普通索引只能加快对出现在字段内容最前面的字符串(也就是字段内容开头的字符)进行检索操作。如果字段里存放的是由几个、甚至是多个单词构成的较大段文字，普通索引就没什么作用了。这种检索往往以LIKE %word%的形式出现，这对MySQL来说很复杂，如果需要处理的数据量很大，响应时间就会很长。　
  * 这类场合正是全文索引(full-text index)可以大显身手的地方。在生成这种类型的索引时，**MySQL将把在文本中出现的所有单词创建为一份清单，查询操作将根据这份清单去检索有关的数据记录**。**全文索引即可以随数据表一同创建，也可以等日后有必要时再使用下面这条命令添加：**
    * ALTER TABLE tablename ADD FULLTEXT(column1, column2)
  * 有了全文索引，就可以用SELECT查询命令去检索那些包含着一个或多个给定单词的数据记录了。下面是这类查询命令的
    * 基本语法：
      SELECT * FROM tablename
      　　WHERE MATCH(column1, column2) AGAINST(‘word1’, ‘word2’, ‘word3’)
      　　上面这条命令将把column1和column2字段里有word1、word2和word3的数据记录全部查询出来。
      　　注解：InnoDB数据表不支持全文索引。

#### 1. 测试索引

```sql
-- 创建app_user表
CREATE TABLE `app_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` tinyint(4) DEFAULT '0',
  `age` tinyint(4) DEFAULT '0',
  `password` varchar(100) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000002 DEFAULT CHARSET=utf8

-- 插入100万条数据
DELIMITER $$
CREATE FUNCTION mock_data()
RETURNS INT
BEGIN
	DECLARE num INT DEFAULT 1000000;
	DECLARE i INT DEFAULT 0;
	WHILE i < num DO
		INSERT INTO app_user (`name`,`email`,`phone`,`gender`,`password`,`age`) 
			VALUES(CONCAT('用户',i), 
			'123xxx@qq.com',
			CONCAT('1',SUBSTRING(CAST(3 + (RAND() * 10) % 7 AS CHAR(50)), 1, 1),RIGHT(LEFT(TRIM(CAST(RAND() AS CHAR(50))), 11), 9)),
			FLOOR(RAND()*2),
			UUID(), 
			FLOOR(RAND()*100));
		
		
		SET i = i+1;
	END WHILE;
	RETURN i;
END;
SELECT mock_data();
```



1. 未使用索引查询数据

   ```sql
   SELECT * FROM app_user WHERE `name`='用户999999'
   ```

   ![image-20210921141759374](https://gitee.com/testlyx/cloudimage/raw/master/img/202109260713601.png) 

2. 添加索引查询

   ```sql
   -- 添加一个索引
   ALTER TABLE app_user ADD INDEX key_user_app_name(`name`)
   ```

   ![image-20210921142605711](https://gitee.com/testlyx/cloudimage/raw/master/img/202109260712857.png) 

   ```sql
   SELECT * FROM app_user WHERE `name`='用户999999'
   ```

   ![image-20210921142638546](https://gitee.com/testlyx/cloudimage/raw/master/img/202109260713100.png) 

==由以上对比可知，添加索引后，数据查询的速度提升了20多倍！==



#### 2. 索引原则

* 索引不是越多越好
* 不要对经常变动的数据添加索引
* 小数据量的表不需要添加索引
* 索引一般加在常用来查询的字段上



### 1.13 三大范式

**1、1NF**

​	**要求每个字段都是原子不可分的。**

**2、2NF**

​	**要求每张表都要有一个主键，其它记录完全依赖主键。**

**3、3NF**

​	**所有字段只能依赖主键，不得依赖于其它字段。消除依赖传递。**



## 2、常用函数

### 2.1 随机生成身份证号码

```sql
DELIMITER $$
DROP FUNCTION IF EXISTS genIdNumber$$
CREATE  FUNCTION `genIdNumber`() RETURNS char(18) CHARSET utf8
    DETERMINISTIC
BEGIN
    DECLARE head VARCHAR(100) DEFAULT '000000,321102,321001,320112,320021';
   
    DECLARE years VARCHAR(100) DEFAULT '0000,1995,1993,1990,1999';
   
    DECLARE months VARCHAR(100) DEFAULT '0000,1201,1203,0903,1111';
   
    DECLARE content CHAR(10) DEFAULT '0123456789';
   
    DECLARE headd CHAR(11) DEFAULT substring(head, 1+(FLOOR(1 + (RAND() * 4))*7), 6);
   
    DECLARE yeard CHAR(11) DEFAULT substring(years, 1+(FLOOR(1 + (RAND() * 4))*5), 4);
   
    DECLARE monthd CHAR(11) DEFAULT substring(months, 1+(FLOOR(1 + (RAND() * 4))*5), 4);
   
    DECLARE idcard CHAR(18) DEFAULT CONCAT(headd,yeard,monthd);

   
    DECLARE i int DEFAULT 1;
   
    DECLARE len int DEFAULT LENGTH(content);
    WHILE i<5 DO
        SET i=i+1;
        SET idcard = CONCAT(idcard, substring(content, floor(1 + RAND() * len), 1));
    END WHILE;
   
    RETURN idcard;
END $$
DELIMITER ;
```



### 2.2 随机生成姓名

```sql
DELIMITER $$
DROP FUNCTION IF EXISTS genPerson$$
CREATE FUNCTION genPerson() RETURNS varchar(255)
BEGIN
  DECLARE xing VARCHAR (2056) DEFAULT '赵钱孙李周郑王冯陈楮卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闽席季麻强贾路娄危江童颜郭梅盛林刁锺徐丘骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁';
  DECLARE ming VARCHAR (2056) DEFAULT '寻朋义彭泽鹏举濮存溥心璞瑜浦泽奇邃祥荣轩嘉懿煜城懿轩烨伟苑博伟泽熠彤鸿煊博涛烨霖烨华煜祺智宸正豪昊然明杰诚立轩立辉峻熙弘文熠彤鸿煊烨霖哲瀚鑫鹏致远俊驰雨泽烨磊晟睿天佑文华灿嘉慕坚秉建明金鑫锦程瑾瑜鹏经赋景同靖琪君昊俊明季同开济凯安康成乐语力勤良哲理群茂彦敏博明达明轩健柏煊昊强伟宸博超君浩子骞明辉鹏涛炎彬鹤轩越彬风华靖琪明诚高格光华国源宇晗昱涵润翰飞翰海昊乾浩博和安弘曼文乐菱痴珊恨玉惜文香寒新柔语蓉海安昊修洁黎昕远航旭尧鸿涛伟祺轩越泽浩宇瑾瑜皓轩擎苍擎宇志泽睿渊楷瑞轩弘文哲瀚雨泽鑫磊梦琪忆之桃慕青问兰尔岚元香初夏沛菡傲珊瑶冰露尔珍谷雪乐萱涵菡海莲傲蕾青槐冬儿易梦惜雪宛海之柔夏青亦瑶妙菡春竹修杰伟诚建辉晋鹏天磊绍辉泽洋真晓亦向珊慕灵以蕊寻雁映易雪柳孤岚笑霜海云凝天沛珊寒云冰旋宛儿绿真盼儿晓霜碧凡夏菡曼香若烟半梦雅绿冰蓝灵槐平安书翠翠风香巧代云梦曼幼翠友巧听寒梦柏醉易访旋亦玉凌萱访卉怀亦笑蓝春翠靖柏夜蕾冰夏梦松书雪乐枫念薇靖雁寻春恨山从寒忆香觅波静曼凡旋以亦念露芷蕾千兰新波代真新蕾雁玉冷卉紫山千琴恨天傲芙盼山怀蝶冰兰山柏翠萱乐丹翠柔谷山之博鸿朗华奥夜蓉涵柏水桃醉蓝春儿语琴从彤傲晴语兰又菱碧彤元霜怜梦紫寒妙彤曼易南莲紫翠雨寒易烟如萱若南';
  DECLARE I_xing INT DEFAULT LENGTH(xing) / 3;    
  DECLARE I_ming INT DEFAULT LENGTH(ming) / 3;    
  DECLARE return_str VARCHAR (2056) DEFAULT '';
  SET return_str = CONCAT(
    return_str,
    SUBSTRING(xing, FLOOR(1 + RAND() * I_xing), 1)  
  );
  SET return_str = CONCAT(
    return_str,
    SUBSTRING(ming, FLOOR(1 + RAND() * I_ming), 1)
  );
  IF RAND() > 0.400  
  THEN SET return_str = CONCAT(
    return_str,
    SUBSTRING(ming, FLOOR(1 + RAND() * I_ming), 1)
  );
  END IF;  
  RETURN return_str;
END $$
DELIMITER ;
```



### 2.3 随机生成身份证号码

```sql
// 生成随机电话号码
DELIMITER $$
DROP FUNCTION IF EXISTS genPhone$$
CREATE  FUNCTION `genPhone`() RETURNS char(11) CHARSET utf8
    DETERMINISTIC
BEGIN
    DECLARE head VARCHAR(100) DEFAULT '000,156,136,176,183,177,133,189,131';
   
    DECLARE content CHAR(10) DEFAULT '0123456789';
   
    DECLARE phone CHAR(11) DEFAULT substring(head, 1+(FLOOR(1 + (RAND() * 8))*4), 3);
   
    DECLARE i int DEFAULT 1;
   
    DECLARE len int DEFAULT LENGTH(content);
    WHILE i<9 DO
        SET i=i+1;
        SET phone = CONCAT(phone, substring(content, floor(1 + RAND() * len), 1));
    END WHILE;
   
    RETURN phone;
END $$
DELIMITER ;
```



#### 2.4 循环执行

```sql
drop procedure if exists insert_while;
delimiter //
create procedure insert_while()
begin
    declare i int default 1;
    while i<10
    do
        select i;
        set i=i+1;
    end while;
    commit;
end //
delimiter ;

call insert_while;
```



## 3、数字函数

* ABS(x)：返回x的绝对值
* BIN(x)：返回x的二进制（OCT返回八进制，HEX返回十六进制）
* CEILING(x)：返回大于x的最小整数值
* EXP(x)：返回值e（自然对数的底）的x次方
* FLOOR(x)：返回小于x的最大整数值
* GREATEST(x1,x2,...,xn)：返回集合中最大的值
* LEAST(x1,x2,...,xn)：返回集合中最小的值
* LN(x)：返回x的自然对数
* LOG(x,y)：返回x的以y为底的对数
* MOD(x,y)：返回x/y的模（余数）
* PI()：返回pi的值（圆周率）
* RAND()：返回０到１内的随机值,可以通过提供一个参数(种子)使RAND()随机数生成器生成一个指定的值。
* ROUND(x,y)：返回参数x的四舍五入的有y位小数的值
* SIGN(x)：返回代表数字x的符号的值
* SQRT(x)：返回一个数的平方根
* TRUNCATE(x,y)：返回数字x截短为y位小数的结果