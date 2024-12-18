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
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            disabled
            style="width: 400px !important"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="主题" prop="subject">
          <el-input
            v-model="formData.subject"
            disabled
            style="width: 400px !important"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="20"
            disabled
            resize="none"
            style="width: 500px !important"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="图片/视频" prop="specific">
          <template v-for="item in formData.specific">
            <el-image
              v-if="item.resourceType == ResourceTypeEnum.IMAGE.value"
              :src="item.resourceUrl"
              :preview-src-list="[item.resourceUrl]"
              class="resource-item"
              fit="cover"
            ></el-image>
            <video
              v-if="item.resourceType == ResourceTypeEnum.VIDEO.value"
              :src="item.resourceUrl"
              class="resource-item"
              @click="openVideoPreview(item.resourceUrl)"
            ></video>
          </template>
        </el-form-item>

        <el-form-item class="actions">
          <el-button type="info" round @click="close">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      :visible.sync="videoPreviewDialogVisible"
      width="50%"
      center
      @opened="loadPreviewVideo"
      @closed="stopPreviewVideo"
    >
      <video
        ref="previewVideo"
        controls
        style="width: 100%; height: 500px"
      ></video>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/system";

//资源类型枚举
const ResourceTypeEnum = {
  IMAGE: { key: "图片", value: 1 },
  VIDEO: { key: "视频", value: 2 },
};

export default {
  name: "FeedbackDetail",
  data() {
    return {
      queryId: this.$route.query.id,
      ResourceTypeEnum,
      // 视频预览
      videoPreviewDialogVisible: false,
      //预览视频url
      prevViewVideo: "",
      //表单数据
      formData: {
        email: "",
        subject: "",
        content: "",
        specific: [],
      },
      rules: {},
    };
  },
  methods: {
    //获取快递信息
    getDetailInfo() {
      api.getFeedbackById(this.queryId).then((resp) => {
        this.formData = resp.data;
      });
    },
    //开启视频预览
    openVideoPreview(url) {
      this.videoPreviewDialogVisible = true;
      this.prevViewVideo = url;
    },
    //加载预览视频
    loadPreviewVideo() {
      this.$refs["previewVideo"].src = this.prevViewVideo;
      this.$refs["previewVideo"].load();
      this.$refs["previewVideo"].play();
    },
    //关闭预览视频
    stopPreviewVideo() {
      this.$refs["previewVideo"].pause();
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
.resource-item {
  width: 150px;
  height: 150px;
  margin-top: 10px;
  margin-right: 10px;
  border-radius: 3px;
  box-shadow: 2px 2px 3px #888888;
  background: black;
  cursor: pointer;
}
</style>