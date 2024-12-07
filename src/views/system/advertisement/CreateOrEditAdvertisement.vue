<template>
  <div class="app-container" style="position: relative">
    <el-card>
      <el-form
        ref="form"
        :model="formData"
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

        <el-form-item label="商品编号" required>
          <el-input
            disabled
            v-model="formData.goodsNo"
            style="width: 400px !important"
          />
        </el-form-item>
        <el-form-item label="商品名称" required>
          <el-input
            disabled
            v-model="formData.goodsName"
            style="width: 400px !important"
          />
        </el-form-item>

        <el-form-item label="标题" required>
          <el-input
            v-model="formData.title"
            maxlength="32"
            show-word-limit
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

        <el-form-item label="描述" required>
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="10"
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

        <el-form-item label="概念图" required>
          <el-upload
            class="image-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img
              v-if="formData.ideaImg"
              :src="formData.ideaImg"
              class="image"
            />
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="状态" required>
          <el-radio v-model="formData.status" label="1" border size="medium"
            >上线</el-radio
          >
          <el-radio v-model="formData.status" label="0" border size="medium"
            >下线</el-radio
          >
        </el-form-item>
      </el-form>

      <div class="preview">
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

      <div class="actions">
        <el-button type="primary" round>保存</el-button>
        <el-button type="info" round @click="close">关闭</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
const Mock = require("mockjs");
export default {
  name: "CreateEditAdvertisement",
  data() {
    return {
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
        status: 0,
        ideaImg:
          "https://media.istockphoto.com/id/1272710341/ja/%E3%82%B9%E3%83%88%E3%83%83%E3%82%AF%E3%83%95%E3%82%A9%E3%83%88/%E3%82%AB%E3%83%8A%E3%83%80%E3%81%AE%E3%83%AD%E3%83%83%E3%82%AD%E3%83%BC%E5%B1%B1%E8%84%88%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E7%97%95%E8%B7%A1%E3%81%A8%E7%A9%BA%E3%81%AE%E5%9C%9F%E3%81%AE%E3%83%93%E3%83%BC%E3%83%81.jpg?s=1024x1024&w=is&k=20&c=w4yMXedZKbXXhL3lk8S8IadXeptqWsZyjrEopGmASbU=",
      },
    };
  },
  methods: {
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
    //图片上传前
    beforeImageUpload(file) {},
    //图片上传成功
    handleImageSuccess(file) {},
    //关闭组件
    close() {
      //调用全局挂载的方法，关闭当前页
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
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
  height: 300px;
  line-height: 280px;
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