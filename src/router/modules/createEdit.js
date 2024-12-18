import Layout from "@/layout";
const createEditRouter = {
  path: "",
  component: Layout,
  name: "createEdit",
  hidden: true,
  children: [
    //广告
    {
      path: "/system/advertisement/createAdvertisement",
      component: () =>
        import("@/views/system/advertisement/CreateOrEditAdvertisement"),
      name: "CreateEditAdvertisement",
      meta: { title: "广告-添加" },
      hidden: true,
    },
    {
      path: "/system/advertisement/editAdvertisement",
      component: () =>
        import("@/views/system/advertisement/CreateOrEditAdvertisement"),
      name: "CreateEditAdvertisement",
      meta: { title: "广告-编辑" },
      hidden: true,
    },

    //优惠券
    {
      path: "/system/coupon/createCoupon",
      component: () => import("@/views/system/coupon/CreateOrEditCoupon"),
      name: "CreateEditCoupon",
      meta: { title: "优惠券-添加" },
      hidden: true,
    },
    {
      path: "/system/coupon/editCoupon",
      component: () => import("@/views/system/coupon/CreateOrEditCoupon"),
      name: "CreateEditCoupon",
      meta: { title: "优惠券-编辑" },
      hidden: true,
    },

    //快递信息
    {
      path: "/system/express/detail",
      component: () => import("@/views/system/express/ExpressDetail"),
      name: "ExpressDetail",
      meta: { title: "快递信息-详情" },
      hidden: true,
    },

    //反馈
    {
      path: "/system/feedback/detail",
      component: () => import("@/views/system/feedback/FeedbackDetail"),
      name: "FeedbackDetail",
      meta: { title: "反馈-详情" },
      hidden: true,
    },
    //活动
    {
      path: "/system/operation/createOperation",
      component: () => import("@/views/system/operation/CreateOrEditOperation"),
      name: "CreateEditOperation",
      meta: { title: "活动-添加" },
      hidden: true,
    },
    {
      path: "/system/operation/editOperation",
      component: () => import("@/views/system/operation/CreateOrEditOperation"),
      name: "CreateEditOperation",
      meta: { title: "活动-编辑" },
      hidden: true,
    },
  ],
};

export default createEditRouter;
