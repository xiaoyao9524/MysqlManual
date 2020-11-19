---
title: MySQL(7)、子查询
date: 2020-11-19 14:31:28
permalink: /pages/8e857b/
categories:
  - MysqlManual
tags:
  - 
---
# MySQL(7)、子查询

标签（空格分隔）： mysql

---

[toc]

---

* 本节使用数据表及数据在附录查看

---

> 子查询（Subquery）是指出现在其它SQL语句内的SELECT子句。

```
例如：
SELECT * FROM t1 WHERE col1 = (SELECT col2 FROM t2);
其中SELECT * FROM t1,称为Outer Query/Outer Statement
SELECT col2 FROM t2,称为SubQuery
```

子查询指嵌套在查询内部，且必须始终出现在圆括号内。
子查询可以包含多个关键字或条件，如DISTINCT、GROUP BY、ORDER BY、LIMIT、函数等。
子查询的外层查询可以是：SELECT,INSERT,UPDATE,SET或DO。

子查询可以返回标量、一行、一列或子查询。

---

## 一、使用比较运算符的子查询
```
使用比较运算符的子查询
    =、>、<、>=、<=、<>、!=、<=>
语法结构
    operand comparison_operator subquery
```

示例1、求所有商品价格的平均值
```
root@localhost test > SELECT AVG(goods_price) FROM tdb_goods; // AVG是一个聚合函数，是用来求平均值的，其它聚合函数还有max、min、count等等
+------------------+
| AVG(goods_price) |
+------------------+
|     5636.3636364 |
+------------------+
1 row in set (0.01 sec)
```
示例2、对结果进行四舍五入
```
root@localhost test > SELECT ROUND(AVG(goods_price), 2) FROM tdb_goods; // ROUND函数表示对结果进行四舍五入，第二个参数表示保留小数点多少位
+----------------------------+
| ROUND(AVG(goods_price), 2) |
+----------------------------+
|                    5636.36 |
+----------------------------+
1 row in set (0.00 sec)
```
示例3、查找价格大于平均值的数据
```
root@localhost test > SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price >= (SELECT ROUND(AVG(goods_price), 2) FROM tdb_goods);
+----------+-----------------------------------------+-------------+
| goods_id | goods_name                              | goods_price |
+----------+-----------------------------------------+-------------+
|        3 | G150TH 15.6英寸游戏本                   |    8499.000 |
|        7 | SVP13226SCB 13.3英寸触控超极本          |    7999.000 |
|       13 | iMac ME086CH/A 21.5英寸一体电脑         |    9188.000 |
|       17 | Mac Pro MD878CH/A 专业级台式电脑        |   28888.000 |
|       18 |  HMZ-T3W 头戴显示设备                   |    6999.000 |
|       20 | X3250 M4机架式服务器 2583i14            |    6888.000 |
|       21 |  HMZ-T3W 头戴显示设备                   |    6999.000 |
+----------+-----------------------------------------+-------------+
7 rows in set (0.00 sec)
```
---

### 用ANY、SOME或ALL修饰的比较运算符
```
// 在返回多个结果时，可使用ANY、SOME或ALL修饰
// ANY和SOME是等价的，只要符合其中一个就行
operand comparison_operator ANY (subquery)

operand comparison_operator SOME (subquery)
// 而ALL需要符合全部
operand comparison_operator ALL (subquery)
```
原则：
|运算符↓ 关键字→|ANY|SOME|ALL|
|:--:|:--:|:--:|:--:|
|\>、>= |最小值|最小值|最大值|
|<、<=|最大值|最大值|最小值|
|=|任意值|任意值||
|<>、!=|||任意值|

示例-获取价格大于超级本的数据
```
// 搜索所有类型为‘超级本’的数据
root@localhost test > SELECT goods_name,goods_price FROM tdb_goods WHERE goods_cate = '超级本';
+---------------------------------------+-------------+
| goods_name                            | goods_price |
+---------------------------------------+-------------+
| X240(20ALA0EYCD) 12.5英寸超极本       |    4999.000 |
| U330P 13.3英寸超极本                  |    4299.000 |
| SVP13226SCB 13.3英寸触控超极本        |    7999.000 |
+---------------------------------------+-------------+
3 rows in set (0.00 sec)

// 错误搜索示例
root@localhost test > SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price > (SELECT goods_price FROM tdb_goods WHERE goods_cate  = '超级本');
ERROR 1242 (21000): Subquery returns more than 1 row // 错误原因：子查询返回了多条数据

// 使用修饰符搜索
root@localhost test > SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price > ANY (SELECT goods_price FROM tdb_goods WHERE goods_cate  = '超级本'); // 我们在‘>’后面添加了‘ANY’修饰符，根据上表，子查询返回最小值‘4299.00’,所以返回结果是所有价格大于‘4299’的数据
+----------+-----------------------------------------+-------------+
| goods_id | goods_name                              | goods_price |
+----------+-----------------------------------------+-------------+
|        2 | Y400N 14.0英寸笔记本电脑                |    4899.000 |
|        3 | G150TH 15.6英寸游戏本                   |    8499.000 |
|        5 | X240(20ALA0EYCD) 12.5英寸超极本         |    4999.000 |
|        7 | SVP13226SCB 13.3英寸触控超极本          |    7999.000 |
|       13 | iMac ME086CH/A 21.5英寸一体电脑         |    9188.000 |
|       16 | PowerEdge T110 II服务器                 |    5388.000 |
|       17 | Mac Pro MD878CH/A 专业级台式电脑        |   28888.000 |
|       18 |  HMZ-T3W 头戴显示设备                   |    6999.000 |
|       20 | X3250 M4机架式服务器 2583i14            |    6888.000 |
|       21 |  HMZ-T3W 头戴显示设备                   |    6999.000 |
+----------+-----------------------------------------+-------------+
10 rows in set (0.01 sec)

root@localhost test > SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price > ALL (SELECT goods_price FROM tdb_goods WHERE goods_cate  = '超级本'); // 我们将‘ANY’修饰符修改为‘ALL’,根据上表，子查询返回的值为最大值‘7999’，所以返回结果是所有价格大于‘7999’的数据
+----------+-----------------------------------------+-------------+
| goods_id | goods_name                              | goods_price |
+----------+-----------------------------------------+-------------+
|        3 | G150TH 15.6英寸游戏本                   |    8499.000 |
|       13 | iMac ME086CH/A 21.5英寸一体电脑         |    9188.000 |
|       17 | Mac Pro MD878CH/A 专业级台式电脑        |   28888.000 |
+----------+-----------------------------------------+-------------+
3 rows in set (0.00 sec)
```
---
## 二、使用[NOT] IN 的子查询

语法结构
operand comparison_operator [NOT] IN (subquery)

=ANY 运算符与IN 等效。

!=ALL 或<>ALL运算符与NOT IN等效。

示例
```
root@localhost test > SELECT goods_id,goods_name,goods_price,goods_cate FROM tdb_goods WHERE goods_price != ALL (SELECT goods_price FROM tdb_goods WHERE goods_cate  = '超级本')\G; // 将查询语句修改为‘！= ALL’，返回的数据与‘NOT IN’等效，为除了超级本以外的所有数据
*************************** 1. row ***************************
   goods_id: 1
 goods_name: R510VC 15.6英寸笔记本
goods_price: 3399.000
 goods_cate: 笔记本
*************************** 2. row ***************************
   goods_id: 2
 goods_name: Y400N 14.0英寸笔记本电脑
goods_price: 4899.000
 goods_cate: 笔记本
*************************** 3. row ***************************
   goods_id: 3
 goods_name: G150TH 15.6英寸游戏本
goods_price: 8499.000
 goods_cate: 游戏本
*************************** 4. row ***************************
   goods_id: 4
 goods_name: X550CC 15.6英寸笔记本
goods_price: 2799.000
 goods_cate: 笔记本
*************************** 5. row ***************************
   goods_id: 8
 goods_name: iPad mini MD531CH/A 7.9英寸平板电脑
goods_price: 1998.000
 goods_cate: 平板电脑
*************************** 6. row ***************************
   goods_id: 9
 goods_name: iPad Air MD788CH/A 9.7英寸平板电脑 （16G WiFi版）
goods_price: 3388.000
 goods_cate: 平板电脑
*************************** 7. row ***************************
   goods_id: 10
 goods_name:  iPad mini ME279CH/A 配备 Retina 显示屏 7.9英寸平板电脑 （16G WiFi版）
goods_price: 2788.000
 goods_cate: 平板电脑
*************************** 8. row ***************************
   goods_id: 11
 goods_name: IdeaCentre C340 20英寸一体电脑
goods_price: 3499.000
 goods_cate: 台式机
*************************** 9. row ***************************
   goods_id: 12
 goods_name: Vostro 3800-R1206 台式电脑
goods_price: 2899.000
 goods_cate: 台式机
*************************** 10. row ***************************
   goods_id: 13
 goods_name: iMac ME086CH/A 21.5英寸一体电脑
goods_price: 9188.000
 goods_cate: 台式机
*************************** 11. row ***************************
   goods_id: 14
 goods_name: AT7-7414LP 台式电脑 （i5-3450四核 4G 500G 2G独显 DVD 键鼠 Linux ）
goods_price: 3699.000
 goods_cate: 台式机
*************************** 12. row ***************************
   goods_id: 15
 goods_name: Z220SFF F4F06PA工作站
goods_price: 4288.000
 goods_cate: 服务器/工作站
*************************** 13. row ***************************
   goods_id: 16
 goods_name: PowerEdge T110 II服务器
goods_price: 5388.000
 goods_cate: 服务器/工作站
*************************** 14. row ***************************
   goods_id: 17
 goods_name: Mac Pro MD878CH/A 专业级台式电脑
goods_price: 28888.000
 goods_cate: 服务器/工作站
*************************** 15. row ***************************
   goods_id: 18
 goods_name:  HMZ-T3W 头戴显示设备
goods_price: 6999.000
 goods_cate: 笔记本配件
*************************** 16. row ***************************
   goods_id: 19
 goods_name: 商务双肩背包
goods_price: 99.000
 goods_cate: 笔记本配件
*************************** 17. row ***************************
   goods_id: 20
 goods_name: X3250 M4机架式服务器 2583i14
goods_price: 6888.000
 goods_cate: 服务器/工作站
*************************** 18. row ***************************
   goods_id: 21
 goods_name:  HMZ-T3W 头戴显示设备
goods_price: 6999.000
 goods_cate: 笔记本配件
*************************** 19. row ***************************
   goods_id: 22
 goods_name: 商务双肩背包
goods_price: 99.000
 goods_cate: 笔记本配件
19 rows in set (0.00 sec)
```

---
## 三、使用[NOT] EXISTS的子查询

> 如果子查询返回任何行，EXISTS将返回true;否则为FALSE;

---

## 四、使用INSERT...SELECT插入记录
前面我们学习使用'INSERT...VALUES'插入记录和使用'INSERT...SELECT'两种方式的区别是，'INSERT...SELECT'可以使用子查询

示例、使用外键存储商品分类
```
// 1、新建商品分类表
root@localhost test > CREATE TABLE IF NOT EXISTS tdb_goods_cates(
    -> cate_id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> cate_name VARCHAR(40) NOT NULL
    -> );
Query OK, 0 rows affected (0.05 sec)
// 2、查看现有所有分类
root@localhost test > SELECT goods_cate FROM tdb_goods GROUP BY goods_cate;
+---------------------+
| goods_cate          | // 可以看出我们现在只有七个类别，
+---------------------+ // 接下来就是将这七个类别写入到tdb_goods_cates表中
| 笔记本              |
| 游戏本              |
| 超级本              |
| 平板电脑            |
| 台式机              |
| 服务器/工作站       |
| 笔记本配件          |
+---------------------+
7 rows in set (0.01 sec)
```
> 接下来我们要考虑如何将7条数据写入表中，我们可以手动录入7次，但这样太麻烦，我们可以使用'INSERT...SELECT'语句来实现

### 将查询结果写入数据表
```
// 语法：
INSERT [INTO] tbl_name [(col_name,...)] SELECT ...

// 示例
root@localhost test > INSERT tdb_goods_cates(cate_name) SELECT goods_cate FROM tdb_goods GROUP BY goods_cate;
Query OK, 7 rows affected (0.01 sec)
Records: 7  Duplicates: 0  Warnings: 0

root@localhost test > SELECT * FROM tdb_goods_cates; // 接下来查看发现写入成功
+---------+---------------------+
| cate_id | cate_name           |
+---------+---------------------+
|       1 | 笔记本              |
|       2 | 游戏本              |
|       3 | 超级本              |
|       4 | 平板电脑            |
|       5 | 台式机              |
|       6 | 服务器/工作站       |
|       7 | 笔记本配件          |
+---------+---------------------+
7 rows in set (0.00 sec)

// 接下来就该参照分类表(tdb_goods_cates)来更新商品表(tdb_goods)
```
### 多表更新
```
// 语法
UPDATE table_references
SET col_name1={expr1|DEFAULT}
[,col_name2={expr2|DEFAULT}]...
[WHERE where_condition]

```

### 表的连接（至少两张）
```
// 语法结构
table_reference
{[INNER | CROSS] JOIN | {LEFT|RIGHT} [OUTER] JOIN}
table_reference
ON conditional_expr
```

### 连接类型
```
INNER JOIN,内连接
    在MySQL中，JOIN,CROSS JOIN 和INNER JOIN是等价的。
LEFT [OUTER] JOIN, 左外连接
RIGHT [OUTER] JOIN, 右外连接
```

### 正式更新商品表
```
root@localhost test > UPDATE tdb_goods INNER JOIN tdb_goods_cates ON goods_cate = cate_name
    -> SET goods_cate = cate_id; // 使用INNER JOIN的方式，条件为'goods_cate = cate_name'，设置'goods_cate'的值为'cate_id';
Query OK, 22 rows affected (0.04 sec)
Rows matched: 22  Changed: 22  Warnings: 0

// 再次查看商品表
root@localhost test > SELECT goods_name,goods_cate FROM tdb_goods;
+-------------------------------------------------+------------+
| goods_name                                      | goods_cate | // 数据已经更新完毕
+-------------------------------------------------+------------+
| R510VC 15.6英寸笔记本                           | 1          |
| Y400N 14.0英寸笔记本电脑                        | 1          |
| G150TH 15.6英寸游戏本                           | 2          |
| X550CC 15.6英寸笔记本                           | 1          |
| X240(20ALA0EYCD) 12.5英寸超极本                 | 3          |
| U330P 13.3英寸超极本                            | 3          |
// ...
+-------------------------------------------------+------------+
22 rows in set (0.00 sec)
```

### 多表更新之一步到位(CREATE...SELECT)
上一步中我们实现多表更新一共经历了三步：
1、创建表
2、通过INSERT...SELECT 把记录写入到了新创建的表
3、多表更新

有没有方法减少这个步骤呢？答案是有的:

#### 创建数据表同时将查询结果写入到数据表
```
// 语法：
CREATE TABLE [IF NOT EXISTS] tbl_name
[(create_definition,...)]
select_statement

// 示例-将品牌也独立创建一个表
// 1.首先查看所有的品牌
root@localhost test > SELECT brand_name FROM tdb_goods GROUP BY brand_name;
+------------+
| brand_name |
+------------+
| 华硕       |
| 联想       |
| 雷神       |
| 索尼       |
| 苹果       |
| 戴尔       |
| 宏碁       |
| 惠普       |
| IBM        |
+------------+
9 rows in set (0.00 sec)

// 2.创建'tdb_goods_brands'表的同时将所有品牌信息写入
root@localhost test > CREATE TABLE tdb_goods_brands(
    -> brand_id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> brand_name VARCHAR(40) NOT NULL
    -> ) // 这里不要加分号，后面加入子查询
    -> SELECT brand_name FROM tdb_goods GROUP BY brand_name;
Query OK, 9 rows affected (0.02 sec)
Records: 9  Duplicates: 0  Warnings: 0

// 3.查看所有数据表
root@localhost test > SHOW TABLES;
+------------------+
| Tables_in_test   |
+------------------+
| provinces        |
| t1               |
| tdb_goods        |
| tdb_goods_brands | // 发现品牌表已经成功创建
| tdb_goods_cates  |
| test             |
| users            |
| users1           |
| users2           |
+------------------+
9 rows in set (0.00 sec)

// 4.查看品牌表数据发现已经成功写入
root@localhost test > SELECT * FROM tdb_goods_brands;
+----------+------------+
| brand_id | brand_name |
+----------+------------+
|        1 | 华硕       |
|        2 | 联想       |
|        3 | 雷神       |
|        4 | 索尼       |
|        5 | 苹果       |
|        6 | 戴尔       |
|        7 | 宏碁       |
|        8 | 惠普       |
|        9 | IBM        |
+----------+------------+
9 rows in set (0.00 sec)

// 5.根据品牌表(tdb_goods_brands)更新商品表(tdb_goods)
root@localhost test > UPDATE tdb_goods INNER JOIN tdb_goods_brands ON brand_name = brand_name
    -> SET brand_name = brand_id;
ERROR 1052 (23000): Column 'brand_name' in on clause is ambiguous // 出错，错误原因是出现了两个'brand_name'，系统不知道到底是哪个brand_name;

// 解决方法：给两张表起一个别名
root@localhost test > UPDATE tdb_goods AS g INNER JOIN tdb_goods_brands AS b ON g.brand_name = b.brand_name // 通过'AS'来使'tdb_goods'的别名为'g'，'tdb_goods_brands'的别名为'b'
    -> SET g.brand_name = b.brand_id;
Query OK, 22 rows affected (0.01 sec)
Rows matched: 22  Changed: 22  Warnings: 0

// 6.查看商品表
root@localhost test > SELECT goods_name,brand_name FROM tdb_goods;
// 发现'brand_name'字段已被修改
+---------------------------------------------------+------------+
| goods_name                                        | brand_name |
+---------------------------------------------------+------------+
| R510VC 15.6英寸笔记本                             | 1          |
| Y400N 14.0英寸笔记本电脑                          | 2          |
| G150TH 15.6英寸游戏本                             | 3          |
// ...
+---------------------------------------------------+------------+
22 rows in set (0.00 sec)

// 7.还有一个问题
// 现在商品表中'goods_cate'和'brand_name'字段名需要修改并且它们的类型还是字符型
// 使用CHANGE将'goods_cate'修改为'cate_id'、将'brand_name'修改为'brand_id'，并且将类型修改为数字
root@localhost test > ALTER TABLE tdb_goods
    -> CHANGE goods_cate cate_id SMALLINT UNSIGNED NOT NULL,
    -> CHANGE brand_name brand_id SMALLINT UNSIGNED NOT NULL;
Query OK, 22 rows affected (0.04 sec)
Records: 22  Duplicates: 0  Warnings: 0

root@localhost test > DESC tdb_goods; // 再次查看发现修改成功
+-------------+------------------------+------+-----+---------+----------------+
| Field       | Type                   | Null | Key | Default | Extra          |
+-------------+------------------------+------+-----+---------+----------------+
| goods_id    | smallint unsigned      | NO   | PRI | NULL    | auto_increment |
| goods_name  | varchar(150)           | NO   |     | NULL    |                |
| cate_id     | smallint unsigned      | NO   |     | NULL    |                |
| brand_id    | smallint unsigned      | NO   |     | NULL    |                |
| goods_price | decimal(15,3) unsigned | NO   |     | 0.000   |                |
| is_show     | tinyint(1)             | NO   |     | 1       |                |
| is_saleoff  | tinyint(1)             | NO   |     | 0       |                |
+-------------+------------------------+------+-----+---------+----------------+
7 rows in set (0.00 sec)
```
### 继续添加几个分类和品牌
```
root@localhost test > INSERT tdb_goods_cates(cate_name) VALUES('路由器'),('交换机'),('网卡');     
INSERT tdb_goods_brands(brand_name) VALUES('海尔'),('清华同方'),('神舟');
Query OK, 3 rows affected (0.02 sec)
Records: 3  Duplicates: 0  Warnings: 0

Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

### 继续添加一个商品
```
root@localhost test > INSERT tdb_goods(goods_name,cate_id,brand_id,goods_price) VALUES(' LaserJet Pro P1606dn 黑白激光打印机','12','4','1849'); // 但是注意，此商品的分类id为12，但是此时并没有id为12的分类
Query OK, 1 row affected (0.00 sec)

// 查看商品表
root@localhost test > SELECT * FROM tdb_goods\G;
*************************** 23. row ***************************
   goods_id: 23
 goods_name:  LaserJet Pro P1606dn 黑白激光打印机
    cate_id: 12 // 此时并没有id为12的分类
   brand_id: 4
goods_price: 1849.000
    is_show: 1
 is_saleoff: 0
23 rows in set (0.00 sec)

// 查看分类表
root@localhost test > SELECT * FROM tdb_goods_cates;
+---------+---------------------+
| cate_id | cate_name           |
+---------+---------------------+
|       1 | 笔记本              |
|       2 | 游戏本              |
|       3 | 超级本              |
|       4 | 平板电脑            |
|       5 | 台式机              |
|       6 | 服务器/工作站       |
|       7 | 笔记本配件          |
|       8 | 路由器              |
|       9 | 交换机              |
|      10 | 网卡                | // 并没有id为12的分类
+---------+---------------------+
10 rows in set (0.00 sec)
```
---
## 五、连接

> MySQL在SELECT语句、多表更新、多表删除语句中支持JOIN操作。

---
## 六、数据表参照
```
// 语法
table_references
tbl_name[[AS] alias] | table_subquery [AS] alias
/*
数据表可以使用tbl_name AS alias_name 或tbl_name alias_name 赋予别名。

table_subquery可以作为子查询使用在FROM子句中，这样的子查询必须为其赋予别名。
*/
```
---

## 七、连接类型
```
1.INNER JOIN 内连接
    在MySQL中，JOIN、CROSS JOIN和INNER JOIN是等价的，一般使用 INNER JOIN
2.LEFT [OUTER] JOIN，左外连接
3.RIGHT [OUTER] JOIN，右外连接
```
---
## 八、连接条件
```
使用ON关键字来设定连接条件，也可以使用WHERE来代替。

通常使用ON关键字来设定连接条件，
使用WHERE关键字进行结果集记录的过滤。
```
---
## 九、各种连接的区别
### 9.1、内连接
显示左表及右表符合连接条件的记录
[视频地址：0:56开始][1]

```
// 内连接示例-查找商品表并将分类以文字形式呈现
root@localhost test > SELECT goods_id,goods_name,cate_name FROM tdb_goods INNER JOIN tdb_goods_cates ON tdb_goods.cate_id = tdb_goods_cates.cate_id;
+----------+-------------------------+---------------------+
| goods_id | goods_name              | cate_name           |
+----------+-------------------------+---------------------+
|        1 | R510VC 15.6英寸笔记本   | 笔记本              |
...
|       22 | 商务双肩背包            | 笔记本配件          |
+----------+-------------------------+---------------------+
22 rows in set (0.00 sec) // 注意一共查出了22条记录，因为有一条并未查出cate_name

```

### 9.2、左外连接
显示左表全部记录及右表符合连接条件的记录

```
// 左外连接示例-查找商品表并将分类以文字形式呈现
root@localhost test > SELECT goods_id,goods_name,cate_name FROM tdb_goods LEFT JOIN tdb_goods_cates ON tdb_goods.cate_id = tdb_goods_cates.cate_id; // 我们将上一句中的'INNER JOIN' 替换成 'LEFT JOIN'
+----------+-------------------------------------+----------+
| goods_id | goods_name                          | cate_name|
+----------+------------------------+-----------------------+
|1         |R510VC 15.6英寸笔记本                | 笔记本   |
// ...
|23        |LaserJet Pro P1606dn 黑白激光打印机  | NULL     | // 注意由于此条记录没有在右表中查出对应的值，所以为NULL
+----------+----------------------------------+-------------+
23 rows in set (0.00 sec) // 注意这次把所有的23条都查了出来
```

### 9.3、右外连接
显示右表全部记录及左表符合连接条件的记录
```
root@localhost test > SELECT goods_id,goods_name,cate_name FROM tdb_goods RIGHT JOIN tdb_goods_cates ON tdb_goods.cate_id = tdb_goods_cates.cate_id; // 我们将上一句中的'LEFT JOIN' 替换成 'RIGHT JOIN'
+----------+---------------------------+---------------------+
| goods_id | goods_name                | cate_name           |
+----------+---------------------------+---------------------+
|        1 | R510VC 15.6英寸笔记本     | 笔记本              |
|        2 | Y400N 14.0英寸笔记本电脑  | 笔记本              |
// ...
|       21 |  HMZ-T3W 头戴显示设备     | 笔记本配件          |
|       22 | 商务双肩背包              | 笔记本配件          |
|     NULL | NULL                      | 路由器              |
|     NULL | NULL                      | 交换机              |
|     NULL | NULL                      | 网卡                |
+----------+---------------------------+---------------------+
25 rows in set (0.00 sec) // 这次是查出25条记录，因为新添加的打印机商品的cate_id为12，在右表中没有对应的数据，所以没有查出来，所以一共是22条商品，注意最后三项，由于没有在左边中查出对应信息，所以显示NULL，加上前面22条商品记录，一共25条
```
---
## 十、多表连接
```
// 示例-查找商品表并将分类和品牌同时以文字形式呈现
root@localhost test > SELECT goods_id,goods_name,cate_name,brand_name,goods_price FROM tdb_goods AS g
    -> INNER JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id
    -> INNER JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id;
+----------+--------------------+---------------------+------------+-------------+
| goods_id | goods_name         | cate_name           | brand_name | goods_price |
+----------+--------------------+---------------------+------------+-------------+
|1 | R510VC 15.6英寸笔记本      | 笔记本              | 华硕       |    3399.000 |
|2 | Y400N 14.0英寸笔记本电脑   | 笔记本              | 联想       |    4899.000 |
// ...
|21 |  HMZ-T3W 头戴显示设备     | 笔记本配件          | 索尼       |    6999.000 |
|22 | 商务双肩背包              | 笔记本配件          | 索尼       |      99.000 |
+----------+--------------------+---------------------+------------+-------------+
22 rows in set (0.00 sec)
```
---
## 十一、关于连接的几点说明
### 外连接
A LEFT JOIN B join_condition

数据表B的结果集依赖数据表A

数据表A的结果集根据左连接条件依赖所有数据表（B表除外）。

做外连接条件决定如何检索数据表B（在没有指定WHERE条件的情况下）。

如果数据表A的某条记录符合WHERE条件，但是在数据表B不存在符合连接条件的记录，将生成一个所有列为空的额外的B行。

如果使用内连接查找的记录在连接数据表中不存在，并且在WHERE子句中尝试以下操作:

col_name IS NULL 时，如果col_name被定义为NOT NULL，MySQL将在找到符合连接条件的记录后停止搜索更多的行。

---
## 附录

### 1、本章节使用数据-创建数据表
```
  CREATE TABLE IF NOT EXISTS tdb_goods(
    goods_id    SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    goods_name  VARCHAR(150) NOT NULL,
    goods_cate  VARCHAR(40)  NOT NULL,
    brand_name  VARCHAR(40)  NOT NULL,
    goods_price DECIMAL(15,3) UNSIGNED NOT NULL DEFAULT 0,
    is_show     BOOLEAN NOT NULL DEFAULT 1,
    is_saleoff  BOOLEAN NOT NULL DEFAULT 0
  );
```
### 2、本章节使用数据-写入记录
```
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('R510VC 15.6英寸笔记本','笔记本','华硕','3399',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Y400N 14.0英寸笔记本电脑','笔记本','联想','4899',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('G150TH 15.6英寸游戏本','游戏本','雷神','8499',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X550CC 15.6英寸笔记本','笔记本','华硕','2799',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X240(20ALA0EYCD) 12.5英寸超极本','超级本','联想','4999',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('U330P 13.3英寸超极本','超级本','联想','4299',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('SVP13226SCB 13.3英寸触控超极本','超级本','索尼','7999',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iPad mini MD531CH/A 7.9英寸平板电脑','平板电脑','苹果','1998',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iPad Air MD788CH/A 9.7英寸平板电脑 （16G WiFi版）','平板电脑','苹果','3388',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES(' iPad mini ME279CH/A 配备 Retina 显示屏 7.9英寸平板电脑 （16G WiFi版）','平板电脑','苹果','2788',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('IdeaCentre C340 20英寸一体电脑 ','台式机','联想','3499',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Vostro 3800-R1206 台式电脑','台式机','戴尔','2899',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iMac ME086CH/A 21.5英寸一体电脑','台式机','苹果','9188',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('AT7-7414LP 台式电脑 （i5-3450四核 4G 500G 2G独显 DVD 键鼠 Linux ）','台式机','宏碁','3699',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Z220SFF F4F06PA工作站','服务器/工作站','惠普','4288',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('PowerEdge T110 II服务器','服务器/工作站','戴尔','5388',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Mac Pro MD878CH/A 专业级台式电脑','服务器/工作站','苹果','28888',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES(' HMZ-T3W 头戴显示设备','笔记本配件','索尼','6999',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('商务双肩背包','笔记本配件','索尼','99',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X3250 M4机架式服务器 2583i14','服务器/工作站','IBM','6888',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('玄龙精英版 笔记本散热器','笔记本配件','九州风神','',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES(' HMZ-T3W 头戴显示设备','笔记本配件','索尼','6999',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('商务双肩背包','笔记本配件','索尼','99',DEFAULT,DEFAULT);
```


  [1]: https://www.imooc.com/video/2406