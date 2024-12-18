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
      url: "/system-server/system/advertisement/admin/saveorupdate",
      method: "post",
      data,
    });
  },
  //分页查询广告
  pageAdvertisement(data) {
    return request({
      url: "/system-server/system/advertisement/admin/page",
      method: "post",
      data,
    });
  },
  //根据id查询广告
  getAdvertisementById(id) {
    return request({
      url: `/system-server/system/advertisement/admin/${id}`,
      method: "get",
    });
  },
  //根据id删除广告
  delteAdvertisementById(id) {
    return request({
      url: `/system-server/system/advertisement/admin/${id}`,
      method: "delete",
    });
  },

  //保存或更新优惠券
  couponSaveorupdate(data) {
    return request({
      url: "/system-server/system/coupon/admin/saveorupdate",
      method: "post",
      data,
    });
  },
  //分页查询优惠券
  pageCoupon(data) {
    return request({
      url: "/system-server/system/coupon/admin/page",
      method: "post",
      data,
    });
  },
  //根据id查询优惠券
  getCouponById(id) {
    return request({
      url: `/system-server/system/coupon/admin/${id}`,
      method: "get",
    });
  },
  //根据id删除优惠券
  delteCouponById(id) {
    return request({
      url: `/system-server/system/coupon/admin/${id}`,
      method: "delete",
    });
  },
  //分页查询快递信息
  pageExpressInfo(data) {
    return request({
      url: "/system-server/system/expressinfo/admin/page",
      method: "post",
      data,
    });
  },
  //根据id查询快递信息
  getExpressInfoById(id) {
    return request({
      url: `/system-server/system/expressinfo/admin/${id}`,
      method: "get",
    });
  },
  //分页查询反馈
  pageFeedback(data) {
    return request({
      url: "/system-server/system/feedback/admin/page",
      method: "post",
      data,
    });
  },
  //根据id查询反馈
  getFeedbackById(id) {
    return request({
      url: `/system-server/system/feedback/admin/${id}`,
      method: "get",
    });
  },
  //分页查询活动
  pageOperation(data) {
    return request({
      url: "/system-server/system/operation/admin/page",
      method: "post",
      data,
    });
  },
  //保存或更新活动
  operationSaveorupdate(data) {
    return request({
      url: "/system-server/system/operation/admin/saveorupdate",
      method: "post",
      data,
    });
  },
  //根据id查询活动
  getOperationById(id) {
    return request({
      url: `/system-server/system/operation/admin/${id}`,
      method: "get",
    });
  },
};
