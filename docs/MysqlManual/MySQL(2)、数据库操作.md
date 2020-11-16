---
title: MySQL(2)、数据库操作
date: 2020-11-06 15:33:07
permalink: /pages/db51de/
categories:
  - MysqlManual
tags:
  - 
---
# MySQL(2)、数据库操作

标签（空格分隔）： mysql

---

[toc]

---


## 一、查看当前的数据库列表
```
// 语法结构
SHOW {DATABASES | SCHEMAS} 
[LIKE 'pattern' | WHERE expr]

// 示例
mysql>SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| t1                 |
+--------------------+
5 rows in set (0.04 sec)
```
---

## 二、打开数据库

```
// 语法
USE db_name;

// 示例
root@localhost (none)> USE t1;// 输入命令
Database changed // 提示数据库切换成功
root@localhost t1> // 提示符也已经转变为 t1
```
### 查看当前打开的数据库

```
// 语句
SELECT DATABASE();

// 示例
root@localhost t1> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| t1         |
+------------+
1 row in set (0.00 sec)
```
---

## 三、数据库基础操作

### 3.1、创建数据库
```
// 语法结构
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name [DEFAULT] CHARACTER SET [=] charset_name

// 示例
mysql>CREATE DATABASE t1; // 创建一个名为‘t1’的数据库
Query OK, 1 row affected (0.04 sec) // 提示创建成功
```

参数说明:
1. DATABASE | SCHEMA: ??
2. IF NOT EXISTS: 如果创建的数据库已存在，那么将不会显示报错信息
```
// 假如我们已经有一个名为't1'的数据库
mysql>CREATE DATABASE t1; // 再次创建 't1'数据库
ERROR 1007 (HY000): Can't create database 't1'; database exists // 创建失败

mysql>CREATE DATABASE IF NOT EXISTS t1; // 添加 'IF NOT EXISTS'再次添加

Query OK, 1 row affected, 1 warning (0.04 sec) // 将不会显示报错
// 如果想查看报错信息，可以使用'SHOW WARNINGS;'
mysql>SHOW WARNINGS;
+-------+------+---------------------------------------------+
| Level | Code | Message                                     |
+-------+------+---------------------------------------------+
| Note  | 1007 | Can't create database 't1'; database exists |
+-------+------+---------------------------------------------+
1 row in set (0.00 sec)
```
3. [DEFAULT] CHARACTER SET [=] charset_name 主要用来设置编码方式，如果不写默认为my.ini中设置的格式
```
// 查看数据库创建时的语句,可以看到数据库编码格式
mysql>SHOW CREATE DATABASE t1;
+----------+-------------------+
| Database | Create Database  |
+----------+----------------------------------+
| t1       | CREATE DATABASE `t1` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */ |
+----------+-------------------+
1 row in set (0.00 sec)
```
创建一个'gbk'格式的数据库
```
mysql>CREATE DATABASE IF NOT EXISTS t2 CHARACTER SET gbk; // 设置数据库 't2'格式为'gbk'
Query OK, 1 row affected (0.01 sec) // 创建成功

mysql>SHOW CREATE DATABASE t2; // 查看数据库 't2' 创建时的语句
+----------+-------------------------------------------+
| Database | Create Database|
+----------+--------------------------------------------+
| t2       | CREATE DATABASE `t2` /*!40100 DEFAULT CHARACTER SET gbk */ /*!80016 DEFAULT ENCRYPTION='N' */ |
+----------+-------------------------------------------------------------------+
1 row in set (0.00 sec)
```
---
### 3.2、修改数据库
```
// 语法结构
ALTER {DATABASE | SCHEMA} [db_name] [DEFAULT] CHARACTER SET [=] charset_name
```
示例
```
mysql>ALTER DATABASE t2 CHARACTER SET utf8; // 修改数据库 't2'编码为'utf8'
Query OK, 1 row affected, 1 warning (0.04 sec) // 修改成功

mysql>SHOW CREATE DATABASE t2; // 再次查看数据库 't2'的编码，发现已经被改为'utf8'
+----------+--------+
| Database | Create Database|
+----------+--------+
| t2       | CREATE DATABASE `t2` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */ |
+----------+--------+
1 row in set (0.00 sec)
```
---
### 3.3、删除数据库
```
// 语法结构
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```
示例
```
mysql>DROP DATABASE t1; // 删除数据库 't1'
Query OK, 0 rows affected (0.05 sec) // 删除成功

mysql>SHOW CREATE DATABASE t1; // 查看数据库't1'的数据
ERROR 1049 (42000): Unknown database 't1'  // 报错

mysql>SHOW DATABASES; // 查看所有数据库列表发现已经没有't1'
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| t2                 |
+--------------------+
5 rows in set (0.00 sec)
```
---

## 四、其它操作

---

### 导入与导出数据
[参考链接][1]
创建新库并重新导入
当数据库体积比较小时，最快的方法通常是使用 mysqldump 命令来创建整个数据库的转存副本，然后新建数据库，再把副本导入到新数据库中。

mysqldump 命令是 MySQL 自带的逻辑备份工具，它的备份原理是通过命令连接到 MySQL 数据库，将需要备份的数据导出来，将导出来的数据转换成对应的 insert 语句，当我们需要还原这些数据时，只要执行这些 insert 语句，即可将对应的数据还原。

第一步：

$ mysqldump -u username -p"password" -R oldDbName > oldDbName.sql
首先我们将需要改名的数据库中的数据导出。我们使用-p 来标示密码，注意-p 和密码之间没有空格。-R 告诉mysqldump 备份存储过程(-- routines)

第二步：使用mysqldump 命令创建一个新的数据库并以我们需要的名字命名。

$ mysqladmin -u username -p"password" create newDbName
第三步：在新创建的数据库中，导入旧数据库中的数据。

$ mysql -u username -p"password" newDbName < oldDbName.sql
以上三个基本命令执行完毕后，确认所有数据都以在新库中就绪，然后就可以删除旧数据库。
```
示例-将数据库‘todos’导出为‘todos.sql’，并导入数据库‘simple_account_book’

mysqldump -u root -p -R todos > todos.sql // 导出为‘todos.sql’
Enter password: ******

mysqladmin -u root -p create simple_account_book // 创建数据库‘simple_account_book’
Enter password: ******

 mysql -u root -p simple_account_book < todos.sql // 导入‘todos.sql’
Enter password: ******

// 登录mysql后查看所有数据库
mysql> SHOW DATABASES;
+---------------------+
| Database            |
+---------------------+
| information_schema  |
| mysql               |
| performance_schema  |
| simple_account_book | // 创建成功
| sys                 |
| t1                  |
| test                |
| todos               |
+---------------------+
8 rows in set (0.00 sec)

mysql> use simple_account_book;
Database changed
mysql> SHOW TABLES; // 查看数据表
+-------------------------------+
| Tables_in_simple_account_book |
+-------------------------------+
| list                          |
+-------------------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM list; // 查看所有数据
+----+-------------+---------+
| id | content     | is_done |
+----+-------------+---------+
|  1 | 学习MySQL   |       0 |
|  2 | 学习React   |       0 |
+----+-------------+---------+
2 rows in set (0.00 sec)
```


  [1]: https://kalasearch.cn/community/tutorials/how-to-rename-a-database-in-mysql/