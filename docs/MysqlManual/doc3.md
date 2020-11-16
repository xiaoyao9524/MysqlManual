# MySQL(3)、数据表操作1（数据表的增删改查）

标签（空格分隔）： mysql

---
## 一、查看当前数据库的数据表列表
```
// 语句
SHOW TABLES [FROM db_name]
[LIKE 'pattern' | WHERE expr]

// 示例
root@localhost t1> SHOW TABLES;
+--------------+
| Tables_in_t1 |
+--------------+
| tb1          |
+--------------+
1 row in set (0.00 sec)

// 示例2
root@localhost t1> SHOW TABLES FROM mysql; // 查看mysql数据库中所有的表列表
+---------------------------+
| Tables_in_mysql           |
+---------------------------+
| columns_priv              |
| component                 |
| db                        |
| default_roles             |
| engine_cost               |
| func                      |
| general_log               |
| global_grants             |
| gtid_executed             |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| innodb_index_stats        |
| innodb_table_stats        |
| password_history          |
| plugin                    |
| procs_priv                |
| proxies_priv              |
| role_edges                |
| server_cost               |
| servers                   |
| slave_master_info         |
| slave_relay_log_info      |
| slave_worker_info         |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
+---------------------------+
33 rows in set (0.00 sec)
```
---

## 二、创建数据表

```
// 语句
CREATE TABLE [IF NOT EXISTS] table_name (
    column_name data_type,
    ...
)

// 示例
root@localhost t1> CREATE TABLE tb1( // 创建一个名为'tb1'的数据表
    -> username VARCHAR(20), // 定义字段名'username' 类型为 VARCHAR 20个字符（4.x为字节，5.x为字符）
    -> age TINYINT UNSIGNED, // 定义字段名'age' 类型为 TINYINT,无符号（只有正数）
    -> salary FLOAT(8, 2) UNSIGNED // 定义字段名'salary' 类型为 FLOAT(最大8位+小数点2位),无符号（只有正数），最后一项后面无需加逗号
    -> ); // 结束
Query OK, 0 rows affected, 2 warnings (0.04 sec) // 提示添加成功
```

### 查看创建数据表时的语句
SHOW CREATE TABLE table_name;
```
// 示例
root@localhost t1> SHOW CREATE TABLE tb1;
+-------+-------------------------------------------+
| Table | Create Table                              |
+-------+-------------------------------------------+
| tb1   | CREATE TABLE `tb1` (
  `username` varchar(20) DEFAULT NULL,
  `age` tinyint unsigned DEFAULT NULL,
  `salary` float(8,2) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
+-------+-------------------------------------------+
1 row in set (0.04 sec)
```

---

## 三、查看数据表结构

```
// 语法
SHOW COLUMNS FROM tbl_name;
// 示例
root@localhost t1> SHOW COLUMNS FROM tb1;
+----------+---------------------+------+-----+---------+-------+
| Field    | Type                | Null | Key | Default | Extra |
+----------+---------------------+------+-----+---------+-------+
| username | varchar(20)         | YES  |     | NULL    |       |
| age      | tinyint unsigned    | YES  |     | NULL    |       |
| salary   | float(8,2) unsigned | YES  |     | NULL    |       |
+----------+---------------------+------+-----+---------+-------+
3 rows in set (0.01 sec)
```
---
## 四、删除数据表
```
root@localhost test > SHOW TABLES; // 首先查看现有数据表
+----------------+
| Tables_in_test |
+----------------+
| provinces      |
| t1             |
| test           |
| test2          |
| users          |
| users1         |
| users2         |
+----------------+
7 rows in set (0.00 sec)

root@localhost test > DROP TABLE test2; // 删除'test2'表
Query OK, 0 rows affected (0.07 sec) // 删除成功

root@localhost test > SHOW TABLES; // 再次查看数据表列表，发现已经没有了'test2'表
+----------------+
| Tables_in_test |
+----------------+
| provinces      |
| t1             |
| test           |
| users          |
| users1         |
| users2         |
+----------------+
6 rows in set (0.00 sec)
```
---
## 五、数据表更名
```
// 语句1
ALTER TABLE tbl_name RENAME [TO|AS] new_tbl_name
// 语句2
RENAME TABLE tbl_name TO new_tbl_name [,tbl_name2 TO new_tbl_name2]...
// 示例
// 使用语句1将‘users2’表更改为‘users3’
root@localhost test > ALTER TABLE users2 RENAME users3;
Query OK, 0 rows affected (0.10 sec)

root@localhost test > SHOW TABLES;
+----------------+
| Tables_in_test |
+----------------+
| provinces      |
| users          |
| users1         |
| users3         |// 再次查看发现已经被更改为‘users3’
+----------------+
4 rows in set (0.04 sec)

// 使用语句2将‘users3’表改回‘users2’
root@localhost test > RENAME TABLE users3 TO users2;
Query OK, 0 rows affected (0.06 sec)

root@localhost test > SHOW TABLES;
+----------------+
| Tables_in_test |
+----------------+
| provinces      |
| users          |
| users1         |
| users2         |// 再次查看已经改回‘users2’
+----------------+
4 rows in set (0.00 sec)
```
---
