---
title: MySQL(5)、约束的使用
date: 2020-11-16 15:05:42
permalink: /pages/58809c/
categories:
  - MysqlManual
tags:
  - 
---
# MySQL(5)、约束的使用

标签（空格分隔）： mysql

---
## 说明

1、约束保证数据的完整性和一致性。
2、约束分为表级约束和列级约束。

* 2.1 如果约束只针对某一个字段使用，那么我们称之为列级约束，列级约束既可以在列定义时声明，也可以在列定义后声明；
* 2.2 如果约束针对两个或两个以上字段使用，那么我们称之为表级约束，表级约束只能在列定义后声明。

3、约束类型包括：
```
NOT NULL(非空约束)
PRIMARY KEY(主键约束)
UNIQUE KEY(唯一约束)
DEFAULT(默认约束)
FOREIGN KEY(外键约束)
```
---

## 一、非空约束(NOT NULL)

* NULL，字段值可以为空
* NOT NULL，字段值禁止为空

```
// 1、在创建表的时候设置
root@localhost t1> CREATE TABLE tb2( // 创建一个名为't2'的表
    -> username VARCHAR(20) NOT NULL, // 添加一个名为'username'的字段，类型为VARCHAR，字段值不能为空
    -> age TINYINT UNSIGNED NULL 添加一个名为'username'的字段，类型为VARCHAR，字段值可以为空
    -> );
Query OK, 0 rows affected (0.06 sec)


// 接着查看表'tb2'
root@localhost t1> SHOW COLUMNS FROM tb2;
+----------+------------------+------+-----+---------+-------+
| Field    | Type             | Null | Key | Default | Extra |
+----------+------------------+------+-----+---------+-------+
| username | varchar(20)      | NO   |     | NULL    |       | // null为NO说明此值不能为空
| age      | tinyint unsigned | YES  |     | NULL    |       |
+----------+------------------+------+-----+---------+-------+
2 rows in set (0.00 sec)


// 插入一条完整记录
root@localhost t1> INSERT tb2 VALUES('张三', 24);
Query OK, 1 row affected (0.01 sec) // 插入成功

// 插入一条只有username记录
root@localhost t1> INSERT tb2 VALUES('Tom',NULL);
Query OK, 1 row affected (0.01 sec) // 插入成功

// 插入一条只有age记录
root@localhost t1> INSERT tb2 (age) VALUES(26);
ERROR 1364 (HY000): Field 'username' doesn't have a default value // 提示错误
```

---

## 二、主键约束(AUTO_INCREMENT 和 PRIMARY KEY)

自动编号(AUTO_INCREMENT)
* 自动编号，且必须与主键组合使用
* 默认情况下，起始值为1，每次的增量为1

主键约束(PRIMARY KEY)
* 每张数据表只能存在一个主键
* 主键保证记录的唯一性
* 主键自动为NOT NULL

AUTO_INCREMENT 必须和主键一起使用，但是主键不一定必须和AUTO_INCREMENT一起使用

```
// 示例
root@localhost t1> CREATE TABLE tb3( // 创建一个名为'tb3'的数据表
    -> id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, // 添加名为'id'的字段名，设置为 'AUTO_INCREMENT'和'PRIMARY KEY'
    -> username VARCHAR(30) NOT NULL
    -> );
Query OK, 0 rows affected (0.05 sec)

// 查看 'tb3'
root@localhost t1> SHOW COLUMNS FROM tb3;
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint unsigned | NO   | PRI | NULL    | auto_increment |// 此字段在插入记录时可以不写
| username | varchar(30)       | NO   |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
2 rows in set (0.00 sec)

// 连续插入四条数据后查看
root@localhost t1> INSERT tb3(username) VALUES('Tom');
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT tb3(username) VALUES('John');
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT tb3(username) VALUES('Rose');
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT tb3(username) VALUES('Dimi tar');
Query OK, 1 row affected (0.00 sec)

root@localhost t1> SELECT * FROM tb3;
+----+----------+
| id | username |
+----+----------+
|  1 | Tom      |
|  2 | John     |
|  3 | Rose     |
|  4 | Dimi tar |
+----+----------+
4 rows in set (0.00 sec)


/* 示例：主键不一定要和'PRIMARY KEY'结合使用 */
root@localhost t1> CREATE TABLE tb4( // 创建名为'tb4'的数据表
    -> id SMALLINT PRIMARY KEY, // id字段定义为主键，但是没有定义'AUTO_INCREMENT'
    -> username VARCHAR(20)
    -> );
Query OK, 0 rows affected (0.04 sec)

// 查看表结构
root@localhost t1> SHOW COLUMNS FROM tb4;
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| id       | smallint    | NO   | PRI | NULL    |       | // id为主键而且并没有'AUTO_INCREMENT'
| username | varchar(20) | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
2 rows in set (0.00 sec)

root@localhost t1> INSERT tb4 VALUES(1, 'Tom'); // 插入id为1的数据
Query OK, 1 row affected (0.00 sec)

root@localhost t1> INSERT tb4 VALUES(1, 'John'); // 再次插入id为1的数据，提示错误
ERROR 1062 (23000): Duplicate entry '1' for key 'tb4.PRIMARY'
```
### 2.1、添加主键约束
```
// 语法
ALTER TABLE tbl_name ADD [CONSTRAINT [symbol]] PRIMARY KEY [index_type] (index_col_name,...)

// 示例
// 1、创建一个新的‘user2’表
root@localhost test > CREATE TABLE users2(
    -> username VARCHAR(10) NOT NULL ,
    -> pid SMALLINT UNSIGNED
    -> );
Query OK, 0 rows affected (0.06 sec)

root@localhost test > SHOW CREATE TABLE users2;
+--------+------------------------------+
| Table  | Create Table |
+--------+------------------------------+
| users2 | CREATE TABLE `users2` ( // ‘users2’表有‘username’和‘pid’两个字段
  `username` varchar(10) NOT NULL,
  `pid` smallint unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
+--------+------------------------------+
1 row in set (0.00 sec)

root@localhost test > ALTER TABLE users2 ADD id SMALLINT UNSIGNED ; // 添加新的‘id’列
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2; // 现在此表是没有主键的
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   |     | NULL    |       |
| pid      | smallint unsigned | YES  |     | NULL    |       |
| id       | smallint unsigned | YES  |     | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
3 rows in set (0.00 sec)

// 2、将id列设置为主键
root@localhost test > ALTER TABLE users2 ADD CONSTRAINT PK_users2_id PRIMARY KEY (id); // 'PK_users2_id PRIMARY'为别名
Query OK, 0 rows affected (0.09 sec) // 添加成功
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2; // 此时发现‘id’已经被设置为了主键
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   |     | NULL    |       |
| pid      | smallint unsigned | YES  |     | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
3 rows in set (0.00 sec)
```

### 2.2、删除主键约束
```
// 语法
ALTER TABLE tbl_name DROP PRIMARY KEY

// 示例
root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   | UNI | NULL    |       |
| pid      | smallint unsigned | YES  | MUL | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |// 现在users2表id字段为主键
| age      | tinyint unsigned  | NO   |     | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)

root@localhost test > ALTER TABLE users2 DROP PRIMARY KEY;// 删除users2表主键
Query OK, 0 rows affected (0.12 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   | PRI | NULL    |       |
| pid      | smallint unsigned | YES  | MUL | NULL    |       |
| id       | smallint unsigned | NO   |     | NULL    |       |// id已经不是主键
| age      | tinyint unsigned  | NO   |     | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)
```
---

## 三、唯一约束(UNIQUE KEY)
UNIQUE KEY

* 唯一约束
* 唯一约束可以保证记录的唯一性
* 唯一约束的字段可以为空值（NULL）
* 每张数据表可以存在多个唯一约束

```
// 示例-创建一个同时存在主键约束
root@localhost t1> CREATE TABLE tb5( // 创建数据表'tb5'
    -> id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, // 设置字段id 为自动增加、主键
    -> username VARCHAR(20) NOT NULL UNIQUE KEY, // 设置字段'username'不可为空、唯一约束
    -> age TINYINT UNSIGNED);
Query OK, 0 rows affected (0.03 sec)


// 查看表结构
root@localhost t1> SHOW COLUMNS FROM tb5;
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint unsigned | NO   | PRI | NULL    | auto_increment |// 主键+自增
| username | varchar(20)       | NO   | UNI | NULL    |                |// 唯一约束
| age      | tinyint unsigned  | YES  |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

// 插入几条数据
root@localhost t1> INSERT tb5(username,age) VALUES('张三', 25); // 成功
Query OK, 1 row affected (0.04 sec)

root@localhost t1> INSERT tb5(username,age) VALUES('李四', 28); // 成功
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT tb5(username,age) VALUES('张三', 25); // 失败，username已经有了'张三'
ERROR 1062 (23000): Duplicate entry '张三' for key 'tb5.username'
```
### 3.1、添加唯一约束
```
// 语法
ALTER TABLE tbl_name ADD [CONSTRAINT[symbol]] UNIQUE [INDEX|KEY] [index_name] [index_type] (index_col_name, ...)

// 示例-给‘username’字段添加唯一约束
root@localhost test > SHOW COLUMNS FROM users2; 
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   |     | NULL    |       |
| pid      | smallint unsigned | YES  |     | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
3 rows in set (0.06 sec)

root@localhost test > ALTER TABLE users2 ADD UNIQUE (username); // 添加
Query OK, 0 rows affected (0.06 sec) // 添加成功
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   | UNI | NULL    |       | // 再次查看发现已经有唯一约束
| pid      | smallint unsigned | YES  |     | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
3 rows in set (0.00 sec)
```

### 3.2、删除唯一约束
```
// 语法
ALTER TABLE tbl_name DROP {index|key} index_name

// 示例
// 首先查看一下索引
root@localhost test > SHOW INDEXES FROM users2\G;
*************************** 1. row ***************************
        Table: users2
   Non_unique: 0
     Key_name: username // 发现users2有一个username的约束
 Seq_in_index: 1
  Column_name: username
    Collation: A
  Cardinality: 0
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
*************************** 2. row ***************************
        Table: users2
   Non_unique: 1
     Key_name: pid
 Seq_in_index: 1
  Column_name: pid
    Collation: A
  Cardinality: 0
     Sub_part: NULL
       Packed: NULL
         Null: YES
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
2 rows in set (0.00 sec)

ERROR:
No query specified

root@localhost test > ALTER TABLE users2 DROP INDEX username; // 删除username的约束
Query OK, 0 rows affected (0.15 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   |     | NULL    |       |// 发现我们只是删除了约束而不是删除列
| pid      | smallint unsigned | YES  | MUL | NULL    |       |
| id       | smallint unsigned | NO   |     | NULL    |       |
| age      | tinyint unsigned  | NO   |     | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)

root@localhost test > SHOW INDEXES FROM users2\G; // 再次查看发现username约束已经没有了
*************************** 1. row ***************************
        Table: users2
   Non_unique: 1
     Key_name: pid
 Seq_in_index: 1
  Column_name: pid
    Collation: A
  Cardinality: 0
     Sub_part: NULL
       Packed: NULL
         Null: YES
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
1 row in set (0.00 sec)

ERROR:
No query specified
```
---

## 四、默认约束(DEFAULT)

* 默认值
* 当插入记录时，如果没有明确的字段赋值，则自动赋予默认值
```
// 示例
root@localhost t1> CREATE TABLE tb6 (
    -> id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    -> username VARCHAR(20) NOT NULL UNIQUE KEY,
    -> sex ENUM('1', '2', '3') DEFAULT '3' // 假设1男2女3保密，不写默认为3
    -> );
Query OK, 0 rows affected (0.03 sec)

// 查看表结构
root@localhost t1> SHOW COLUMNS FROM tb6;
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint unsigned | NO   | PRI | NULL    | auto_increment |
| username | varchar(20)       | NO   | UNI | NULL    |                |
| sex      | enum('1','2','3') | YES  |     | 3       |                |// 不传默认为'3'
+----------+-------------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

// 测试
root@localhost t1> INSERT tb6(username, sex) VALUES('张三','1'); // sex为1
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT tb6(username, sex) VALUES('李四','2');// sex为2
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT tb6(username) VALUES('王五'); // 不写sex
Query OK, 1 row affected (0.00 sec)

root@localhost t1> SELECT * FROM tb6;
+----+----------+------+
| id | username | sex  |
+----+----------+------+
|  1 | 张三     | 1    |
|  2 | 李四     | 2    |
|  3 | 王五     | 3    | // 不写默认为3
+----+----------+------+
3 rows in set (0.00 sec)
```
### 添加/删除默认约束

```
// 语法
ALTER TABLE tbl_name ALTER [COLUMN] col_name {SET DEFAULT literal | DROP DEFAULT}

// 示例-给‘age’字段添加默认值
root@localhost test > ALTER TABLE users2 ADD age TINYINT UNSIGNED NOT NULL; // 首先添加一列‘age’字段
Query OK, 0 rows affected (0.05 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   | UNI | NULL    |       |
| pid      | smallint unsigned | YES  | MUL | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |
| age      | tinyint unsigned  | NO   |     | NULL    |       | // 此时‘age’字段是没有默认值的
+----------+-------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)

root@localhost test > ALTER TABLE users2 ALTER age SET DEFAULT 15; // 设置默认值为15
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   | UNI | NULL    |       |
| pid      | smallint unsigned | YES  | MUL | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |
| age      | tinyint unsigned  | NO   |     | 15      |       |// 现在‘age’字段默认值为15
+----------+-------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)

root@localhost test > ALTER TABLE users2 ALTER age DROP DEFAULT; // 删除默认约束
Query OK, 0 rows affected (0.01 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   | UNI | NULL    |       |
| pid      | smallint unsigned | YES  | MUL | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |
| age      | tinyint unsigned  | NO   |     | NULL    |       |// 现在‘age’字段没有默认值
+----------+-------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)
```
---

## 五、外键约束(FOREIGN KEYp)

* 保持数据一致性，完整性。
* 实现一对一或一对多关系。

### 5.1 外键约束的要求
1. 父表和子表必须使用相同的存储引擎，而且禁止使用临时表。
2. 数据表的存储引擎只能为InnoDB。
3. 外键列和参照列必须具有相似的数据类型。其中数字的长度或是否有符号位必须相同；而字符的长度则可以不同
4. 外键列和参照列必须创建索引。如果外键列不存在索引的话，MySQL将自动创建索引。

```
// 说明：

子表：具有外键列的表
父表：子表所参照的表

编辑数据表的默认存储引擎
MySQL配置文件(my.ini)
default-storage-engine=INNODB
```
```
// 示例
// 创建一张省份表
root@localhost t1> CREATE TABLE province (
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> pname VARCHAR(20) NOT NULL
    -> );
Query OK, 0 rows affected (0.04 sec)

// 查看创建表时的语句
root@localhost t1> SHOW CREATE TABLE province;
+----------+--------------------------------------------------------------+
| Table    | Create Table                                                 |
+----------+--------------------------------------------------------------+
| province | CREATE TABLE `province` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `pname` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 | // 可以看出现在存储引擎是InnoDB
+----------+--------------------------------------------------------------+
1 row in set (0.01 sec)

// 创建一个users表
/*
* 如果想记录每个用户的省份，以前可以加一个省份字段
* 现在可以利用pid来关联省份表
*/
root@localhost t1> CREATE TABLE users(
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> username VARCHAR(10) NOT NULL,
    -> pid BIGINT, // 用来关联省份表，我们故意将类型写为BIGINT，与省份表id字段的类型不一样
    -> FOREIGN KEY (pid) REFERENCES province (id) // 将pid关联到'province'表的'id'字段
    -> );
ERROR 3780 (HY000): Referencing column 'pid' and referenced column 'id' in foreign key constraint 'users_ibfk_1' are incompatible. // 创建失败
//注意这里与课程的报错信息不一样，课程报错为：ERROR 1005 (HY000)Can't create table 'test.users'(errno: 150) ( 课程中为test表，我们这里为t1表，错误代码为150代表pid与省份表中id字段类型不一致)
-----------
root@localhost t1> CREATE TABLE users(
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> username VARCHAR(10) NOT NULL,
    -> pid BIGINT, 
    -> FOREIGN KEY (pid) REFERENCES provinces (id)  
    -> );
ERROR 1824 (HY000): Failed to open the referenced table 'provinces' 


// 修改pid字段类型为SMALLINT但是不设置有无符号位
root@localhost t1> CREATE TABLE users(
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> username VARCHAR(10) NOT NULL,
    -> pid SMALLINT, // 修改类型为SMALLINT,但是不设置UNSIGNED
    -> FOREIGN KEY (pid) REFERENCES province (id)
    -> );
ERROR 3780 (HY000): Referencing column 'pid' and referenced column 'id' in foreign key constraint 'users_ibfk_1' are incompatible. // 还是创建失败
//注意这里与课程的报错信息不一样，课程报错为：ERROR 1005 (HY000)Can't create table 'test.users'(errno: 150) ( 课程中为test表，我们这里为t1表，错误代码为150代表pid与省份表中id字段类型不一致)

// 再次创建users表并将pid字段类型、符号设置和province表id字段完全相同
root@localhost t1> CREATE TABLE users(
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> username VARCHAR(10) NOT NULL,
    -> pid SMALLINT UNSIGNED, // 与province表中的id字段完全一致
    -> FOREIGN KEY (pid) REFERENCES province (id)
    -> );
Query OK, 0 rows affected (0.02 sec) // 创建成功

// 现在province表为父表，users表为子表
// users表中的‘pid’列为外键列，province表中的‘id’列为参照列
```

```
// 查看province表索引
root@localhost t1> SHOW INDEXES FROM province;
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table    | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| province |          0 | PRIMARY  |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
1 row in set (0.04 sec)

// 或者后面添加'\G'以网格形式呈现
root@localhost t1> SHOW INDEXES FROM province\G;
*************************** 1. row ***************************
        Table: province
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: id // id已经被设置为了索引
    Collation: A
  Cardinality: 0
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
1 row in set (0.00 sec)

ERROR:
No query specified

// 查看users表索引，我们发现有两个索引，一个是主键索引（id），另一个是pid
root@localhost t1> SHOW INDEXES FROM users\G;                  
*************************** 1. row *************************** 
        Table: users                                           
   Non_unique: 0                                               
     Key_name: PRIMARY                                         
 Seq_in_index: 1                                               
  Column_name: id                                              
    Collation: A                                               
  Cardinality: 0                                               
     Sub_part: NULL                                            
       Packed: NULL                                            
         Null:                                                 
   Index_type: BTREE                                           
      Comment:                                                 
Index_comment:                                                 
      Visible: YES                                             
   Expression: NULL                                            
*************************** 2. row *************************** 
        Table: users                                           
   Non_unique: 1                                               
     Key_name: pid                                             
 Seq_in_index: 1                                               
  Column_name: pid                                             
    Collation: A                                               
  Cardinality: 0                                               
     Sub_part: NULL                                            
       Packed: NULL                                            
         Null: YES                                             
   Index_type: BTREE                                           
      Comment:                                                 
Index_comment:                                                 
      Visible: YES                                             
   Expression: NULL                                            
2 rows in set (0.01 sec)                                       
                                                               
ERROR:                                                         
No query specified                                             
                                                               
root@localhost t1>                                             
```
[课程地址][1]


  [1]: https://www.imooc.com/video/2168 "课程地址"
  
### 5.2 外键约束的参照操作

1.  CASCADE: 从父表删除或更新且自动删除或更新子表中匹配的行
2.  SET NULL: 从父表删除或更新行，并设置子表中的外键列为NULL。如果使用该选项，必须保证子表列没有指定NOT NULL
3.  RESTRICT: 拒绝对父表的删除或更新操作。
4.  NO ACTION: 标准SQL的关键字，在MySQL中与RESTRICT相同

```
// 示例
// 1. 创建表‘users1’来进行测试
root@localhost t1> CREATE TABLE users1(
    -> id SMALLINT PRIMARY KEY AUTO_INCREMENT,
    -> username VARCHAR(10) NOT NULL,
    -> pid SMALLINT UNSIGNED,
    -> FOREIGN KEY (pid) REFERENCES province (id) ON DELETE CASCADE // 添加'ON DELETE CASCADE'来表示province表在删除记录时此表的记录也会更新
    -> );
Query OK, 0 rows affected (0.06 sec)

// 2. 给父表（province）插入数据（必须先给父表插入数据）
root@localhost t1> INSERT province (pname) VALUES('山西');
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT province(pname) VALUES('山东');
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT province(pname) VALUES('广州');
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT province(pname) VALUES('河北');
Query OK, 1 row affected (0.01 sec)

root@localhost t1> SELECT * FROM province; // 共插入4条记录
+----+--------+
| id | pname  |
+----+--------+
|  1 | 山西   |
|  2 | 山东   |
|  3 | 广州   |
|  4 | 河北   |
+----+--------+
4 rows in set (0.00 sec)

3、给子表中插入数据
root@localhost t1> INSERT users1 (username, pid) VALUES('张三', 1);
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT users1 (username, pid) VALUES('李四', 2);
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT users1 (username, pid) VALUES('王五', 4);
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT users1 (username, pid) VALUES('赵六', 1);
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT users1 (username) VALUES('小明'); // pid可以为NULL
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT users1 (username) VALUES('小红'); // pid可以重复为NULL
Query OK, 1 row affected (0.01 sec)

root@localhost t1> INSERT users1 (username, pid) VALUES('小红1', 5); // 测试插入province表中没有的数据，插入失败，province表中没有id为5的数据
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`t1`.`users1`, CONSTRAINT `users1_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `province` (`id`) ON DELETE CASCADE)
root@localhost t1> INSERT users1 (username, pid) VALUES('小红1', 3); // 修改后再次插入，成功
Query OK, 1 row affected (0.01 sec)

root@localhost t1> SELECT * FROM users1;
+----+----------+------+
| id | username | pid  |
+----+----------+------+
|  1 | 张三     |    1 |
|  2 | 李四     |    2 |
|  3 | 王五     |    4 |
|  4 | 赵六     |    1 |
|  5 | 小明     | NULL |
|  6 | 小红     | NULL | // 因为插入失败了一次，id也会自增1，所以直接跳到了8
|  8 | 小红1    |    3 |
+----+----------+------+
7 rows in set (0.00 sec)

// 删除父表中的数据
root@localhost t1> DELETE FROM province WHERE id = 3; // 删除id为3的省份数据（广州）
Query OK, 1 row affected (0.01 sec)

// 查看province表
root@localhost t1> SELECT * FROM province;
+----+--------+
| id | pname  |
+----+--------+
|  1 | 山西   |
|  2 | 山东   | // id为3的数据被删除了
|  4 | 河北   |
+----+--------+
3 rows in set (0.00 sec)

// 再次查看user1表发现pid为3的数据被删除了
root@localhost t1> SELECT * FROM users1;
+----+----------+------+
| id | username | pid  |
+----+----------+------+
|  1 | 张三     |    1 |
|  2 | 李四     |    2 |
|  3 | 王五     |    4 |
|  4 | 赵六     |    1 |
|  5 | 小明     | NULL |
|  6 | 小红     | NULL |
+----+----------+------+
```

### 5.3、添加外键约束

```
// 语法
ALTER TABLE tbl_name ADD [CONSTRAINT[symbol]] FOREIGN KEY [index_name] (index_col_name, ...) reference_definition

// 示例-给‘pid’字段设置外键约束
root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| username | varchar(10)       | NO   | UNI | NULL    |       |
| pid      | smallint unsigned | YES  |     | NULL    |       |
| id       | smallint unsigned | NO   | PRI | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
3 rows in set (0.00 sec)

root@localhost test > ALTER TABLE users2 ADD FOREIGN KEY (pid) REFERENCES provinces (id); // 设置外键约束
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW CREATE TABLE users2;
+--------+--------------------------------------------------------------------------+
| Table  | Create Table     |
+--------+--------------------------------------------------------------------------+
| users2 | CREATE TABLE `users2` (
  `username` varchar(10) NOT NULL,
  `pid` smallint unsigned DEFAULT NULL,
  `id` smallint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `pid` (`pid`),
  CONSTRAINT `users2_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `provinces` (`id`) // 设置成功
) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
+--------+--------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

### 5.4、删除外键约束

```
// 语法 
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol

// 示例
root@localhost test > SHOW CREATE TABLE users2; // 首先查找要删除的外键名称
+--------+--------------------------------------------------------------------------------+
| Table  | Create Table|
+--------+--------------------------------------------------------------------------------+
| users2 | CREATE TABLE `users2` (
  `username` varchar(10) NOT NULL,
  `pid` smallint unsigned DEFAULT NULL,
  `id` smallint unsigned NOT NULL,
  `age` tinyint unsigned NOT NULL,
  KEY `pid` (`pid`),
  CONSTRAINT `users2_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `provinces` (`id`)// `users2_ibfk_1`为外键名称
) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
+--------+--------------------------------------------------------------------------------+
1 row in set (0.00 sec)

root@localhost test > ALTER TABLE users2 DROP FOREIGN KEY users2_ibfk_1;// 根据刚才查找到的外键名称来删除该外键约束
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW CREATE TABLE users2;// 再次查看已经没有该外键约束
+--------+--------------------------------------------------------------------------------+
| Table  | Create Table|
+--------+--------------------------------------------------------------------------------+
| users2 | CREATE TABLE `users2` (
  `username` varchar(10) NOT NULL,
  `pid` smallint unsigned DEFAULT NULL,
  `id` smallint unsigned NOT NULL,
  `age` tinyint unsigned NOT NULL,
  KEY `pid` (`pid`) // 但是这个索引还是在的
) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
+--------+--------------------------------------------------------------------------------+
1 row in set (0.00 sec)
// 删除残留索引
root@localhost test > ALTER TABLE users2 DROP INDEX pid; // 删除
Query OK, 0 rows affected (0.06 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW CREATE TABLE users2;
+--------+--------------------------------------------------------------------------------+
| Table  | Create Table|
+--------+--------------------------------------------------------------------------------+
| users2 | CREATE TABLE `users2` (
  `username` varchar(10) NOT NULL,
  `pid` smallint unsigned DEFAULT NULL,
  `id` smallint unsigned NOT NULL,
  `age` tinyint unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
+--------+--------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```