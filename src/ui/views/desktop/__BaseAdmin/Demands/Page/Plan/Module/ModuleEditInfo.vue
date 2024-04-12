<template>
  <el-dialog v-model="display" :title="tryGetI18nText('DemandView.moduleEditInfo')" width="600" :close-on-click-modal="false">
    <el-form-ex ref="formDataRef" :model="formData" label-position="left" :rules="formRules">
      <el-form-item-label :label="tryGetI18nText('DemandView.moduleName')" v-model="formData.name" prop="name" clearable />
      <el-form-item-label :label="tryGetI18nText('DemandView.moduleDesc')" v-model="formData.desc" prop="desc" clearable />
      <el-form-item-label :label="tryGetI18nText('DemandView.moduleSuccess')" v-model="formData.success" prop="success" clearable />
      <el-form-item-label :label="tryGetI18nText('DemandView.moduleFail')" v-model="formData.fail" prop="fail" clearable />
    </el-form-ex>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="display = false">
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading="isSubmitting" type="primary" @click="onSubmit">
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, nextTick, defineExpose, defineProps } from 'vue'
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import ElFormItemLabel from '@/ui/components/ElForm/ElFormItemLabel.vue'
import ElFormItemInteger from '@/ui/components/ElForm/ElFormItemInteger.vue'
import ElFormItemSelectLocal from '@/ui/components/ElForm/ElFormItemSelectLocal.vue'
import ElFormItemSelectServer from '@/ui/components/ElForm/ElFormItemSelectServer.vue'
import ElFormItemFloat from '@/ui/components/ElForm/ElFormItemFloat.vue'
import ElFormItemCheckbox from '@/ui/components/ElForm/ElFormItemCheckbox.vue'
import ElFormItemDateRange from '@/ui/components/ElForm/ElFormItemDateRange.vue'
import ElFormItemDateTime from '@/ui/components/ElForm/ElFormItemDateTime.vue'
import ElFormItemDate from '@/ui/components/ElForm/ElFormItemDate.vue'
import { http_get, http_post } from '@/axios'
import { useAppStore } from '@/stores/app'
import { tryGetI18nText } from '@/utils'

/** 是否显示窗口 */
const display = ref(false)
/** form表单对象 */
const formDataRef = ref(null)
/** 是否提交中 */
const isSubmitting = ref(false)
/** form表单数据 */
const formData = ref({
  module_id: undefined,
  /** 模块名 */
  name: undefined,
  /** 描述 */
  desc: undefined,
  success: undefined,
  fail: undefined
})

/** 表格数据检测规则 */
const formRules = reactive({
  name: [{ required: true, message: tryGetI18nText('DemandView.moduleNameIsEmpty'), trigger: 'blur' }],
})

/** 先试试窗口 */
async function show({id, name, desc, success, fail}) {
  display.value = true
  await nextTick()

  formData.value.module_id = id
  formData.value.name = name
  formData.value.desc = desc
  formData.value.success = success
  formData.value.fail = fail
  // 自定义参数初始化
}

// 使用 defineExpose 暴露方法
defineExpose({ show })

/** 刷新事件 */
const emit = defineEmits(['refreshCb'])

/** 提交事件 */
async function onSubmit() {
  if (isSubmitting.value) {
    return
  }

  await formDataRef.value.validate((valid) => {
    if (valid) {
      isSubmitting.value = true
      http_post('/api/admin/demand/page/plan/module/edit/info', formData.value, true)
        .then(() => {
          display.value = false
          emit('refreshCb')
        })
        .catch(() => {})
        .finally(() => {
          isSubmitting.value = false
        })
    }
  })
}
</script>
