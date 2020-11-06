module.exports = {
  title: 'Mysql手册',
  description: 'Mysql手册',
  themeConfig: {
    nav: [
      {
        text: 'MysqlManual',
        link: '/MysqlDoc',
        items: [
          { text: 'MySQL(1)、安装、启动以及基础语句', link: '/MysqlManual/doc1' },
          { text: 'MySQL(2)、数据库操作', link: '/MysqlManual/doc2' },
        ],
      },
    ],
    sidebar: [
      {
        title: 'Mysql手册',   // 必要的
        path: '/MysqlManual',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          '/MysqlManual/doc1',
          '/MysqlManual/doc2'
        ]
      }
    ]
  }
};
