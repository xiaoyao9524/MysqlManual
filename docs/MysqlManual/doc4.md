# MySQL(4)、数据表操作2（列操作和数据表更改）

标签（空格分隔）： mysql

---

##一、添加列

### 1.1、添加单列

```
// 语法
ALTER TABLE tbl_name ADD [COLUMN] col_name column_definition [FIRST | AFTER col_name]

/*
* 部分参数说明：
* FIRST: 插入的列在表最前方
* AFTER col_name: 插入的列在指定列的后方
* 不写默认在最后放
*/

// 示例
root@localhost t1> SHOW COLUMNS FROM users1; // 首先查看users1表，现在有三列（id、username、pid）
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint          | NO   | PRI | NULL    | auto_increment |
| username | varchar(10)       | NO   |     | NULL    |                |
| pid      | smallint unsigned | YES  | MUL | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

root@localhost t1> ALTER TABLE users1 ADD age TINYINT UNSIGNED NOT NULL; // 添加一列‘age’列
Query OK, 0 rows affected (0.07 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost t1> SHOW COLUMNS FROM users1; // 再次查看users1表发现已经为4列
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint          | NO   | PRI | NULL    | auto_increment |
| username | varchar(10)       | NO   |     | NULL    |                |
| pid      | smallint unsigned | YES  | MUL | NULL    |                |
| age      | tinyint unsigned  | NO   |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)

// 再次添加‘password’字段并且在‘username’字段后面
root@localhost t1> ALTER TABLE users1 ADD password VARCHAR(32) NOT NULL AFTER username;
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

// 再次查看发现‘password’字段在‘username字段后面’
root@localhost t1> SHOW COLUMNS FROM users1;
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint          | NO   | PRI | NULL    | auto_increment |
| username | varchar(10)       | NO   |     | NULL    |                |
| password | varchar(32)       | NO   |     | NULL    |                |
| pid      | smallint unsigned | YES  | MUL | NULL    |                |
| age      | tinyint unsigned  | NO   |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

root@localhost t1> ALTER TABLE users1 ADD truename VARCHAR(20) NOT NULL FIRST; // 添加列‘truename’，这次为‘FIRST’
Query OK, 0 rows affected (0.17 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost t1> SHOW COLUMNS FROM users1;
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| truename | varchar(20)       | NO   |     | NULL    |                | // 添加完成后发现列‘truename’在此表最前方
| id       | smallint          | NO   | PRI | NULL    | auto_increment |
| username | varchar(10)       | NO   |     | NULL    |                |
| password | varchar(32)       | NO   |     | NULL    |                |
| pid      | smallint unsigned | YES  | MUL | NULL    |                |
| age      | tinyint unsigned  | NO   |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
6 rows in set (0.04 sec)
```

---

### 1.2、添加多列
```
// 语法(只能添加到最后面)
ALTER TABLE tbl_name ADD [COLUMN] (col_name column_definition, ...)

// 示例
root@localhost test > ALTER TABLE users1 ADD (
    -> c1 VARCHAR(10) NOT NULL, // 添加列c1
    -> c2 TINYINT UNSIGNED NOT NULL // 添加列c2
    -> );
Query OK, 0 rows affected (0.05 sec) // 添加成功
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users1; // 查看发现添加成功
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| truename | varchar(10)       | NO   |     | NULL    |                |
| id       | smallint unsigned | NO   | PRI | NULL    | auto_increment |
| username | varchar(10)       | NO   |     | NULL    |                |
| password | varchar(20)       | NO   |     | NULL    |                |
| pid      | smallint unsigned | YES  | MUL | NULL    |                |
| age      | tinyint unsigned  | NO   |     | NULL    |                |
| c1       | varchar(10)       | NO   |     | NULL    |                |
| c2       | tinyint unsigned  | NO   |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
8 rows in set (0.00 sec)
```

---

## 二、删除列
```
// 语法
ALTER TABLE tbl_name DROP [COLUMN] col_name

// 示例1 (删除单列)
root@localhost test > ALTER TABLE users1 DROP truename; // 删除‘truename’字段
Query OK, 0 rows affected (0.11 sec) // 删除成功
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users1; // 查看发现已经没有‘truename’字段
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint unsigned | NO   | PRI | NULL    | auto_increment |
| username | varchar(10)       | NO   |     | NULL    |                |
| password | varchar(20)       | NO   |     | NULL    |                |
| pid      | smallint unsigned | YES  | MUL | NULL    |                |
| age      | tinyint unsigned  | NO   |     | NULL    |                |
| c1       | varchar(10)       | NO   |     | NULL    |                |
| c2       | tinyint unsigned  | NO   |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
7 rows in set (0.00 sec)

// 示例2 (删除多列)
root@localhost test > ALTER TABLE users1 DROP c1, DROP c2;// 删除字段‘c1’和‘c2’，使用逗号隔开
Query OK, 0 rows affected (0.15 sec) // 删除成功
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users1; // 再次查看发现已经没有字段‘c1’和‘c2’
+----------+-------------------+------+-----+---------+----------------+
| Field    | Type              | Null | Key | Default | Extra          |
+----------+-------------------+------+-----+---------+----------------+
| id       | smallint unsigned | NO   | PRI | NULL    | auto_increment |
| username | varchar(10)       | NO   |     | NULL    |                |
| password | varchar(20)       | NO   |     | NULL    |                |
| pid      | smallint unsigned | YES  | MUL | NULL    |                |
| age      | tinyint unsigned  | NO   |     | NULL    |                |
+----------+-------------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)
```

---
## 三、修改列定义

### 3.1修改列的数据类型或列位置
```
// 语法
ALTER TABLE tbl_name MODIFY [COLUMN] col_name column_definition [FIRST | AFTER col_name]

// 示例-将‘users2’表中的id字段移动到首位
// 1、查看‘users2’表发现‘id’字段不是第一列
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

root@localhost test > ALTER TABLE users2 MODIFY id  SMALLINT UNSIGNED NOT NULL FIRST; // 将‘id’字段移动到表首列
Query OK, 0 rows affected (0.09 sec)// 成功
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW CREATE TABLE users2; // 再次查看发现‘id’字段已经位于表首列
+--------+--------------------------------------------------------------------------------+
| Table  | Create Table|
+--------+--------------------------------------------------------------------------------+
| users2 | CREATE TABLE `users2` (
  `id` smallint unsigned NOT NULL,
  `username` varchar(10) NOT NULL,
  `pid` smallint unsigned DEFAULT NULL,
  `age` tinyint unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
+--------+--------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```
---
### 3.2、修改列名称与列定义

```
// 语法
ALTER TABLE tbl_name CHANGE [COLUMN] old_col_name new_col_name column_definition [FIRST |  AFTER col_name]

//示例-将‘users2’表中的‘pid’字段修改为‘p_id’，并修改类型为‘TINYINT’
root@localhost test > ALTER TABLE users2 CHANGE pid p_id TINYINT UNSIGNED NOT NULL;
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0

root@localhost test > SHOW COLUMNS FROM users2;
+----------+-------------------+------+-----+---------+-------+
| Field    | Type              | Null | Key | Default | Extra |
+----------+-------------------+------+-----+---------+-------+
| id       | smallint unsigned | NO   |     | NULL    |       |
| username | varchar(10)       | NO   |     | NULL    |       |
| p_id     | tinyint unsigned  | NO   |     | NULL    |       |// 再次查看发现已经修改成功
| age      | tinyint unsigned  | NO   |     | NULL    |       |
+----------+-------------------+------+-----+---------+-------+
4 rows in set (0.04 sec)
```
---

## 本章小结
约束

按功能划分: NOT NULL、PRIMAY KEY、UNIQUE KEY、DEFAULT、FOREIGN KEY

按数据列的数目划分：表级约束、列级约束
        

