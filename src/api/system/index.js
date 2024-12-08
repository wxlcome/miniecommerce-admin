import request from "@/utils/request";

export default {
  //上传图片
  uploadImg(data) {
    return request({
      url: "/system-server/system/oss/uploadimage",
      method: "post",
      data,
    });
  },
  //保存或更新广告
  advertisementSaveorupdate(data) {
    return request({
      url: "/web-admin/admin/system/advertisement/saveorupdate",
      method: "post",
      data,
    });
  },
  //分页查询广告
  pageAdvertisement(data) {
    return request({
      url: "/web-admin/admin/system/advertisement/page",
      method: "post",
      data,
    });
  },
  //根据id查询广告
  getAdvertisementById(id) {
    return request({
      url: `/web-admin/admin/system/advertisement/${id}`,
      method: "get",
    });
  },
  //根据id删除广告
  delteAdvertisementById(id) {
    return request({
      url: `/web-admin/admin/system/advertisement/${id}`,
      method: "delete",
    });
  },
};
