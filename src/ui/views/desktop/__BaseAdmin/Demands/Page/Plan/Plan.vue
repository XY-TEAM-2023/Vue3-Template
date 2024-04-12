<template>
  <!-- 计划信息 -->
  <div class="plan-info">
    <module-create :plan_id="props.plan_id" @refresh-cb="refreshPlan" />

<!--    <div class="plan-info-desc">-->
<!--      {{ plan.desc }}-->
<!--    </div>-->

    <el-button type="info" size="small" style="margin-left: auto" @click="onBtnDeletePlan">
      {{ tryGetI18nText('DemandView.deletePlan') }}
    </el-button>
  </div>

  <el-divider style="margin-top: 0; margin-bottom: 15px" />

  <!-- 显示字段 -->
  <fields ref="fieldsRef" :plan_id="props.plan_id" />

  <!-- 自定义模块 -->
  <module v-for="(mId, i) in plan.modules" :key="i" :plan_id="props.plan_id" :module_id="mId" @refresh-cb="refreshPlan" />
</template>

<script setup>
import { defineProps, ref, defineExpose, defineEmits } from 'vue'
import { http_post } from '@/axios'
import { tryGetI18nText } from '@/utils'
import Fields from './Fields.vue'
import Module from './Module/Module.vue'
import ModuleCreate from './Module/ModuleCreate.vue'
import Dialog from '@/ui/components/DIalog/Dialog'

const props = defineProps({
  plan_id: Number,
})
defineExpose({ tryRefresh })

const plan = ref({})
const fieldsRef = ref(null)

/** 刷新计划内容 */
function refreshPlan() {
  http_post('/api/admin/demand/page/plan/info', { plan_id: props.plan_id }, false).then((response) => {
    plan.value = response.result
    if (plan.value.modules === '') {
      plan.value.modules = []
    } else {
      plan.value.modules = plan.value.modules.split(',').map(Number)
    }
  })

  setTimeout(() => {
    fieldsRef.value.requestFields()
  }, 0)
}

/** 尝试刷新计划 */
function tryRefresh(plan_id) {
  if (plan_id !== props.plan_id) {
    return
  }
  refreshPlan()
}

const emits = defineEmits(['refresh-cb'])

function onBtnDeletePlan(row) {
  Dialog.tip({
    content: tryGetI18nText('DemandView.deletePlanTip'),
    width: 300,
    displayCancelBtn: true,
    onClose: () => {},
    onSubmit: () => {
      http_post('/api/admin/demand/page/plan/delete', { id: props.plan_id }, false)
        .then(() => {
          emits('refresh-cb')
        })
        .catch(({ status, data }) => {
          if (status === 72) {
            Dialog.tip({
              content: tryGetI18nText('DemandView.deleteModuleFail') + data.usings,
            })
          }
        })
        .finally(() => {})
    },
  })
}

function onBtnAddModule() {}
</script>

<style scoped lang="scss">
.plan-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--el-card-border-color);
}

.plan-info-desc {
  color: #9a9a9a;
}
</style>
