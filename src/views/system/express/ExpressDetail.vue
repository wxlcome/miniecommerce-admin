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
        <el-form-item label="快递编号" prop="expressNo">
          <el-input
            v-model="formData.expressNo"
            disabled
            style="width: 400px !important"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="快递公司"
          style="width: 300px !important"
          prop="company"
        >
          <el-descriptions class="margin-top" :column="1" size="small" border>
            <el-descriptions-item
              :labelStyle="{ textAlign: 'center', width: '80px' }"
            >
              <template slot="label">图标</template>
              <img :src="formData.company.companyIcon" width="24" />
            </el-descriptions-item>
            <el-descriptions-item
              :labelStyle="{ textAlign: 'center', width: '80px' }"
            >
              <template slot="label">编号</template>
              {{ formData.company.companyCode }}
            </el-descriptions-item>
            <el-descriptions-item
              :labelStyle="{ textAlign: 'center', width: '80px' }"
            >
              <template slot="label">名称</template>
              {{ formData.company.companyName }}
            </el-descriptions-item>
          </el-descriptions>
        </el-form-item>

        <el-form-item label="快递类型" prop="expressType">
          <el-select
            v-model="formData.expressType"
            disabled
            style="width: 400px !important"
          >
            <el-option
              v-for="(val, key) in ExpressTypeEnum"
              :key="key"
              :label="val.key"
              :value="val.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="地址信息"
          style="width: fit-content !important"
          prop="company"
        >
          <el-collapse>
            <el-collapse-item title="发货地址" name="1">
              <div style="font-size: 16px; font-weight: bolder">
                {{ formData.expressAddr.senderName }}
                {{ formData.expressAddr.senderPhone }}
              </div>
              <div style="font-size: 16px; font-weight: bold; color: gray">
                {{ formData.expressAddr.senderProvinceName }}
                {{ formData.expressAddr.senderCityName }}
                {{ formData.expressAddr.senderDistrictName }}
              </div>
              <div>{{ formData.expressAddr.senderDetailAddr }}</div>
            </el-collapse-item>
            <el-collapse-item title="收货地址" name="2">
              <div style="font-size: 16px; font-weight: bolder">
                {{ formData.expressAddr.receiverName }}
                {{ formData.expressAddr.receiverPhone }}
              </div>
              <div style="font-size: 16px; font-weight: bold; color: gray">
                {{ formData.expressAddr.receiverProvinceName }}
                {{ formData.expressAddr.receiverCityName }}
                {{ formData.expressAddr.receiverDistrictName }}
              </div>
              <div>{{ formData.expressAddr.receiverDetailAddr }}</div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <el-form-item
          label="发/收货仓库"
          style="width: 500px !important"
          prop="company"
        >
          <el-descriptions class="margin-top" :column="1" size="small" border>
            <el-descriptions-item
              :labelStyle="{ textAlign: 'center', width: '80px' }"
            >
              <template slot="label">名称</template>
              {{ formData.warehouse.name }}
            </el-descriptions-item>
            <el-descriptions-item
              :labelStyle="{ textAlign: 'center', width: '80px' }"
            >
              <template slot="label">联系方式</template>
              {{ formData.warehouse.phone }}
            </el-descriptions-item>
            <el-descriptions-item
              :labelStyle="{ textAlign: 'center', width: '80px' }"
            >
              <template slot="label">省/市/区</template>
              {{ formData.warehouse.provinceName }}
              {{ formData.warehouse.cityName }}
              {{ formData.warehouse.districtName }}
            </el-descriptions-item>
            <el-descriptions-item
              :labelStyle="{ textAlign: 'center', width: '80px' }"
            >
              <template slot="label">详细地址</template>
              {{ formData.warehouse.detailAddress }}
            </el-descriptions-item>
          </el-descriptions>
        </el-form-item>

        <el-form-item
          label="快递动态"
          style="width: fit-content !important; max-width: 800px"
          prop="company"
        >
          <el-collapse>
            <el-collapse-item title="动态时间线" name="1">
              <el-timeline>
                <el-timeline-item
                  v-for="item in formData.trends"
                  type="primary"
                  :timestamp="item.time"
                  placement="top"
                >
                  {{ item.status }}
                </el-timeline-item>
              </el-timeline>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio
            :disabled="formData.status != StatusEnum.NOT.value"
            v-model="formData.status"
            :label="StatusEnum.NOT.value"
            border
            size="medium"
            >{{ StatusEnum.NOT.key }}</el-radio
          >
          <el-radio
            :disabled="formData.status != StatusEnum.GOT.value"
            v-model="formData.status"
            :label="StatusEnum.GOT.value"
            border
            size="medium"
            >{{ StatusEnum.GOT.key }}</el-radio
          >
        </el-form-item>

        <el-form-item class="actions">
          <el-button type="info" round @click="close">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from "@/api/system";

//快递类型枚举
const ExpressTypeEnum = {
  BACK: { key: "退货", value: 1 },
  SEND: { key: "发货", value: 2 },
};
//状态枚举
const StatusEnum = {
  NOT: { key: "未收货", value: 0 },
  GOT: { key: "已收货", value: 1 },
};

export default {
  name: "ExpressDetail",
  data() {
    return {
      queryId: this.$route.query.id,
      ExpressTypeEnum,
      StatusEnum,
      //表单数据
      formData: {
        expressNo: "",
        company: {
          companyIcon: "",
          companyCode: "",
          companyName: "",
        },
        expressType: "",
        expressAddr: {
          senderName: "",
          senderPhone: "",
          senderProvinceName: "",
          senderCityName: "",
          senderDistrictName: "",
          senderDetailAddr: "",
          receiverName: "",
          receiverPhone: "",
          receiverProvinceName: "",
          receiverCityName: "",
          receiverDistrictName: "",
          receiverDetailAddr: "",
        },
        warehouse: {
          name: "",
          provinceName: "",
          cityName: "",
          districtName: "",
          detailAddress: "",
          phone: "",
        },
        trends: [],
        status: "",
      },
      rules: {},
    };
  },
  methods: {
    //获取快递信息
    getDetailInfo() {
      api.getExpressInfoById(this.queryId).then((resp) => {
        this.formData = resp.data;
      });
    },
    //关闭组件
    close() {
      //调用全局挂载的方法，关闭当前页
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
  },

  mounted() {
    if (this.queryId) this.getDetailInfo();
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
.el-timeline-item__content {
  font-size: 13px;
}
</style>