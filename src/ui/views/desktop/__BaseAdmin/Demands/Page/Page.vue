<template>
  <div style="height: 100%">
    <add-plan ref="addPlanRef" :page_id="props.page_id" @refresh-cb="requestPlans" />

    <el-tabs
      ref="tabsRef"
      type="border-card"
      v-model="selectedPlanId"
      tab-position="left"
      :before-leave="onTryChangeTab"
      style="width: 100%; min-height: 100%"
    >
      <el-tab-pane v-for="(plan, i) in plans" :key="i" :name="plan.id">
        <template #label>
          <el-icon v-if="i + 1 === plans.length">
            <Plus />
          </el-icon>

          {{ plan.name }}
        </template>

        <!-- 方案内容 -->
        <template #default v-show="selectedPlanId === plan.id">
          <el-scrollbar style="width: 100%; max-height: 100%">
            <plan ref="planRef" :plan_id="plan.id" @refresh-cb="requestPlans" />
          </el-scrollbar>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, nextTick, provide } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import { http_post } from '@/axios'
import Dialog from '@/ui/components/DIalog/Dialog'
import Plan from './Plan/Plan.vue'
import AddPlan from './Plan/AddPlan.vue'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  page_id: Number,
})
defineExpose({ tryRefreshPlans })

const plans = ref([])
const selectedPlanId = ref(-1)
const addPlanRef = ref(null)

function requestPlans() {
  http_post('/api/admin/demand/page/plan/list', { page_id: props.page_id }, false).then((response) => {
    plans.value = response.result
    if (selectedPlanId.value === -1 && plans.value.length > 0) {
      selectedPlanId.value = plans.value[0].id
      refreshPlan(selectedPlanId.value)
    }
    // 添加按钮
    plans.value.push({ id: 0, name: tryGetI18nText('DemandView.addPlan') })
  })
}

onMounted(() => {})

function tryRefreshPlans(target_page_id) {
  if (target_page_id !== props.page_id) {
    return
  }
  requestPlans()
}

/**
 * 尝试切换显示方案
 * @param activePageId 欲切换的page id
 * @param oldPageId 原来的page id
 * @returns {boolean} 是否可以切换
 */
function onTryChangeTab(activePageId, oldPageId) {
  if (activePageId === 0) {
    // 添加计划
    addPlanRef.value.show()
    return false
  }

  refreshPlan(activePageId)
  return true
}

const planRef = ref(null)

/**
 * 刷新计划内容
 * @param plan_id
 */
function refreshPlan(plan_id) {
  nextTick(() => {
    for (let i = 0; i < planRef.value.length; i++) {
      if (planRef.value[i]) {
        planRef.value[i].tryRefresh(plan_id)
      }
    }
  })
}


/** 规则下移 */
provide('GET_PAGE_ID', () => {
  return props.page_id
})
</script>

<style scoped lang="scss">
:deep(.el-tabs__content) {
  padding-top: 8px !important;
}
</style>