<template>
  <div class="app-container">
    <div>
      <!-- 过滤选项  开始 -->
      <el-row :gutter="15" class="filter-youcontainer">
        <el-col :span="6" class="filter-item">
          <h5 style="width: 100px; text-align: center">邮箱</h5>
          <el-input
            clearable
            placeholder="请输入邮箱"
            v-model="tableInfo.page.filter.email"
            maxlength="100"
        /></el-col>

        <el-col :span="6" class="filter-item">
          <h5 style="width: 100px; text-align: center">主题</h5>
          <el-input
            clearable
            placeholder="请输入主题"
            v-model="tableInfo.page.filter.subject"
            maxlength="100"
        /></el-col>

        <el-col :span="6" class="filter-item">
          <h5 style="width: 100px; text-align: center">内容</h5>
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="tableInfo.page.filter.content"
            maxlength="100"
        /></el-col>

        <el-col :span="6" class="filter-item">
          <h5 style="width: 80px; text-align: center">时间</h5>
          <el-date-picker
            v-model="tableInfo.page.filter.datePicker"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="datePickerChange"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <!-- 过滤选项  结束 -->

      <!-- 表格功能  开始 -->
      <el-row>
        <div class="table-actions">
          <el-button
            type="primary"
            round
            icon="el-icon-search"
            @click="doSearch"
            >搜索</el-button
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
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <!-- 操作列值渲染 开始 -->
          <template v-if="column.prop === 'actions'">
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
      @size-change="getPage"
      @current-change="getPage"
      :current-page.sync="tableInfo.page.current"
      :page-sizes="[10, 20, 30]"
      :page-size.sync="tableInfo.page.size"
      :total="tableInfo.page.total"
      style="padding: 20px"
    >
    </el-pagination>
    <!-- 分页器 结束 -->
  </div>
</template>
<script>
import api from "@/api/system";
import moment from "moment";

export default {
  name: "Feedback",
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
              label: "邮箱",
              prop: "email",
              align: "center",
            },
            {
              label: "主题",
              prop: "subject",
              align: "center",
            },
            {
              label: "内容",
              prop: "content",
            },
            {
              label: "反馈时间",
              prop: "createTime",
              align: "center",
              sortable: true,
            },
            {
              label: "操作",
              prop: "actions",
              align: "center",
              width: 300,
              actions: [
                {
                  index: 1,
                  name: () => "查看详情",
                  type: () => "primary",
                  execute: (row) => this.toDetail(row),
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
            email: "",
            subject: "",
            content: "",
            startTime: "",
            endTime: "",
            datePicker: [],
          },
          orders: [
            {
              column: "create_time",
              asc: false,
            },
          ],
        },
      },
    };
  },
  methods: {
    //获取分页
    getPage() {
      this.tableLoding = true;
      api.pageFeedback(this.tableInfo.page).then((resp) => {
        const { current, records, total, size } = resp.data;
        this.tableInfo.page.current = current;
        this.tableInfo.page.records = records;
        this.tableInfo.page.total = total;
        this.tableInfo.page.size = size;
        this.tableLoding = false;
      });
    },
    //时间选择器变化
    datePickerChange(val) {
      if (val) {
        this.tableInfo.page.filter.startTime = moment(val[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.tableInfo.page.filter.endTime = moment(val[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.tableInfo.page.filter.startTime = "";
        this.tableInfo.page.filter.endTime = "";
      }
    },
    //搜索
    doSearch() {
      this.getPage();
    },
    //详情
    toDetail(row) {
      this.$router.push({
        path: "/system/feedback/detail",
        query: {
          id: row.id,
        },
      });
    },
  },
  mounted() {
    this.getPage();
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
