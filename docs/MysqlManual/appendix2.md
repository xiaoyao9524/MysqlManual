# MySQL(附录2)、常见问题

标签（空格分隔）： mysql

---

[toc]

---

一、egg 链接mysql失败

出错原因
导致这个错误的原因是，目前，最新的mysql模块并未完全支持MySQL 8的“caching_sha2_password”加密方式，而“caching_sha2_password”在MySQL 8中是默认的加密方式。因此，下面的方式命令是默认已经使用了“caching_sha2_password”加密方式，该账号、密码无法在mysql模块中使用。

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
Query OK, 0 rows affected (0.12 sec)

```
解决方法
解决方法是从新修改用户root的密码，并指定mysql模块能够支持的加密方式：
```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
Query OK, 0 rows affected (0.12 sec)
```
上述语句，显示指定了使用“mysql_native_password”的加密方式。这种方式是在mysql模块能够支持。