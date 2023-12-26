<template>
  <div style="flex-grow: 1">
    <el-table
      :data="props.data"
      v-loading="props.loading"
      :border="props.border"
      style="width: 100%"
      :highlight-current-row="props.highlightCurrentRow"
      :header-cell-style="tableHeader"
      @selection-change="onSelectionChange"
      :row-key="props.rowKey"
      :lazy="props.lazy"
      :load="props.load"
      :tree-props="props.treeProps"
      :default-expand-all="props.defaultExpandAll"
      :cell-style="cellStyle"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="scope">
        <slot :name="name" v-bind="scope"></slot>
      </template>
    </el-table>

    <el-pagination
      v-if="showPagination"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="props.pageSizes"
      :small="props.isSmallPagination"
      layout="sizes, prev, pager, next"
      :total="props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 10px"
    ></el-pagination>
  </div>
</template>

<script setup>
import { nextTick, defineProps, computed, onMounted, reactive, ref, watch, defineExpose, useAttrs } from 'vue'

const props = defineProps({
  size: String,
  // 接收外部传入的加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 表格数据
  data: {
    type: Array,
  },
  // 表格是否显示border
  border: {
    type: Boolean,
    default: true,
  },
  // 高亮当前行
  highlightCurrentRow: {
    type: Boolean,
    default: true,
  },
  rowKey: String,
  //是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
  defaultExpandAll: Boolean,
  //是否懒加载子节点数据
  lazy: {
    type: Boolean,
    default: false,
  },
  // 加载子节点数据的函数，lazy 为 true 时生效
  load: {
    type: Function, // function(row, treeNode, resolve)
  },
  // 渲染嵌套数据的配置选项
  // { hasChildren: 'hasChildren', children: 'children' }
  treeProps: {
    type: Object,
  },
  cellStyle: Function,
  // 分页相关----------------------
  /**
   * 是否显示分页
   */
  showPagination: {
    type: Boolean,
    default: true,
  },
  isSmallPagination: {
    type: Boolean,
    default: true,
  },
  /**
   * 当前选中页
   */
  currentPage: {
    type: Number,
    default: 1,
  },
  /**
   * 当前大小
   */
  pageSize: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array,
    default: () => [3, 50, 100],
  },
  total: {
    type: Number,
    default: 0,
  },
})

// eslint-disable-next-line no-unused-vars
function tableHeader({ row, column, rowIndex, columnIndex }) {
  return { 'background-color': '#f5f7fa', color: '#333333', 'font-size': '14px', 'font-weight': 'bold  !important' }
}

const currentPage = ref(props.currentPage)
const pageSize = ref(props.pageSize)
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.currentPage, props.pageSize],
  ([newCurrentPage, newPageSize], [oldCurrentPage, oldPageSize]) => {
    if (newCurrentPage !== oldCurrentPage) {
      currentPage.value = newCurrentPage
    }
    if (newPageSize !== oldPageSize) {
      pageSize.value = newPageSize // 应该更新 pageSize 而非 currentPage
    }
  },
  { deep: true }
)

const emit = defineEmits(['size-change', 'current-change', 'update:currentPage', 'update:pageSize', 'selection-change'])
const handleCurrentChange = (page) => {
  emit('update:currentPage', page)
  emit('current-change', page)
}

function onSelectionChange(val) {
  emit('selection-change', val)
}
const handleSizeChange = (size) => {
  emit('update:pageSize', size)
  emit('size-change', size)
}
</script>

<style scoped lang="scss">
.tableExBody .el-icon-loading {
  font-size: 10px !important;
}
</style>
