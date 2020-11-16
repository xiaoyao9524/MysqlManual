# MySQL(6)、操作数据表中的记录

标签（空格分隔）： mysql

---

[toc]

---

## 一、插入记录
```
// 语法
INSERT [INTO] tbl_name [(col_name)] {VALUES|VALUE} ({expr|DEFAULT},...)(...),...

// 示例
// 创建新的测试用表‘users’
root@localhost test > CREATE TABLE users(
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> username VARCHAR(20) NOT NULL,
    -> passowrd VARCHAR(32) NOT NULL,
    -> age TINYINT UNSIGNED NOT NULL DEFAULT 10,
    -> sex BOOLEAN
    -> );
Query OK, o rows affected (0.09 sec)

// 直接使用VALUES来给所有字段赋值
// 插入一条记录
/*
* 注意，针对id这种特殊的自增字段，第一种方法可以赋值为'NULL',插入后会自动设置合适的值
*/
root@localhost test > INSERT users VALUES(NULL, 'Tom', '123',25, 1);
Query OK, 1 row affected (0.04 sec)

root@localhost test > SELECT * FROM users;
+----+----------+----------+-----+------+
| id | username | passowrd | age | sex  |
+----+----------+----------+-----+------+
|  1 | Tom      | 123      |  25 |    1 | // id字段为1
+----+----------+----------+-----+------+
1 row in set (0.00 sec)
// 再次插入一条记录
root@localhost test > INSERT users VALUES(NULL, 'John', '456',25, 1);
Query OK, 1 row affected (0.04 sec)

root@localhost test > SELECT * FROM users;
+----+----------+----------+-----+------+
| id | username | passowrd | age | sex  |
+----+----------+----------+-----+------+
|  1 | Tom      | 123      |  25 |    1 |
|  2 | John     | 456      |  25 |    1 |// id字段为2
+----+----------+----------+-----+------+
2 rows in set (0.00 sec)

// 第二种方法为设置为‘DEFAULT’
root@localhost test > INSERT users VALUES(DEFAULT, 'Rose', '456',25, 1);
Query OK, 1 row affected (0.04 sec)

root@localhost test > SELECT * FROM users;
+----+----------+----------+-----+------+
| id | username | passowrd | age | sex  |
+----+----------+----------+-----+------+
|  1 | Tom      | 123      |  25 |    1 |
|  2 | John     | 456      |  25 |    1 |
|  3 | Rose     | 456      |  25 |    1 |// 同样也可以
+----+----------+----------+-----+------+
3 rows in set (0.00 sec)

// 直接使用VALUES来赋值必须给所有字段赋值，如果少一个字段会插入失败
root@localhost test > INSERT users VALUES(DEFAULT, 'Rose', '456',25); // 少一个字段
// ERROR 1136 (21S01): Column count doesn't match value count at row 1 // 插入失败(列的数目和值的数目不匹配)


// 输入表达式

root@localhost test > INSERT users VALUES(DEFAULT, 'Rose', '456', 3*7-5, 2); // 我们给‘age’字段赋值时使用了表达式
Query OK, 1 row affected (0.04 sec)

root@localhost test > SELECT * FROM users;
+----+----------+----------+-----+------+
| id | username | passowrd | age | sex  |
+----+----------+----------+-----+------+
|  1 | Tom      | 123      |  25 |    1 |
|  2 | John     | 456      |  25 |    1 |
|  3 | Rose     | 456      |  25 |    1 |
|  4 | Rose     | 456      |  16 |    2 | // 结果也是可以
+----+----------+----------+-----+------+
4 rows in set (0.00 sec)

// 使用默认约束的值
/*
* ‘age’字段在创建的时候设置了默认约束为10
*/
root@localhost test > INSERT users VALUES(DEFAULT, 'Rose', '456',DEFAULT, 1); // 插入式指定‘age’字段为‘DEFAULT’
Query OK, 1 row affected (0.04 sec)

root@localhost test > SELECT * FROM users;
+----+----------+----------+-----+------+
| id | username | passowrd | age | sex  |
+----+----------+----------+-----+------+
|  1 | Tom      | 123      |  25 |    1 |
|  2 | John     | 456      |  25 |    1 |
|  3 | Rose     | 456      |  25 |    1 |
|  4 | Rose     | 456      |  16 |    2 |
|  5 | Rose     | 456      |  10 |    1 |// 最终结果为10
+----+----------+----------+-----+------+
5 rows in set (0.00 sec)

// 连续插入多条记录
root@localhost test > INSERT users VALUES(DEFAULT, 'Tom', '123', 3*7-5, 1), (NULL, 'Rose', md5('123'), DEFAULT, 0); // 使用英文逗号隔开，其中第二条password字段使用了md5加密
Query OK, 2 rows affected (0.04 sec)
Records: 2  Duplicates: 0  Warnings: 0

root@localhost test > SELECT * FROM users;
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  25 |    1 |
|  2 | John     | 456                              |  25 |    1 |
|  3 | Rose     | 456                              |  25 |    1 |
|  4 | Rose     | 456                              |  16 |    2 |
|  5 | Rose     | 456                              |  10 |    1 |
|  6 | Tom      | 123                              |  16 |    1 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |  10 |    0 | // 连续添加了两条，并且第二条‘password’使用了md5加密
+----+----------+----------------------------------+-----+------+
7 rows in set (0.00 sec)
```

第二种插入方式
```
// 语法
INSERT [INTO] tbl_name SET col_name={expr | DEFAULT},...
// 说明：与第一种方式的区别在于，此方法可以使用子查询(SubQuery)，另外，此方法只能一次插入一条记录
root@localhost test > INSERT users SET username='Ben', passowrd='456'; // 由于id和age无需赋值，sex字段又允许为空，所以我们只需要赋值这两个值即可（MD才发现password拼错了）
Query OK, 1 row affected (0.04 sec)

root@localhost test > SELECT * FROM users;
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  25 |    1 |
|  2 | John     | 456                              |  25 |    1 |
|  3 | Rose     | 456                              |  25 |    1 |
|  4 | Rose     | 456                              |  16 |    2 |
|  5 | Rose     | 456                              |  10 |    1 |
|  6 | Tom      | 123                              |  16 |    1 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |  10 |    0 |
|  8 | Ben      | 456                              |  10 | NULL | // 插入成功
+----+----------+----------------------------------+-----+------+
8 rows in set (0.00 sec)
```
第三种插入方法
```
// 语法
INSERT [INTO] tbl_name [(col_name,...)] SELECT...
// 说明：此方法可以将查询结果插入到指定数据表
// 暂无示例
```

---
## 二、更新记录
### 2.1、单表更新
```
// 语法
UPDATE [LOW_PRIORITY] [IGNORE] table_reference SET col_name1={expr1|DEFAULT}[,col_name2={expr2}|DEFAULT]...[WHERE where_condition]

// 语法说明：
WHERE: 如果不加WHERE，则会将所有的记录全部额更新

// 示例
root@localhost test > UPDATE users SET age = age + 5; // 将‘age’字段全部增加5，因为没有添加where，所以全部数据都会增加
Query OK, 8 rows affected (0.04 sec)
Rows matched: 8  Changed: 8  Warnings: 0

root@localhost test > SELECT * FROM users; // 再次查看发现所有的‘age’字段都增加了5
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  30 |    1 |
|  2 | John     | 456                              |  30 |    1 |
|  3 | Rose     | 456                              |  30 |    1 |
|  4 | Rose     | 456                              |  21 |    2 |
|  5 | Rose     | 456                              |  15 |    1 |
|  6 | Tom      | 123                              |  21 |    1 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |  15 |    0 |
|  8 | Ben      | 456                              |  15 | NULL |
+----+----------+----------------------------------+-----+------+
8 rows in set (0.00 sec)
```

### 2.2 示例

#### 2.2.1 将每列的age设置为age - id 并将所有的sex字段改为0
```
root@localhost test > select * from users; // 原来的数据
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  30 |    1 |
|  2 | John     | 456                              |  30 |    1 |
|  3 | Rose     | 456                              |  30 |    1 |
|  4 | Rose     | 456                              |  21 |    2 |
|  5 | Rose     | 456                              |  15 |    1 |
|  6 | Tom      | 123                              |  21 |    1 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |  15 |    0 |
|  8 | Ben      | 456                              |  15 | NULL |
|  9 | 张三     | 123                              |  23 |    1 |
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)

root@localhost test > UPDATE users SET age = age - id, sex = 0; // 将age设置为age - id，并将sex设置为0，不加‘WHERE’表示要更新所有数据
Query OK, 9 rows affected (0.04 sec)
Rows matched: 9  Changed: 9  Warnings: 0

root@localhost test > select * from users; // 修改完成再次查询发现已经修改为我们需要的样子
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  29 |    0 |
|  2 | John     | 456                              |  28 |    0 |
|  3 | Rose     | 456                              |  27 |    0 |
|  4 | Rose     | 456                              |  17 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |
|  6 | Tom      | 123                              |  15 |    0 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  8 | Ben      | 456                              |   7 |    0 |
|  9 | 张三     | 123                              |  14 |    0 |
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)
```

#### 2.2.2 条件修改，将所有id为偶数的数据年龄加十岁
```
root@localhost test > UPDATE users SET age = age + 10 WHERE id % 2 = 0; // 此时就得必须加上‘WHERE’了，判断id除2后是否余数为0
Query OK, 4 rows affected (0.04 sec)
Rows matched: 4  Changed: 4  Warnings: 0 // 提示我们4条数据被更新

root@localhost test > select * from users;
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  29 |    0 |
|  2 | John     | 456                              |  38 |    0 |// 28改为了38
|  3 | Rose     | 456                              |  27 |    0 |
|  4 | Rose     | 456                              |  27 |    0 |// 17改为了27
|  5 | Rose     | 456                              |  10 |    0 |
|  6 | Tom      | 123                              |  25 |    0 |// 15改为了25
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  8 | Ben      | 456                              |  17 |    0 |// 7改为了17
|  9 | 张三     | 123                              |  14 |    0 |
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)
```

## 三、删除记录
### 3.1 、单表删除
```
语法：
DELETE FROM tbl_name [WHERE where_condition]

示例:
root@localhost test > DELETE FROM users WHERE id = 6; // 删除id为6的数据
Query OK, 1 row affected (0.01 sec) // 删除成功

root@localhost test > select * from users;
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  29 |    0 |
|  2 | John     | 456                              |  38 |    0 |
|  3 | Rose     | 456                              |  27 |    0 |
|  4 | Rose     | 456                              |  27 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |// id为6的数据已经被sh
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  8 | Ben      | 456                              |  17 |    0 |
|  9 | 张三     | 123                              |  14 |    0 |
+----+----------+----------------------------------+-----+------+
8 rows in set (0.00 sec)

// 如果此时再插入一条数据，那么他的id会递增为10

root@localhost test > INSERT users VALUES(NULL, '李四', 123, 18, 0);
Query OK, 1 row affected (0.04 sec)

root@localhost test > select * from users;
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  29 |    0 |
|  2 | John     | 456                              |  38 |    0 |
|  3 | Rose     | 456                              |  27 |    0 |
|  4 | Rose     | 456                              |  27 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  8 | Ben      | 456                              |  17 |    0 |
|  9 | 张三     | 123                              |  14 |    0 |
| 10 | 李四     | 123                              |  18 |    0 | // 继续插入数据id会从最大的值加一
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)
```

---

## 四、查找记录

```
语法：
SELECT select_expr [, select_expr ...]
[
    FROM table_references
    [WHERE where_condition]
    [GROUP BY {col_name | potition} [ASC | DESC], ...]
    [HAVING where_condition]
    [ORDER BY {col_name | expr position} [ASC | DESC], ...]
    [LIMIT {[offset,]row_count | row_count OFFSET offset}]
]

```
```
select_expr(查询表达式)
    每一个表达式表示想要的一列，必须至少有一个。
    多个列之间以英文逗号分隔。（例子：4.1）
    星号（ * ）表示所有列。tbl_name.*可以表示命名表的所有列。（例子：4.3）
    查询表达式可以使用[AS] alias_name为其赋予别名。(例子：4.4)
    别名可用于GROUP BY, ORDER BY或HAVING子句。
```

#### 4.1 只查询'users'表中的'id'和'username'字段
```
root@localhost test > SELECT id,username FROM users;
+----+----------+
| id | username |
+----+----------+
|  1 | Tom      |
|  2 | John     |
|  3 | Rose     |
|  4 | Rose     |
|  5 | Rose     |
|  7 | Rose     |
|  8 | Ben      |
|  9 | 张三     |
| 10 | 李四     |
+----+----------+
9 rows in set (0.00 sec)
```

#### 4.2 改变字段的查询顺序
```
root@localhost test > SELECT username, id FROM users; // 这次我们先查username，再查id

+----------+----+
| username | id |
+----------+----+
| Tom      |  1 |
| John     |  2 |
| Rose     |  3 |
| Rose     |  4 |
| Rose     |  5 |
| Rose     |  7 |
| Ben      |  8 |
| 张三     |  9 |
| 李四     | 10 |
+----------+----+
9 rows in set (0.00 sec)
```

#### 4.3 可以在列的前面加上所属表的名字
```
root@localhost test > SELECT users.id, users.username FROM users;
+----+----------+
| id | username |
+----+----------+
|  1 | Tom      |
|  2 | John     |
|  3 | Rose     |
|  4 | Rose     |
|  5 | Rose     |
|  7 | Rose     |
|  8 | Ben      |
|  9 | 张三     |
| 10 | 李四     |
+----+----------+
9 rows in set (0.00 sec)
```
#### 4.4 赋予别名
```
root@localhost test > SELECT id AS userId, username AS uname FROM users; // 将‘id’替换为‘userId’ ,将‘username’ 替换为‘uname’
+--------+--------+
| userId | uname  | // 字段名已经变为‘userId’和‘uname’
+--------+--------+
|      1 | Tom    |
|      2 | John   |
|      3 | Rose   |
|      4 | Rose   |
|      5 | Rose   |
|      7 | Rose   |
|      8 | Ben    |
|      9 | 张三   |
|     10 | 李四   |
+--------+--------+
9 rows in set (0.00 sec)
```
---

## 五、使用where语句进行条件查询
```
WHERE(条件表达式)
    对记录进行过滤，如果没有指定WHERE子句，则显示所有记录。
    在WHERE表达式中，可以使用MySQL支持的函数或运算符。
```

---

## 六、GROUP BY (对查询结果分组)
```
GROUP BY
语法：
[GROUP BY {col_name | position} [ASC | DESC], ...]

字段说明：
ASC: 升序（默认）
DESC：降序

示例：
root@localhost test > UPDATE users SET sex = 1 WHERE id = 10; // 将一条记录的sex设置为1
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

root@localhost test > SELECT * FROM users;
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  1 | Tom      | 123                              |  29 |    0 |
|  2 | John     | 456                              |  38 |    0 |
|  3 | Rose     | 456                              |  27 |    0 |
|  4 | Rose     | 456                              |  27 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  8 | Ben      | 456                              |  17 |    0 |
|  9 | 张三     | 123                              |  14 |    0 |
| 10 | 李四     | 123                              |  18 |    1 | // 设置成功
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)

root@localhost test > SELECT sex FROM users GROUP BY sex; // 我们查询sex字段并将字段分组
+------+
| sex  | // 可以看到结果只有0和1
+------+
|    0 |
|    1 |
+------+
2 rows in set (0.01 sec)
```

---

## 七、HAVING (分组条件)
[视频地址][2]
```
// 
语法：
[HAVING wherer_condition]
```

---

## 八、ORDER BY (对查询结果进行排序)
```
语法：
[ORDER BY {col_name | expr | position}[ASC|DESC], ...]

示例
1、id降序进行排序
root@localhost test > SELECT * FROM users ORDER BY id DESC; // 通过'DESC'来对id进行降序排列
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
| 10 | 李四     | 123                              |  18 |    1 |
|  9 | 张三     | 123                              |  14 |    0 |
|  8 | Ben      | 456                              |  17 |    0 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |
|  4 | Rose     | 456                              |  27 |    0 |
|  3 | Rose     | 456                              |  27 |    0 |
|  2 | John     | 456                              |  38 |    0 |
|  1 | Tom      | 123                              |  29 |    0 |
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)

2、age升序进行排序
root@localhost test > SELECT * FROM users ORDER BY age; // 默认为升序
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |
|  9 | 张三     | 123                              |  14 |    0 |
|  8 | Ben      | 456                              |  17 |    0 |
| 10 | 李四     | 123                              |  18 |    1 |
|  3 | Rose     | 456                              |  27 |    0 | // 如果数据一样将按照id排列
|  4 | Rose     | 456                              |  27 |    0 |
|  1 | Tom      | 123                              |  29 |    0 |
|  2 | John     | 456                              |  38 |    0 |
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)

3、指定多个排序条件
// 多个排序条件的情况下，如果 第一个字段可以排序的话就会忽略之后的字段
root@localhost test > SELECT * FROM users ORDER BY age, id DESC; // 按照age升序优先，id降序的情况下排列
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |
|  9 | 张三     | 123                              |  14 |    0 |
|  8 | Ben      | 456                              |  17 |    0 |
| 10 | 李四     | 123                              |  18 |    1 |
|  4 | Rose     | 456                              |  27 |    0 |// age一样的情况下，id降序排列
|  3 | Rose     | 456                              |  27 |    0 |
|  1 | Tom      | 123                              |  29 |    0 |
|  2 | John     | 456                              |  38 |    0 |
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)

按照age降序序优先，id升序的情况下排列
root@localhost test > SELECT * FROM users ORDER BY age DESC, id ASC;
+----+----------+----------------------------------+-----+------+
| id | username | passowrd                         | age | sex  |
+----+----------+----------------------------------+-----+------+
|  2 | John     | 456                              |  38 |    0 |
|  1 | Tom      | 123                              |  29 |    0 |
|  3 | Rose     | 456                              |  27 |    0 |// age一样的情况下，id升序排列
|  4 | Rose     | 456                              |  27 |    0 |
| 10 | 李四     | 123                              |  18 |    1 |
|  8 | Ben      | 456                              |  17 |    0 |
|  9 | 张三     | 123                              |  14 |    0 |
|  5 | Rose     | 456                              |  10 |    0 |
|  7 | Rose     | 202cb962ac59075b964b07152d234b70 |   8 |    0 |
+----+----------+----------------------------------+-----+------+
9 rows in set (0.00 sec)
```

---

## 九、LIMIT （限制查询结果返回的数量）
```
语法：
[LIMIT {[offset,]row_count | row_count OFFSET offset}]

示例
// 1、只获取两条数据
root@localhost test > SELECT * FROM users LIMIT 2;
+----+----------+----------+-----+------+
| id | username | passowrd | age | sex  |
+----+----------+----------+-----+------+
|  1 | Tom      | 123      |  29 |    0 |
|  2 | John     | 456      |  38 |    0 |
+----+----------+----------+-----+------+
2 rows in set (0.01 sec)

// 从第2条开始，只获取两条数据
root@localhost test > SELECT * FROM users LIMIT 2,2;
+----+----------+----------+-----+------+
| id | username | passowrd | age | sex  |
+----+----------+----------+-----+------+
|  3 | Rose     | 456      |  27 |    0 |
|  4 | Rose     | 456      |  27 |    0 |
+----+----------+----------+-----+------+
2 rows in set (0.00 sec)


// 将一个数据表中的数据导入到另一张表中

root@localhost test > CREATE TABLE test ( // 新建一张数据表test，有id和username两个字段
    -> id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> username VARCHAR(20)
    -> );
Query OK, 0 rows affected (0.11 sec)

// 从users表中筛选出age大于等于30的数据并写入test表中
// 因为要写入username字段而且此字段并不再where判断中使用，所以要写到SELECT前方
root@localhost test > INSERT test(username) SELECT username FROM users WHERE age >= 30;
Query OK, 1 row affected (0.04 sec)
Records: 1  Duplicates: 0  Warnings: 0 // 提升一条数据被影响

root@localhost test > SELECT * FROM test; // 查看test表，发现已经成功
+----+----------+
| id | username |
+----+----------+
|  1 | John     |
+----+----------+
1 row in set (0.00 sec)
```
---
## 十、其它查找
### 10.1、根据时间范围查询
[链接][1]


第一种写法：
```
select * from test where create_time between '2019-03-05 13:04:07' and '2019-03-08 13:04:07';
```

第二种写法：
```
select * from test where create_time >= '2019-03-05 13:04:07' and date <= '2019-03-08 13:04:07';
// 如果传入的格式是YYYY-MM-DD 的 没有带时分秒，按照上面两种写法会差不全。
```

解决办法：

一、改变传入格式。改为 YYYY-MM-DD hh:mm:ss 就可以使用上面两种写法

二、使用mysql的函数date_format

---
### 10.2 OR关键字查找
```
root@localhost test > SELECT * FROM provinces;
+----+--------+
| id | pname  |
+----+--------+
|  1 | 山西   |
|  2 | 山东   |
|  4 | 河北   |
+----+--------+
3 rows in set (0.05 sec)

root@localhost test > SELECT * FROM provinces WHERE id = 1 OR pname = '山东'; // 使用'OR'关键字查找'id'为1或者'pname'为'山东'的所有数据
+----+--------+
| id | pname  |
+----+--------+
|  1 | 山西   |
|  2 | 山东   |
+----+--------+
2 rows in set (0.00 sec)
```
---

  [1]: https://blog.csdn.net/qq_36189144/article/details/88350390
  [2]: https://www.bilibili.com/video/BV1ts411T7Q2?p=40