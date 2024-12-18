<template>
  <div class="app-container" style="position: relative">
    <el-card>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="formData.title"
            maxlength="32"
            show-word-limit
            clearable
            style="width: 400px !important"
          >
            <template slot="append">
              <el-color-picker
                v-model="formData.titleColor"
                @change="(val) => (formData.titleColor = val)"
                size="mini"
              ></el-color-picker
            ></template>
          </el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="5"
            maxlength="200"
            show-word-limit
            style="width: 400px !important"
          />
          <el-color-picker
            v-model="formData.descriptionColor"
            @change="(val) => (formData.descriptionColor = val)"
            size="mini"
          ></el-color-picker>
        </el-form-item>

        <el-form-item label="概念图" prop="ideaImg">
          <el-upload
            class="image-uploader"
            action=""
            accept="image/*"
            :show-file-list="false"
            :http-request="uploadImage"
          >
            <img
              v-if="formData.ideaImg"
              :src="formData.ideaImg"
              class="image"
            />
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="参数" prop="param">
          <el-input
            v-model="formData.param"
            placeholder="折扣比例/秒杀时间"
            clearable
            style="width: 400px !important"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="活动时间" prop="datePicker">
          <el-date-picker
            v-model="formData.datePicker"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="datePickerChange"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="活动类型" prop="operationType">
          <el-select
            v-model="formData.operationType"
            style="width: 400px !important"
          >
            <el-option
              v-for="(val, key) in OperationTypeEnum"
              :key="key"
              :label="val.key"
              :value="val.value"
            >
            </el-option>
          </el-select>
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

        <el-form-item label="活动商品" prop="goodsList">
          <div class="board">
            <OperationDraggable
              :key="1"
              :list.sync="searchGoodsList"
              :group="{ name: 'goods', pull: 'clone', put: true }"
              class="search"
              header-text="搜索商品"
              @search="searchGoods"
            />

            <el-button type="primary" @click="addAllGoods"
              >全部添加 »</el-button
            >

            <OperationDraggable
              :key="2"
              :list.sync="formData.goodsList"
              :group="{ name: 'goods', pull: 'clone', put: true }"
              class="operation"
              header-text="活动商品"
              operation
              @add="addGoods"
              @search="operationGoodsSearch"
            />
          </div>
        </el-form-item>

        <el-form-item class="actions">
          <el-button type="primary" round @click="saveback">保存</el-button>
          <el-button v-if="!queryId" type="primary" round @click="saveContinue"
            >保存并继续添加</el-button
          >
          <el-button type="info" round @click="close">关闭</el-button>
        </el-form-item>
      </el-form>

      <div
        class="preview"
        :style="{ height: formData.ideaImg ? 'fit-content' : '500px' }"
      >
        <img
          v-if="formData.ideaImg"
          :src="formData.ideaImg"
          class="preview-img"
        />
        <span class="preview-header">粗略预览图</span>
        <div class="preview-introduct">
          <span class="preview-title" :style="{ color: formData.titleColor }">{{
            formData.title
          }}</span>
          <p
            class="preview-description"
            :style="{ color: formData.descriptionColor }"
          >
            {{ formData.description }}
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import api from "@/api/system";
import moment from "moment";
import { Message } from "element-ui";
import OperationDraggable from "@/components/OperationDraggable";

const Mock = require("mockjs");

//活动类型枚举
const OperationTypeEnum = {
  DISCOUNT: { key: "折扣", value: 1 },
  SECKILL: { key: "秒杀", value: 2 },
};

//状态枚举
const StatusEnum = {
  OFFLINE: { key: "下线", value: 0 },
  ONLINE: { key: "上线", value: 1 },
};

export default {
  name: "CreateEditOperation",
  components: {
    OperationDraggable,
  },
  data() {
    return {
      StatusEnum,
      OperationTypeEnum,
      queryId: this.$route.query.id,
      //搜索商品列表
      searchGoodsList: [],
      //搜索关键字
      searchKey: "",
      //表单数据
      formData: {
        title: "",
        titleColor: "#000000",
        description: "",
        descriptionColor: "#FFFFFF",
        ideaImg: "",
        operationType: "",
        param: "",
        startTime: "",
        endTime: "",
        status: "",
        goodsList: [],
        datePicker: [],
      },
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        description: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
        ideaImg: [
          { required: true, message: "概念图不能为空", trigger: "blur" },
        ],
        param: [{ required: true, message: "参数不能为空", trigger: "blur" }],
        datePicker: [
          { required: true, message: "活动时间不能为空", trigger: "blur" },
        ],
        operationType: [
          { required: true, message: "活动类型不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    //获取编辑的广告信息
    getEditInfo() {
      api.getOperationById(this.queryId).then((resp) => {
        this.formData = resp.data;
        this.formData.datePicker = [];
        this.formData.datePicker[0] = moment(
          resp.data.startTime,
          "YYYY-MM-DD HH:mm:ss"
        ).toDate();
        this.formData.datePicker[1] = moment(
          resp.data.endTime,
          "YYYY-MM-DD HH:mm:ss"
        ).toDate();
      });
    },
    //时间选择器变化
    datePickerChange(val) {
      if (val) {
        this.formData.startTime = moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
        this.formData.endTime = moment(val[1]).format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.this.formData.startTime = "";
        this.this.formData.endTime = "";
      }
    },
    //搜索商品
    searchGoods() {
      const data = Mock.mock({
        "items|50": [
          {
            goodsId: "@natural",
            goodsNo: "@guid",
            goodsName: "@word(5, 10)",
            lowPrice: "@float(100,200,2,2)",
          },
        ],
      });
      this.searchGoodsList = data.items;
    },
    //新增活动商品
    addGoods(e) {
      var goodsId = e.clone.getAttribute("dataId");
      var goodsArr = this.formData.goodsList.filter(
        (val) => val.goodsId == goodsId
      );

      if (goodsArr.length == 2) {
        this.formData.goodsList.splice(this.formData.goodsList.length - 1, 1);
        Message({
          message: "已添加",
          type: "warning",
          duration: 1000,
        });
      } else {
        Message({
          message: "添加成功",
          type: "success",
          duration: 1000,
        });
      }
    },
    //全部添加商品
    addAllGoods() {
      var needAdds = this.searchGoodsList.filter((searchGood) => {
        var index = this.formData.goodsList.findIndex(
          (operationGood) => operationGood.goodsId == searchGood.goodsId
        );
        return !(index >= 0);
      });

      this.formData.goodsList.push(...needAdds);
    },
    //活动商品查询
    operationGoodsSearch(searchKey, callback) {
      var resultList = [];

      if (searchKey.length > 0)
        resultList = this.formData.goodsList.filter(
          (val) => val.goodsNo == searchKey || val.goodsName.includes(searchKey)
        );

      callback(resultList);
    },
    //图片上传
    uploadImage(data) {
      const fileData = new FormData();
      fileData.append("file", data.file);
      api.uploadImg(fileData).then((resp) => {
        this.formData.ideaImg = resp.data;
        Message({
          message: "上传成功",
          type: "success",
          duration: 1000,
        });
      });
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
          api.operationSaveorupdate(this.formData).then((resp) => {
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
  top: 30%;
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

.board {
  width: 1000px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
}

.board .search .board-column-header {
  background: #409eff;
}

.board .operation .board-column-header {
  background: #67c23a;
}
</style>