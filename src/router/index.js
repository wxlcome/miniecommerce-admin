import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
import createEditRouter from "./modules/createEdit";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "首页",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
    ],
  },

  {
    path: "/system",
    component: Layout,
    redirect: "/system/advertisement",
    name: "System",
    meta: {
      title: "系统管理",
      icon: "nested",
    },
    children: [
      {
        path: "advertisement",
        component: () => import("@/views/system/advertisement/index"),
        name: "Advertisement",
        meta: { title: "广告" },
      },
      {
        path: "coupon",
        component: () => import("@/views/system/coupon/index"),
        name: "Coupon",
        meta: { title: "优惠券" },
      },
    ],
  },

  createEditRouter, // 创建或编辑组件路由

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
