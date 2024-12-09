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
  ],
};

export default createEditRouter;
