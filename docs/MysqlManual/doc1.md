# MySQL(1)、安装、启动以及基础语句

标签（空格分隔）： mysql

---
日期：2020年8月3日
版本：mysql-8.0.21-winx64
下载地址：https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-8.0.21-winx64.zip

---

[toc]

---


总览

|描述|说明|
|---|---|
|创建数据库|CREATE DATABASE|
|修改数据库|ALTER DATABASE|
|删除数据库|DROP DATABASE|

---

# 一、安装

1、解压 （示例 D:\mysql-8.0.21）
2、设置环境变量：
```
在"系统变量"中新增："MYSQL_HOME"，值为"D:\mysql-8.0.21"
然后在"系统变量-path-编辑"中新增"%MYSQL_HOME%\bin"
```
3、初始化
在D:\mysql-8.0.21/bin 目录中打开管理员命令行(Cmder默认为Shift + Alt + 1)，输入：
```
mysqld --initialize --console
```
执行完毕后会输出
```
λ mysqld --initialize --console
2020-08-03T03:04:00.072994Z 0 [System] [MY-013169] [Server] D:\mysql-8.0.21\bin\mysqld.exe (mysqld 8.0.21) initializing of server in progress as process 3516
2020-08-03T03:04:00.074136Z 0 [Warning] [MY-013242] [Server] --character-set-server: 'utf8' is currently an alias for the character set UTF8MB3, but will be an alias for UTF8MB4 in a future release. Please consider using UTF8MB4 in order to be unambiguous.

2020-08-03T03:04:00.099914Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2020-08-03T03:04:00.915739Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2020-08-03T03:04:03.063579Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: Pfd9of02mr;M
```
其中"Pfd9of02mr"为初始密码

然后输入
```
mysqld install
```
完毕后再输入
```
net start mysql
```
如果出现"MySQL 服务已经启动成功。"说明安装成功

---

# 二、启动与停止mysql

*注意，mysql的所有操作必须在管理员权限的命令行使用，Cmder默认为Shift + Alt + 1*

1、启动
```
net start mysql

/*
λ net start mysql
MySQL 服务正在启动 .
MySQL 服务已经启动成功。
*/
```
2、停止
```
net stop mysql
/*
λ net stop mysql
MySQL 服务正在停止.
MySQL 服务已成功停止。
*/
```

---

# 三、MySQL登录与退出
1、mysql 参数
|         参数       |        描述        |
|--------------------|--------------------|
|-D,--database=name  | 打开指定数据库     |
|--delimiter = name  | 指定分隔符         |
|-h,--host=name      |服务器名称          |
|-p,--password[=name]|密码(-p小写)            |
|-P,--port=#         |端口号(-P大写，默认3306)|
|--prompt=name       |设置提示符          |
|-u,--user=name      |用户名              |
|-V,--version        |输出版本信息并且退出|

### 登录示例、
```
// 在mysql服务启动后
输入 'mysql -uroot -p' 回车
然后输入密码后，登录成功
/*
λ mysql -uroot -p
Enter password: *******
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.21 MySQL Community Server - GPL

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
*/
```

---

### 退出示例、
```
exit;
// or
quit;
// or
\q;
```
### 修改密码、


```
// 登录后：
mysql> set password for root@localhost = '123'; // 将密码修改为'123'
Query OK, 0 rows affected (0.01 sec)
```

---

# 四、修改MySQL提示符

1、直接在登录时指定 '--prompt' 参数

例如：
```
mysql -uroot -p --prompt hello
```

2、登录后使用'prompt'
```
>mysqlprompt world // 直接输入 'prompt world'
PROMPT set to 'world' // 显示设置成功
world // 这时提示符变为'world'
```
也可以参照下表输入参数来显示对应的内容(可以填写多项，但是注意分隔以方便查看)

|参数|描述|
|---|---|
|\D|完整的日期|
|\d|当前数据库|
|\h|服务器名称|
|\u|当前用户|

```
// 示例
>mysqlprompt \u@\h \d> // 显示当前用户@服务器名称 当前数据库> 为提示符
PROMPT set to '\u@\h \d>' // 设置成功
root@localhost (none)> // 显示对应的提示符
```

---

# 五、MySQL常用命令以及语法规范
---

## （一）、常用命令
---

### 1、显示当前服务器版本
SELECT VERSION();
```
// 示例
mysql>SELECT VERSION();
+-----------+
| VERSION() |
+-----------+
| 8.0.21    |
+-----------+
1 row in set (0.00 sec)
```

### 2、显示当前日期时间
SELECT NOW();
```
// 示例
mysql>SELECT NOW();
+---------------------+
| NOW()               |
+---------------------+
| 2020-08-05 14:54:52 |
+---------------------+
1 row in set (0.00 sec)
```

### 3、显示当前用户
SELECT USER();
```
// 示例
mysql>SELECT USER();
+----------------+
| USER()         |
+----------------+
| root@localhost |
+----------------+
1 row in set (0.00 sec)
```

---
## （二）、MySQL语句的规范
---
* 关键字与函数名称全部大写
* 数据库名称、表名称、字段名称全部小写
* SQL语句必须以分号结尾

