module.exports = {
  title: 'Mysql手册',
  description: 'Mysql手册',
  themeConfig: {
    nav: [
      {
        text: 'MysqlManual',
        link: '/',
        items: [
          { text: 'MySQL(1)、安装、启动以及基础语句', link: '/MysqlManual/doc1' },
          { text: 'MySQL(2)、数据库操作', link: '/MysqlManual/doc2' },
          { text: 'MySQL(3)、数据表操作1（数据表的增删改查）', link: '/MysqlManual/doc3' },
          { text: 'MySQL(4)、数据表操作2（列操作和数据表更改）', link: '/MysqlManual/doc4'},
          { text: 'MySQL(5)、约束的使用', link: '/MysqlManual/doc5'},
          { text: 'MySQL(6)、操作数据表中的记录', link: '/MysqlManual/doc6'},
          { text: 'MySQL(附录1)、数据类型', link: '/MysqlManual/appendix1'},
          { text: 'MySQL(附录2)、常见问题', link: '/MysqlManual/appendix2'}
        ],
      },
    ],
    sidebar: [
      {
        title: 'Mysql手册', // 必要的
        path: '/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2, // 可选的, 默认值是 1
        children: [
          '/MysqlManual/doc1',
          '/MysqlManual/doc2',
          '/MysqlManual/doc3',
          '/MysqlManual/doc4',
          '/MysqlManual/doc5',
          '/MysqlManual/doc6',
          '/MysqlManual/appendix1',
          '/MysqlManual/appendix2'
        ]
      }
    ]
  }
};
