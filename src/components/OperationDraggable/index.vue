<template>
  <div class="board-column">
    <div class="board-column-header">
      <span
        style="
          position: absolute;
          top: 50%;
          left: 2%;
          transform: translateY(-50%);
        "
        >总计{{ list.length }}条</span
      >
      {{ headerText }}
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="small"
        style="
          position: absolute;
          top: 50%;
          right: 2%;
          transform: translateY(-50%);
        "
        @click="() => this.$emit('update:list', [])"
        >清空</el-button
      >
    </div>

    <el-popover
      :disabled="!operation"
      width="450"
      trigger="focus"
      placement="bottom"
      :title="searchList.length > 0 ? `${searchList.length}条` : ''"
    >
      <el-input
        slot="reference"
        v-model="searchKey"
        placeholder="请输入商品编号或名称"
        prefix-icon="el-icon-search"
        class="board-search"
        size="small"
        clearable
        @input="searchKeyInput"
      >
      </el-input>
      <template slot>
        <div class="popover-content">
          <div
            v-if="searchList.length > 0"
            v-for="(element, index) in searchList"
            class="board-item"
            style="background: #f5f5f5"
          >
            <el-tooltip :content="element.goodsName" placement="bottom">
              <span class="goods-name">
                {{ element.goodsName }}
              </span>
            </el-tooltip>

            <el-tooltip :content="`${element.lowPrice}元`" placement="bottom">
              <span class="goods-lowprice">{{ element.lowPrice }}元</span>
            </el-tooltip>
            <i
              class="el-icon-circle-close close-btn"
              @click="removeSearch(index, element)"
            ></i>
          </div>
          <span v-if="searchList.length <= 0">无数据</span>
        </div>
      </template>
    </el-popover>

    <div class="board-result-header">
      <span>商品名称</span>
      <span>最低价</span>
    </div>

    <draggable
      v-bind="$attrs"
      v-on="$listeners"
      ref="draggable"
      class="board-column-content"
      draggable=".draggable-item"
      :list="list"
      :set-data="setData"
    >
      <div
        v-for="(element, index) in list"
        :key="index"
        :dataId="element.goodsId"
        :class="[operation ? 'operation-item' : 'draggable-item', 'board-item']"
      >
        <el-tooltip :content="element.goodsName" placement="bottom">
          <span class="goods-name">
            {{ element.goodsName }}
          </span>
        </el-tooltip>

        <el-tooltip :content="`${element.lowPrice}元`" placement="bottom">
          <span class="goods-lowprice">{{ element.lowPrice }}元</span>
        </el-tooltip>
        <i class="el-icon-circle-close close-btn" @click="remove(index)"></i>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "OperationDraggable",
  components: {
    draggable,
  },
  props: {
    headerText: {
      type: String,
      default: "Header",
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    operation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //搜索关键词
      searchKey: "",
      //搜索结果
      searchList: [],
    };
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData("Text", "");
    },
    remove(index) {
      this.$emit("update:list", this.list.toSpliced(index, 1));
    },
    removeSearch(index, el) {
      this.searchList.splice(index, 1);
      var elIndex = this.list.findIndex((val) => val.goodsId == el.goodsId);
      this.remove(elIndex);
    },
    searchKeyInput(val) {
      this.$emit("search", val, (res) => {
        this.searchList = res;
      });
    },
  },
  watch: {
    list: function (newList, oldList) {
      if (this.operation) {
        var draggable = this.$refs["draggable"].$el;
        setTimeout(() => {
          draggable.scrollTop = draggable.scrollHeight;
        }, 100);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.board-column {
  position: relative;
  min-width: 400px;
  min-height: 600px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    position: relative;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow-y: scroll;
    scrollbar-width: none;
    border: 10px solid transparent;
    height: 520px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
  }
  .board-search {
    display: block;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
  }
  .board-result-header {
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;
    height: 18px;
    font-size: 14px;
    font-weight: bold;
  }
}

.board-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  height: 64px;
  margin: 5px 0;
  background-color: #fff;
  text-align: left;
  line-height: 54px;
  padding: 5px 30px;
  box-sizing: border-box;
  box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
  text-align: right;

  .goods-name {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }
  .goods-lowprice {
    max-width: 80px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    color: #279846;
  }

  .close-btn {
    position: absolute;
    right: 0;
    font-size: 18px;
    right: 2%;
    top: 50%;
    transform: translateY(-50%);
  }

  .close-btn:hover {
    color: red;
  }
}

.popover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 10px;
  max-height: 400px;
  overflow-y: scroll;
  scrollbar-width: none;
}
</style>

