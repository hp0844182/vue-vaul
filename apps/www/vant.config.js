module.exports = {
  name: 'YLui',
  build: {
    css: {
      preprocessor: 'less',
    },
    site: {
      publicPath: '/tta/',
    },
  },
  site: {
    title: 'tta',
    logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
    nav: [
      {
        title: '开发指南',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
          {
            path: 'quickstart',
            title: '快速上手',
          },
        ],
      },
      {
        title: '基础组件',
        items: [
          {
            path: 'vaul',
            title: 'vaul 抽屉',
          },
        ],
      },
    ],
  },
};
