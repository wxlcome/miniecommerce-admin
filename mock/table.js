const Mock = require("mockjs");

// const data = Mock.mock({
//   'items|30': [{
//     id: '@id',
//     title: '@sentence(10, 20)',
//     'status|1': ['published', 'draft', 'deleted'],
//     author: 'name',
//     display_time: '@datetime',
//     pageviews: '@integer(300, 5000)'
//   }]
// })

const data = Mock.mock({
  "items|10": [
    {
      id: "@id",
      goodsNo: "@guid",
      goodsId: "@id",
      goodsName: "@word(5, 10)",
      title: "@title(5,10)",
      description: "@sentence(5, 10)",
      index: "@integer(0, 10)",
      status: "@integer(0, 1)",
    },
  ],
});

module.exports = [
  {
    url: "/vue-admin-template/table/list",
    type: "get",
    response: (config) => {
      const items = data.items;
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items,
        },
      };
    },
  },
];
