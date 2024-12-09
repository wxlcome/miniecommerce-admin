<template>
  <div class="app-container">
    <div>
      <!-- 过滤选项  开始 -->
      <el-row :gutter="15" class="filter-youcontainer">
        <el-col :span="6" class="filter-item">
          <h4 style="width: 100px; text-align: center">优惠券名称</h4>
          <el-input
            clearable
            placeholder="请输入优惠券名称"
            v-model="tableInfo.page.filter.couponName"
            maxlength="100"
        /></el-col>
        <el-col :span="4" class="filter-item">
          <h4 style="width: 80px; text-align: center">优惠券类型</h4>
          <el-select
            clearable
            v-model="tableInfo.page.filter.couponType"
            placeholder="请选择"
          >
            <el-option
              v-for="(val, key) in CouponTypeEnum"
              :key="key"
              :label="val.key"
              :value="val.value"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="5" class="filter-item">
          <h4 style="width: 80px; text-align: center">金额</h4>
          <el-input-number
            v-model="tableInfo.page.filter.startNumber"
            placeholder="开始金额"
            :controls="false"
            :min="0"
            :max="999"
            :precision="2"
          ></el-input-number>
          -
          <el-input-number
            v-model="tableInfo.page.filter.endNumber"
            :controls="false"
            placeholder="结束金额"
            :min="0"
            :max="999"
            :precision="2"
          ></el-input-number>
        </el-col>

        <el-col :span="6" class="filter-item">
          <h4 style="width: 80px; text-align: center">时间</h4>
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

        <el-col :span="3" class="filter-item">
          <h4 style="width: 80px; text-align: center">状态</h4>
          <el-select
            clearable
            v-model="tableInfo.page.filter.status"
            placeholder="请选择"
          >
            <el-option
              v-for="(val, key) in StatusEnum"
              :key="key"
              :label="val.key"
              :value="val.value"
            >
            </el-option>
          </el-select>
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
      >
        <template slot-scope="{ row }">
          <!-- 优惠券类型列值渲染 开始 -->
          <template v-if="column.prop === 'couponType'">
            {{ getCouponTypeText(row[column.prop]) }}
          </template>
          <!-- 优惠券类型列值渲染 结束 -->
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
  name: "Coupon",
  components: {},
  data() {
    return {
      CouponTypeEnum,
      StatusEnum,
      //表格加载
      tableLoding: true,
      //表格数据
      tableInfo: {
        meta: {
          headerAlign: "center",
          columns: [
            {
              label: "优惠券名称",
              prop: "couponName",
              align: "center",
            },
            {
              label: "优惠券类型",
              prop: "couponType",
              align: "center",
              width: "150",
            },
            {
              label: "金额(元)",
              prop: "number",
              align: "center",
              width: "150",
            },
            {
              label: "状态",
              prop: "status",
              align: "center",
              sortable: true,
              width: "100",
            },
            {
              label: "创建时间",
              prop: "createTime",
              align: "center",
              sortable: true,
              width: "300",
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
            couponName: "",
            couponType: "",
            startNumber: undefined,
            endNumber: undefined,
            startTime: "",
            endTime: "",
            status: "",
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
      api.pageCoupon(this.tableInfo.page).then((resp) => {
        const { current, records, total, size } = resp.data;
        this.tableInfo.page.current = current;
        this.tableInfo.page.records = records;
        this.tableInfo.page.total = total;
        this.tableInfo.page.size = size;
        this.tableLoding = false;
      });
    },
    //获取优惠券类型文本
    getCouponTypeText(status) {
      for (let key in CouponTypeEnum)
        if (CouponTypeEnum[key].value === status)
          return CouponTypeEnum[key].key;
    },
    //时间选择器变化
    datePickerChange(val) {
      this.tableInfo.page.filter.startTime = moment(val[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.tableInfo.page.filter.endTime = moment(val[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    //搜索
    doSearch() {
      this.getPage();
    },
    //创建
    toCreate() {
      this.$router.push({
        path: "/system/coupon/createCoupon",
      });
    },
    //编辑
    toEdit(row) {
      this.$router.push({
        path: "/system/coupon/editCoupon",
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
          const newStatus =
            row.status == StatusEnum.ONLINE.value
              ? StatusEnum.OFFLINE.value
              : StatusEnum.ONLINE.value;
          api
            .couponSaveorupdate({
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
    //删除
    handleDelete(row) {
      this.$confirm(`确定删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.delteCouponById(row.id).then((resp) => {
            if (resp.code === 200) {
              this.$message({
                type: "success",
                message: `删除成功!`,
              });
              this.getPage();
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
