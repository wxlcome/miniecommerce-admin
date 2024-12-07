<template>
  <div class="app-container">
    <div>
      <!-- 过滤选项  开始 -->
      <el-row :gutter="10" class="filter-container">
        <el-col :span="5" class="filter-item">
          <h4 style="width: 80px; text-align: center">商品编号</h4>
          <el-input
            clearable
            placeholder="请输入商品编号"
            v-model="tableInfo.page.filter.goodsNo"
            maxlength="100"
        /></el-col>
        <el-col :span="5" class="filter-item">
          <h4 style="width: 80px; text-align: center">商品名称</h4>
          <el-input
            clearable
            placeholder="请输入商品名称"
            v-model="tableInfo.page.filter.goodsName"
            maxlength="100"
        /></el-col>
        <el-col :span="5" class="filter-item">
          <h4 style="width: 80px; text-align: center">标题</h4>
          <el-input
            clearable
            placeholder="请输入标题"
            v-model="tableInfo.page.filter.title"
            maxlength="100"
        /></el-col>
        <el-col :span="3" class="filter-item">
          <h4 style="width: 80px; text-align: center">状态</h4>
          <el-select
            clearable
            v-model="tableInfo.page.filter.status"
            placeholder="请选择"
          >
            <el-option
              v-for="item in [
                { label: '已上线', value: 1 },
                { label: '未上线', value: 0 },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- 过滤选项  结束 -->

      <!-- 表格功能  开始 -->
      <el-row>
        <div class="table-actions">
          <el-button type="primary" round icon="el-icon-search">搜索</el-button>
          <el-button
            type="primary"
            round
            icon="el-icon-plus"
            @click="toCreate()"
            >添加</el-button
          >
        </div>
      </el-row>
      <!-- 表格功能  结束 -->
    </div>

    <!-- 表格  开始-->
    <el-table
      v-loading="tableLoding"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      fit
      border
      highlight-current-row
      stripe
      size="medium"
      style="width: 100%"
      :data="tableInfo.page.records"
      :row-key="(row) => row.id"
    >
      <!-- 表格字段列渲染 开始-->
      <el-table-column
        v-for="(column, col_idx) in tableInfo.meta.columns"
        :sortable="column.sortable"
        :key="col_idx"
        :header-align="tableInfo.meta.headerAlign"
        :align="column.align"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :fixed="column.prop === 'actions' ? 'right' : ''"
      >
        <template slot-scope="{ row }">
          <!-- 状态列值渲染 开始 -->
          <template v-if="column.prop === 'status'">
            <el-tag :type="row[column.prop] == 0 ? 'info' : 'success'">
              {{ row[column.prop] == 0 ? "未上线" : "已上线" }}
            </el-tag>
          </template>
          <!-- 状态列值渲染 结束 -->

          <!-- 操作列值渲染 开始 -->
          <template v-else-if="column.prop === 'actions'">
            <el-button
              v-for="(action, ac_idx) in column.actions"
              :key="ac_idx"
              :type="action.type(row.status)"
              size="small"
              @click="action.execute(row, action)"
            >
              {{ action.name(row.status) }}
            </el-button>
          </template>
          <!-- 操作列值渲染 结束 -->

          <!-- 正常列值渲染 开始 -->
          <template v-else>
            {{ row[column.prop] }}
          </template>
          <!-- 正常列值渲染 结束 -->
        </template>
      </el-table-column>
      <!-- 表格字段列渲染 结束-->
    </el-table>
    <!-- 表格  结束-->

    <!-- 分页器 开始 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change=""
      @current-change=""
      :current-page="tableInfo.page.current"
      :page-sizes="[10, 20, 30]"
      :page-size="tableInfo.page.size"
      :total="tableInfo.page.total"
      style="padding: 20px"
    >
    </el-pagination>
    <!-- 分页器 结束 -->
  </div>
</template>
<script>
import { getList } from "@/api/table";
export default {
  name: "Advertisement",
  components: {},
  data() {
    return {
      //表格加载
      tableLoding: true,
      //表格数据
      tableInfo: {
        meta: {
          headerAlign: "center",
          columns: [
            {
              label: "商品编号",
              prop: "goodsNo",
              align: "center",
            },
            { label: "商品名称", prop: "goodsName", align: "center" },
            { label: "标题", prop: "title" },
            { label: "描述", prop: "description" },
            {
              label: "顺序",
              prop: "index",
              align: "center",
              sortable: true,
              width: "100",
            },
            { label: "状态", prop: "status", align: "center", width: "100" },
            {
              label: "操作",
              prop: "actions",
              align: "center",
              width: 300,
              actions: [
                {
                  index: 1,
                  name: () => "编辑",
                  type: () => "primary",
                  execute: (row) => this.toEdit(row),
                },
                {
                  index: 2,
                  name: (status) => (status == 1 ? "下线" : "上线"),
                  type: (status) => (status == 1 ? "warning" : "success"),
                  execute: (row) => this.handleStatus(row),
                },
                {
                  index: 3,
                  name: () => "删除",
                  type: () => "danger",
                  execute: (row) => this.handleDelete(row),
                },
              ],
            },
          ],
        },
        page: {
          current: 1,
          records: [],
          total: 0,
          size: 10,
          filter: {
            goodsNo: "",
            goodsName: "",
            title: "",
            status: "",
          },
        },
      },
    };
  },
  methods: {
    //创建
    toCreate() {
      this.$router.push({
        path: "/system/advertisement/createAdvertisement",
      });
    },
    //编辑
    toEdit(row) {
      this.$router.push({
        path: "/system/advertisement/editAdvertisement",
        query: {
          id: row.id,
        },
      });
    },
    //上线/下线
    handleStatus(row) {
      this.$confirm(`确定${row.status == 1 ? "下线" : "上线"}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          row.status = row.status == 1 ? 0 : 1;
          this.$message({
            type: "success",
            message: `${row.status == 1 ? "上线" : "下线"}成功!`,
          });
        })
        .catch(() => {});
    },
    //删除
    handleDelete(row) {
      this.$confirm(`确定删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableInfo.page.records.splice(0, 1);
          this.$message({
            type: "success",
            message: `删除成功!`,
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    getList().then((resp) => {
      this.tableInfo.page.total = resp.data.total;
      this.tableInfo.page.records = resp.data.items;
      this.tableLoding = false;
    });
  },
};
</script>
<style scoped>
.table-actions {
  padding: 10px 0px;
}

.filter-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;

  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
}
</style>
