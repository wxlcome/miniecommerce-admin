<template>
  <div class="app-container" style="position: relative">
    <el-card>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input
            v-model="formData.couponName"
            maxlength="64"
            show-word-limit
            clearable
            style="width: 400px !important"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="优惠券类型" prop="couponType">
          <el-select
            v-model="formData.couponType"
            style="width: 400px !important"
          >
            <el-option
              v-for="(val, key) in CouponTypeEnum"
              :key="key"
              :label="val.key"
              :value="val.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="搜索商品">
          <el-select
            v-model="formData.goodsId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称或编码搜索"
            style="width: 400px !important"
            :remote-method="remoteGoodsList"
            :loading="goodsLoading"
            @change="changeGoods"
          >
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="item.goodsName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品id" v-show="false" prop="goodsId">
          <el-input
            disabled
            v-model="formData.goodsId"
            style="width: 400px !important"
          />
        </el-form-item>

        <el-form-item label="商品编号" prop="goodsNo">
          <el-input
            disabled
            v-model="formData.goodsNo"
            style="width: 400px !important"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input
            disabled
            v-model="formData.goodsName"
            style="width: 400px !important"
          />
        </el-form-item>

        <el-form-item label="金额" prop="number">
          <el-input-number
            v-model="formData.number"
            :precision="2"
            :step="0.1"
            :max="999"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio
            v-model="formData.status"
            :label="StatusEnum.OFFLINE.value"
            border
            size="medium"
            >{{ StatusEnum.OFFLINE.key }}</el-radio
          >
          <el-radio
            v-model="formData.status"
            :label="StatusEnum.ONLINE.value"
            border
            size="medium"
            >{{ StatusEnum.ONLINE.key }}</el-radio
          >
        </el-form-item>

        <el-form-item class="actions">
          <el-button type="primary" round @click="saveback">保存</el-button>
          <el-button v-if="!queryId" type="primary" round @click="saveContinue"
            >保存并继续添加</el-button
          >
          <el-button type="info" round @click="close">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from "@/api/system";
import { Message } from "element-ui";
const Mock = require("mockjs");

//优惠券类型枚举
const CouponTypeEnum = {
  WHOLE: { key: "全场券", value: 1 },
  SINGLE: { key: "单品券", value: 2 },
};
//状态枚举
const StatusEnum = {
  OFFLINE: { key: "下线", value: 0 },
  ONLINE: { key: "上线", value: 1 },
};

export default {
  name: "CreateEditCoupon",
  data() {
    return {
      queryId: this.$route.query.id,
      CouponTypeEnum,
      StatusEnum,
      //商品加载
      goodsLoading: true,
      //已选择的商品
      selectedGoods: {},
      //商品搜索结果
      goodsList: [],
      //表单数据
      formData: {
        couponName: "",
        couponType: "",
        goodsId: "",
        goodsNo: "",
        goodsName: "",
        number: "",
        status: "",
      },
      rules: {
        couponName: [
          { required: true, message: "优惠券名称不能为空", trigger: "blur" },
        ],
        couponType: [
          { required: true, message: "优惠券类型不能为空", trigger: "blur" },
        ],
        goodsNo: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.couponType === CouponTypeEnum.SINGLE.value) {
                if (value == "")
                  callback(new Error("单品券的商品编号不能为空"));
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        goodsName: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.couponType === CouponTypeEnum.SINGLE.value) {
                if (value == "")
                  callback(new Error("单品券的商品名称不能为空"));
              }
              callback();
            },
            trigger: "blur",
          },
        ],
        number: [{ required: true, message: "金额不能为空", trigger: "blur" }],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    //获取编辑的广告信息
    getEditInfo() {
      api.getCouponById(this.queryId).then((resp) => {
        this.formData = resp.data;
      });
    },
    //远程搜索商品列表
    remoteGoodsList() {
      const data = Mock.mock({
        "items|10": [
          {
            id: "@id",
            goodsNo: "@guid",
            goodsName: "@word(5, 10)",
          },
        ],
      });
      this.goodsList = data.items;
      this.goodsLoading = false;
    },
    //改变商品
    changeGoods(goodsId) {
      const goods = this.goodsList.find((val) => val.id == goodsId);
      this.formData.goodsNo = goods.goodsNo;
      this.formData.goodsName = goods.goodsName;
    },
    //关闭组件
    close() {
      //调用全局挂载的方法，关闭当前页
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    //保存
    save(func) {
      this.$refs["form"].validate((flag, field) => {
        if (flag) {
          api.couponSaveorupdate(this.formData).then((resp) => {
            Message({
              message: `${this.queryId ? "编辑" : "添加"}成功`,
              type: "success",
              duration: 1000,
            });
            func();
          });
        }
      });
    },
    //保存退出
    saveback() {
      this.save(() => {
        this.close();
        this.refresh((fullPath) => {
          this.$nextTick(() => {
            this.$router.replace({
              path: fullPath,
            });
          });
        });
      });
    },
    //保存继续添加
    saveContinue() {
      this.save(() => {
        this.$refs["form"].resetFields();
        this.refresh(() => {});
      });
    },
    //刷新调用页面
    refresh(func) {
      this.$store.dispatch("tagsView/delCachedView", this.prevView).then(() => {
        const { fullPath } = this.prevView;
        func(fullPath);
      });
    },
  },

  mounted() {
    if (this.queryId) this.getEditInfo();
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevView = from;
    });
  },
};
</script>

<style>
.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-uploader .el-upload:hover {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 400px;
  height: 250px;
  line-height: 250px;
  text-align: center;
}
.image {
  width: 350px;
  /* height: 300px; */
  display: block;
}
.preview {
  margin: auto;
  width: 700px;
  /* height: 300px; */
  display: block;
  position: absolute;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgrey;
}
.preview-img {
  width: 100%;
}
.preview-header {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  font-size: 20px;
  font-weight: bolder;
  color: red;
}

.preview-introduct {
  width: 100%;
  position: absolute;
  top: 75%;
  left: 50%;
  padding: 10px;
  transform: translate(-50%, -50%);
}

.preview-title {
  width: 100%;
  font-size: 30px;
  font-weight: bolder;
}

.preview-description {
  width: 100%;
  font-size: 20px;
  word-wrap: break-word;
}
</style>