<template>
  <el-tabs v-loading="isRequesting" ref="tabsRef" v-model="selectedId" tab-position="top" :before-leave="onTryChangeTab" class="tabs-style">
    <el-tab-pane v-for="(item, i) in pages" :key="i" :name="item.id">
      <template #label>
        <el-icon v-if="i + 1 === pages.length">
          <Plus />
        </el-icon>

        {{ item.name }}
      </template>

      <!-- 方案内容 -->
      <template #default v-show="selectedId === item.id">
        <page ref="pageRef" :page_id="item.id" />
      </template>
    </el-tab-pane>
  </el-tabs>

  <add-page ref="pageAddDialogRed" @refresh-cb="requestPages" />
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { tryGetI18nText } from '@/utils'
import { Plus } from '@element-plus/icons-vue'
import { http_post } from '@/axios'
import Page from './Page/Page.vue'
import AddPage from './Page/AddPage.vue'
import { useDemandStore } from '@/stores/demand'
import Dialog from '@/ui/components/DIalog/Dialog'

/** 页面列表UI组件 */
const tabsRef = ref(null)
/** 当前选择的页面id */
const selectedId = ref(-1)
/** 添加页面对话框 */
const pageAddDialogRed = ref(null)
/** 页面列表 */
const pages = ref([])

const pageRef = ref(null)

const isRequestingPages = ref(false)
const isRequestingModels = ref(false)
const isRequestingFields = ref(false)

const isRequesting = computed(() => {
  return isRequestingPages.value || isRequestingModels.value || isRequestingFields.value
})

onMounted(() => {
  setTimeout(requestPages, 0)
  setTimeout(refreshModules, 0)
  setTimeout(refreshFields, 0)
})

/** 搜索 */
function requestPages() {
  if (isRequestingPages.value) {
    return
  }
  isRequestingPages.value = true
  http_post('/api/admin/demand/page/list', {}, false)
    .then((response) => {
      pages.value = response.result
      if (selectedId.value === -1 && pages.value.length > 0) {
        selectedId.value = pages.value[0].id
        nextTick(() => {
          refreshPage(selectedId.value)
        })
      }
      // 添加按钮
      pages.value.push({ id: 0, name: '' })
    })
    .catch(() => {})
    .finally(() => {
      isRequestingPages.value = false
    })
}

function refreshModules() {
  if (isRequestingModels.value) {
    return
  }
  isRequestingModels.value = true
  useDemandStore()
    .refreshModules()
    .then(() => {})
    .catch(() => {
      Dialog.tip({
        content: tryGetI18nText('DemandView.initFail'),
        displayCancelBtn: true,
        onClose: () => {},
        onSubmit: refreshModules,
      })
    })
    .finally(() => {
      isRequestingModels.value = false
    })
}

function refreshFields() {
  isRequestingFields.value = true
  useDemandStore()
    .refreshFields()
    .then(() => {})
    .catch(() => {
      Dialog.tip({
        content: tryGetI18nText('DemandView.initFail'),
        displayCancelBtn: true,
        onSubmit: refreshFields,
      })
    })
    .finally(() => {
      isRequestingFields.value = false
    })
}

/**
 * 尝试切换Tab
 * @param activePageId 欲切换的page id
 * @param oldPageId 原来的page id
 * @returns {boolean} 是否可以切换
 */
function onTryChangeTab(activePageId, oldPageId) {
  if (activePageId === 0) {
    pageAddDialogRed.value.show()
    return false
  }

  nextTick(() => {
    refreshPage(activePageId)
  })
  return true
}

function refreshPage(page_id) {
  for (let i = 0; i < pageRef.value.length; i++) {
    if (pageRef.value[i]) {
      pageRef.value[i].tryRefreshPlans(page_id)
    }
  }
}
</script>

<style scoped lang="scss">
.tabs-style {
  background-color: #ffffff;
  padding: 0 15px 15px 15px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
