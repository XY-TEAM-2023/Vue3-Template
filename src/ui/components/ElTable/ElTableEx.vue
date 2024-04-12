<template>
  <div class="el-table-ex">
    <!--  搜索  -->
    <inner-el-table-search-mulit-line v-if="hasSearch" ref="multiLineSearchRef" :data="props.dataSearch" class="multi-line-search">
      <template #search>
        <slot name="search" />
      </template>
    </inner-el-table-search-mulit-line>

    <el-card-ex class="card-table" shadow="never" :use-fold="props.useFold">
      <template #header>
        <template v-if="!slots.header">
          {{ $t('app.searchResultTitle') }}
        </template>

        <slot name="header"></slot>
      </template>

      <div class="operations">
        <!--  控制列是否显示  -->
        <inner-el-table-column-settings v-if="props.displayColumnSettings" ref="columnSettingsRef" class="columnSettings" />

        <!--  操作按钮  -->
        <slot name="operations" />

        <!--  快速搜索  -->
        <div style="margin-left: auto">
          <slot name="quickSearch" />
        </div>
      </div>

      <el-table
        ref="tableRef"
        :data="props.dataTable"
        v-loading="props.loading"
        :border="props.border"
        class="tableClass"
        :size="props.size"
        :stripe="props.stripe"
        :highlight-current-row="props.highlightCurrentRow"
        :header-cell-style="tableHeader"
        @selection-change="onSelectionChange"
        :row-key="props.rowKey"
        :lazy="props.lazy"
        :load="props.load"
        :tree-props="props.treeProps"
        :default-expand-all="props.defaultExpandAll"
        :cell-style="cellStyle"
        :default-sort="{ prop: 'index' }"
        @sort-change="handleSortChange"
        :sort-method="sortMethod"
        :scrollbar-always-on="scrollbar.display"
        :class="scrollbar.class"
        height="100%"
        style="min-height: 150px"
      >
        <template v-for="(_, name) in $slots" :key="name" v-slot:[name]="scope">
          <el-table-column
            v-if="showIndexColumn"
            :label="tryGetI18nText('com.index')"
            width="90"
            align="center"
            type="index"
            :index="indexMethod"
            sortable
          >
          </el-table-column>

          <!-- 使用插槽传递子组件的name属性 -->
          <slot :name="name" v-bind="scope"></slot>
        </template>
      </el-table>

      <div :class="{ 'bottom-area': showPagination }">
        <el-pagination
          v-if="showPagination"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="props.pageSizes"
          :small="props.isSmallPagination"
          layout="sizes, prev, pager, next"
          :total="props.total"
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
          background
          class="pagination"
        />
      </div>
    </el-card-ex>
  </div>
</template>

<script setup>
import { computed, defineProps, nextTick, onMounted, provide, ref, useSlots, watch, onUnmounted } from 'vue'
import router from '@/router'
import { tryGetI18nText } from '@/utils'
import md5 from 'md5'
import { useAppStore } from '@/stores/app'
import InnerElTableSearchMulitLine from './InnerElTableSearchMulitLine.vue'
import { cloneDeep } from 'lodash-es'
import InnerElTableColumnSettings from './InnerElTableColumnSettings.vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'

const appStore = useAppStore()
const slots = useSlots()

const props = defineProps({
  // 是否可以折叠
  useFold: {
    type: Boolean,
    default: false,
  },
  // 搜索相关------------------------------------
  dataSearch: {
    type: Object,
    default: () => {},
  },
  // 表格相关------------------------------------
  /** 是否显示设置列 */
  displayColumnSettings: {
    type: Boolean,
    default: true,
  },
  /** 显示索引列 */
  showIndexColumn: {
    type: Boolean,
    default: true,
  },
  /** 索引倒叙显示 */
  indexReverseOrder: Boolean,
  size: {
    type: String,
    default: 'default',
  },
  // 接收外部传入的加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 表格数据
  dataTable: {
    type: Array,
  },
  /** 可以设置字段是否显示 */
  fields: {
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
  stripe: {
    type: Boolean,
    default: true,
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
  // 分页相关------------------------------------
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
    default: 0,
  },
  pageSizes: {
    type: Array,
    default: () => useAppStore().pageSizes,
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

const multiLineSearchRef = ref(null)
/** 是否使用了多行搜索 */
const hasSearch = computed(() => slots.search)

/** 自定义index */
function indexMethod(index) {
  if (!props.indexReverseOrder) {
    return index + 1 + (currentPage.value - 1) * pageSize.value
  } else {
    return props.total - index - (currentPage.value - 1) * pageSize.value
  }
}

/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.currentPage, props.pageSize, props.dataTable],
  ([newCurrentPage, newPageSize, newDataTable], [oldCurrentPage, oldPageSize, oldDataTable]) => {
    if (newCurrentPage !== oldCurrentPage) {
      console.log('watch currentPage', newCurrentPage)
      currentPage.value = newCurrentPage
    }
    if (newPageSize !== oldPageSize) {
      pageSize.value = newPageSize // 应该更新 pageSize 而非 currentPage
    }
    if (newDataTable !== oldDataTable) {
      refreshScrollbarStatus()
    }
  },
  { deep: true }
)

const emit = defineEmits([
  'size-change',
  'current-change',
  'update:currentPage',
  'update:pageSize',
  'selection-change',
  'update:dataSearch',
])

function setMultiLineSearchFold() {
  if (!hasSearch.value) {
    return
  }
  multiLineSearchRef.value.setFold()
}

/** 切换页 */
const onPageChange = (page) => {
  setMultiLineSearchFold()
  emit('update:currentPage', page)
  emit('current-change', page)
}

/** 修改每页显示数量 */
const onPageSizeChange = (size) => {
  tableConfig.value.pageSize = size
  pageSize.value = size
  saveTableConfig()
  setMultiLineSearchFold()
  emit('update:pageSize', size)
  emit('size-change', size)
}

function onSelectionChange(val) {
  emit('selection-change', val)
}

/** 当前表格的唯一ID */
let tableHashKey = ''
/** 当前表格配置 */
const tableConfig = ref({ hideColumns: [] })

/** 自动计算当前表格包含的列 */
onMounted(async () => {
  await nextTick()

  const defaultSlot = slots.default() // 使用 $slots.default() 获取默认插槽内容
  // console.log(defaultSlot)

  // 添加默认的index
  const column_options = []
  column_options.push({
    label: tryGetI18nText('com.index'),
    key: 'index',
    disabled: true,
  })

  defaultSlot.forEach((vnode) => {
    // console.log(vnode)
    try {
      const name = vnode.type.__name ? vnode.type.__name : vnode.type.name
      if (name.startsWith('ElTableColumn')) {
        tableHashKey += vnode.props.label + '-' + vnode.props.prop ? vnode.props.prop : 'undefined'

        column_options.push({
          label: tryGetI18nText(vnode.props.label),
          key: vnode.props.prop,
          disabled: vnode.props.prop === undefined,
        })

        sortTypeDict[vnode.props.prop + ''] = name
      }
    } catch (e) {}
  })

  refreshScrollbarStatus()

  // 加载配置
  if (props.displayColumnSettings) {
    columnSettingsRef.value.initColumnOptions(column_options)
  }
  loadTableConfig()
})

const scrollbar = ref({
  display: false,
  class: {
    'el-table-scrollbar-hor': false,
    'el-table-scrollbar-ver': false,
  },
})

/** 初始化是否需要水平移动 */
function refreshScrollbarStatus() {
  nextTick(() => {
    const tableWrapper = document.querySelector('.el-table__inner-wrapper .el-scrollbar__wrap')
    const tableContent = document.querySelector('.el-table__inner-wrapper .el-scrollbar__view')

    const hor = tableContent.scrollWidth > tableWrapper.clientWidth
    const ver = tableContent.scrollHeight > tableWrapper.clientHeight
    // console.log(tableContent.scrollWidth, tableWrapper.clientWidth)

    scrollbar.value.display = hor || ver
    scrollbar.value.class['el-table-scrollbar-hor'] = hor
    scrollbar.value.class['el-table-scrollbar-ver'] = ver
  })
}

const columnSettingsRef = ref(null)

/** 加载当前表格的配置 */
function loadTableConfig() {
  tableHashKey = md5(router.currentRoute.value.fullPath + '|' + tableHashKey)
  const temp_config = localStorage.getItem(tableHashKey)
  let temp_page_size = props.pageSize
  if (temp_config !== undefined && temp_config !== '' && temp_config !== null) {
    tableConfig.value = JSON.parse(temp_config)

    if (props.displayColumnSettings) {
      columnSettingsRef.value.initHideColumns(tableConfig.value.hideColumns)
    }

    if (temp_page_size === 0) {
      temp_page_size = tableConfig.value.pageSize
    }
  }

  temp_page_size = temp_page_size !== 0 ? temp_page_size : appStore.pageSizes[0]
  if (props.pageSize === 0) {
    onPageSizeChange(temp_page_size)
  }
}

/** 保存当前表格配置 */
function saveTableConfig() {
  localStorage.setItem(tableHashKey, JSON.stringify(tableConfig.value))
}

/** 保存隐藏中的列 */
provide('saveHideColumns', (columns) => {
  tableConfig.value.hideColumns = columns
  saveTableConfig()
})

provide('showColumnFun', (fieldProp) => {
  const prop = fieldProp
  return computed(() => {
    return !tableConfig.value.hideColumns.find((item) => item === prop)
  }).value
})

provide('onSearch', () => {
  onPageChange(1)
})

let searchDataDefault = cloneDeep(props.dataSearch)

/** 重置搜索数据 */
provide('onResetSearchData', () => {
  emit('update:dataSearch', cloneDeep(searchDataDefault))
})

/** 设置默认搜索的数据 */
function setDefaultSearchData(defaultData) {
  searchDataDefault = cloneDeep(defaultData)
}

function getPageSize() {
  return tableConfig.value.pageSize
}

/** 导出方法 */
defineExpose({
  getPageSize,
  setDefaultSearchData,
})

/** 字段对应的排序类型 */
let sortTypeDict = {}
/** 排序方向：ascending-升序， descending-降序，null-默认 */
let sortOrder = ''

function handleSortChange({ column, prop, order }) {
  sortOrder = order
  // console.log('当前排序列:', column)
  // console.log('当前排序字段:', prop)
  // console.log('当前排序方向:', order)
}

/** 排序规则 */
function sortMethod(a, b, prop) {
  const columnType = sortTypeDict[prop]
  if (
    columnType === 'ElTableColumnFloat' ||
    columnType === 'ElTableColumnInteger' ||
    columnType === 'ElTableColumnMoney' ||
    columnType === 'ElTableColumnTs'
  ) {
    if (sortOrder === 'ascending') {
      return a[prop] - b[prop] // 升序
    } else if (sortOrder === 'descending') {
      return b[prop] - a[prop] // 降序
    } else {
      return null
    }
  } else {
    let a = a[prop]
    let b = b[prop]
    if (Object.prototype.toString.call(a) === '[object Object]' || Array.isArray(a)) {
      a = JSON.stringify(a)
      b = JSON.stringify(b)
    } else {
      a = a + ''
      b = b + ''
    }
    if (sortOrder === 'ascending') {
      return a.localeCompare(b) // 升序
    } else if (sortOrder === 'descending') {
      return b.localeCompare(a) // 降序
    } else {
      return null
    }
  }
}
</script>

<style scoped lang="scss">
.tableExBody .el-icon-loading {
  font-size: 10px !important;
}

.el-table-ex {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-transfer) {
  display: flex;
  margin-left: auto;
  margin-right: auto;

  .el-transfer__buttons {
    display: flex;
    flex-direction: column;
    margin-top: auto;
    margin-bottom: auto;
    padding-left: 20px;
    padding-right: 20px;
  }

  .el-transfer__button + .el-transfer__button {
    margin: 10px 0 0 0;
  }

  .el-transfer-panel .el-transfer-panel__header {
    height: 34px;
  }

  .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 14px;
  }
}

.operations {
  width: 100%;
  display: flex;
  //gap: 8px; /* 子元素之间的间隔 */
  margin-bottom: 10px;

  :deep(.el-button) + .el-button {
    margin-left: 8px;
  }
}

.multi-line-search {
  margin-bottom: 10px;
}

.card-table {
  flex-grow: 1; /* 占据剩余空间 */
  //min-height: 100px;
  //height: 100%;

  :deep(.table-wrapper-flex-content) {
    display: flex;
    flex-direction: column;
  }
}

:deep(.el-card) {
  border-radius: 4px;
}

.columnSettings {
  //margin-left: auto;
  margin-left: 10px;
  //margin-right: 8px;
}

.bottom-area {
  width: 100%;
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
}

.el-pagination {
  margin-left: auto;

  :deep(.el-select) {
    width: 106px;
  }

  :deep(.btn-prev) {
    margin-left: 10px !important;
  }
}

.el-table-scrollbar-hor {
  :deep(.el-scrollbar) {
    padding-bottom: 10px;
  }
}

.el-table-scrollbar-ver {
  :deep(.el-table__header-wrapper) {
    padding-right: 10px;
  }

  :deep(.el-scrollbar) {
    padding-right: 10px;
  }
}

.tableClass {
  width: 100%;
  //flex-grow: 1;
}

:deep(.caret-wrapper) {
  width: 14px;
}
</style>
