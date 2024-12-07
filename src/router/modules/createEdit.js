import Layout from "@/layout";
import { title } from "@/settings";
const createEditRouter = {
  path: "",
  component: Layout,
  name: "createEdit",
  hidden: true,
  children: [
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
  ],
};

export default createEditRouter;
