<template>
  <div class="app-container">
    <div>
      <!-- 过滤选项  开始 -->
      <el-row :gutter="15" class="filter-youcontainer">
        <el-col :span="6" class="filter-item">
          <h5 style="width: 100px; text-align: center">标题</h5>
          <el-input
            clearable
            placeholder="请输入标题"
            v-model="tableInfo.page.filter.title"
            maxlength="100"
        /></el-col>

        <el-col :span="6" class="filter-item">
          <h5 style="width: 100px; text-align: center">描述</h5>
          <el-input
            clearable
            placeholder="请输入描述"
            v-model="tableInfo.page.filter.description"
            maxlength="100"
        /></el-col>

        <el-col :span="6" class="filter-item">
          <h5 style="width: 80px; text-align: center">活动时间</h5>
          <el-date-picker
            v-model="tableInfo.page.filter.datePicker01"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="datePickerChange01"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6" class="filter-item">
          <h5 style="width: 80px; text-align: center">创建时间</h5>
          <el-date-picker
            v-model="tableInfo.page.filter.datePicker02"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="datePickerChange02"
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
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <!-- 活动类型列值渲染 开始 -->
          <template v-if="column.prop === 'operationType'">
            {{ getOperationTypeText(row[column.prop]) }}
          </template>
          <!-- 活动类型列值渲染 结束 -->

          <!-- 状态列值渲染 开始 -->
          <template v-else-if="column.prop === 'status'">
            <el-tag
              :type="
                row[column.prop] == StatusEnum.OFFLINE.value
                  ? 'info'
                  : 'success'
              "
            >
              {{
                row[column.prop] == StatusEnum.OFFLINE.value
                  ? `已${StatusEnum.OFFLINE.key}`
                  : `已${StatusEnum.ONLINE.key}`
              }}
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
  name: "Operation",
  components: {},
  data() {
    return {
      StatusEnum,
      OperationTypeEnum,
      //表格加载
      tableLoding: true,
      //表格数据
      tableInfo: {
        meta: {
          headerAlign: "center",
          columns: [
            {
              label: "标题",
              prop: "title",
              align: "center",
              width: 300,
            },
            { label: "描述", prop: "description", width: 400 },
            {
              label: "活动类型",
              prop: "operationType",
              align: "center",
            },
            {
              label: "参数",
              prop: "param",
              align: "center",
              width: 100,
            },
            {
              label: "开始时间",
              prop: "startTime",
              align: "center",
            },
            {
              label: "结束时间",
              prop: "endTime",
              align: "center",
            },
            {
              label: "状态",
              prop: "status",
              align: "center",
              sortable: true,
              width: 100,
            },
            {
              label: "创建时间",
              prop: "createTime",
              align: "center",
            },
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
                  name: (status) =>
                    status == StatusEnum.ONLINE.value
                      ? StatusEnum.OFFLINE.key
                      : StatusEnum.ONLINE.key,
                  type: (status) =>
                    status == StatusEnum.ONLINE.value ? "warning" : "success",
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
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            status: "",
            createTimeBegin: "",
            createTimeEnd: "",
            datePicker01: [],
            datePicker02: [],
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
      api.pageOperation(this.tableInfo.page).then((resp) => {
        const { current, records, total, size } = resp.data;
        this.tableInfo.page.current = current;
        this.tableInfo.page.records = records;
        this.tableInfo.page.total = total;
        this.tableInfo.page.size = size;
        this.tableLoding = false;
      });
    },
    //时间选择器变化
    datePickerChange01(val) {
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
    datePickerChange02(val) {
      if (val) {
        this.tableInfo.page.filter.createTimeBegin = moment(val[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.tableInfo.page.filter.createTimeEnd = moment(val[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.tableInfo.page.filter.createTimeBegin = "";
        this.tableInfo.page.filter.createTimeEnd = "";
      }
    },
    //获取活动类型文本
    getOperationTypeText(status) {
      for (let key in OperationTypeEnum)
        if (OperationTypeEnum[key].value === status)
          return OperationTypeEnum[key].key;
    },
    //搜索
    doSearch() {
      this.getPage();
    },
    //创建
    toCreate() {
      this.$router.push({
        path: "/system/operation/createOperation",
      });
    },
    //编辑
    toEdit(row) {
      this.$router.push({
        path: "/system/operation/editOperation",
        query: {
          id: row.id,
        },
      });
    },
    //上线/下线
    handleStatus(row) {
      this.$confirm(
        `确定${
          row.status == StatusEnum.ONLINE.value
            ? StatusEnum.OFFLINE.key
            : StatusEnum.ONLINE.key
        }`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const newStatus = row.status == 1 ? 0 : 1;
          api
            .operationSaveorupdate({
              id: row.id,
              status: newStatus,
            })
            .then((resp) => {
              if (resp.code === 200) {
                row.status = newStatus;
                this.$message({
                  type: "success",
                  message: `${
                    row.status == StatusEnum.ONLINE.value
                      ? StatusEnum.ONLINE.key
                      : StatusEnum.OFFLINE.key
                  }成功!`,
                });
              }
            });
        })
        .catch(() => {});
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
