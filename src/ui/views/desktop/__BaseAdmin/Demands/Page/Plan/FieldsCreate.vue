<template>
  <el-button @click="onShow" style="width: 100%">
    {{ tryGetI18nText('DemandView.createField') }}
  </el-button>

  <el-dialog v-model="display" :title="tryGetI18nText('DemandView.createField')" width="520" :close-on-click-modal="false">
    <el-form-ex ref="formDataRef" :model="formData" label-position="left" :rules="formRules">
      <el-form-item-label label="DemandView.fieldName" v-model="formData.field" prop="field" clearable />
      <el-form-item-label label="DemandView.filedDesc" v-model="formData.desc" prop="desc" clearable />
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
import { reactive, ref, nextTick, defineExpose } from 'vue'
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
  /** 字段名 */
  field: undefined,
  /** 字段描述 */
  desc: undefined,
})

/** 表格数据检测规则 */
const formRules = reactive({
  field: [{ required: true, message: tryGetI18nText('DemandView.fieldNameIsEmpty'), trigger: 'blur' }],
})

/** 刷新事件 */
const emit = defineEmits(['refreshCb', 'click'])

/** 创建按钮点击事件 */
function onShow() {
  show()
}

/** 先试试窗口 */
async function show(/*自定义参数*/) {
  display.value = true
  await nextTick()

  formDataRef.value.resetFields()
  // 自定义参数初始化
}

// 使用 defineExpose 暴露方法
defineExpose({ show })

/** 提交事件 */
async function onSubmit() {
  if (isSubmitting.value) {
    return
  }

  await formDataRef.value.validate((valid) => {
    if (valid) {
      isSubmitting.value = true
      http_post('/api/admin/demand/field/add', formData.value, true)
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
