<template>
  <el-dialog v-model='display' :title="tryGetI18nText('DemandView.moduleFailEdit')" width='520' :close-on-click-modal='false'>
    <el-form-ex ref='formDataRef' :model='formData' label-position='left' :rules='formRules'>
      <el-form-item-label label='content' v-model='formData.desc' prop='desc'  clearable />
    </el-form-ex>

    <template #footer>
      <span class='dialog-footer'>
        <el-button @click.stop='display = false'>
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading='isSubmitting' type='primary' @click='onSubmit'>
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, nextTick, defineExpose } from 'vue'
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import ElFormItemLabel from '@/ui/components/ElForm/ElFormItemLabel.vue'
import { http_get, http_post } from '@/axios'
import { tryGetI18nText } from '@/utils'
import { cloneDeep } from 'lodash-es'

/** 是否显示窗口 */
const display = ref(false)
/** form表单对象 */
const formDataRef = ref(null)
/** 是否提交中 */
const isSubmitting = ref(false)
/** form表单数据 */
const formData = ref({
  module_id: 0,
  /** 描述 */
  desc: undefined,
})



/** 表格数据检测规则 */
const formRules = reactive({
})



/** 显示窗口 */
async function show(data) {
  if (display.value) {
    return
  }
  const temp = cloneDeep(data)
  formData.value.module_id = temp.id
  formData.value.desc = temp.desc
  display.value = true
  await nextTick()
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
      http_post('/api/admin/demand/page/plan/module/edit/fail', formData.value, true)
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