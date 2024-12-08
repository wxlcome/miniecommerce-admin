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

        <el-form-item label="商品id" v-show="false">
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

        <el-form-item label="顺序" required>
          <el-input-number
            v-model="formData.adIndex"
            controls-position="right"
            :min="0"
            :max="10"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="状态" required>
          <el-radio v-model="formData.status" label="1" border size="medium"
            >上线</el-radio
          >
          <el-radio v-model="formData.status" label="0" border size="medium"
            >下线</el-radio
          >
        </el-form-item>

        <el-form-item class="actions">
          <el-button type="primary" round @click="save">保存</el-button>
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
import { Message } from "element-ui";
const Mock = require("mockjs");

export default {
  name: "CreateEditAdvertisement",
  data() {
    return {
      queryId: this.$route.query.id,
      //商品加载
      goodsLoading: true,
      //已选择的商品
      selectedGoods: {},
      //商品搜索结果
      goodsList: [],
      //表单数据
      formData: {
        goodsId: "",
        goodsNo: "",
        goodsName: "",
        title: "",
        titleColor: "#000000",
        description: "",
        descriptionColor: "#FFFFFF",
        adIndex: 0,
        status: "0",
        ideaImg: "",
      },
      rules: {
        goodsNo: [
          { required: true, message: "商品编号不能为空", trigger: "blur" },
        ],
        goodsName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        description: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
        ideaImg: [
          { required: true, message: "概念图不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //获取编辑的广告信息
    getEditInfo() {
      api.getAdvertisementById(this.queryId).then((resp) => {
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
    save() {
      this.$refs["form"].validate((flag, field) => {
        if (flag) {
          api.advertisementSaveorupdate(this.formData).then((resp) => {
            if (resp.code === 200) {
              Message({
                message: `${this.queryId ? "编辑" : "添加"}成功`,
                type: "success",
                duration: 1000,
              });
              this.close();
              this.refreshPrev();
            }
          });
        }
      });
    },
    //刷新调用页面
    refreshPrev() {
      this.$store.dispatch("tagsView/delCachedView", this.prevView).then(() => {
        const { fullPath } = this.prevView;
        this.$nextTick(() => {
          this.$router.replace({
            path: fullPath,
          });
        });
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