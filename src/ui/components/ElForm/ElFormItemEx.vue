<template>
  <el-form-item
    :prop="props.prop"
    :label="props.label"
    :label-width="props.labelWidth"
    :required="props.required"
    :rules="props.rules"
    :error="props.error"
    :show-message="props.showMessage"
    :inline-message="props.inlineMessage"
    :size="props.size"
    ref="formItemRef"
  >
    <slot></slot>
    <template #label>
      <slot name="label"></slot>
    </template>
    <template v-slot:error="{ error }">
      <slot name="error" :error="error"></slot>
    </template>
  </el-form-item>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { ElFormItem } from 'element-plus'

const props = defineProps({
  /** 表单域 model 字段 */
  prop: String,
  /** 标签文本 */
  label: String,
  /** 表单域标签的宽度 */
  labelWidth: {
    type: String,
    default: 'auto',
  },
  /** 是否必填 */
  required: {
    type: Boolean,
    default: undefined,
  },
  /** 表单验证规则 */
  rules: Object,
  /** 表单域验证错误信息 */
  error: String,
  /** 是否显示校验错误信息 */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /** 以行内形式展示校验信息 */
  inlineMessage: Boolean,
  /** 控制表单域下组件的尺寸 */
  size: String,
})

const formItemRef = ref(null)

defineExpose({
  /** 对表单项进行重置 */
  resetField() {
    formItemRef.value.resetField()
  },
  /** 移除表单项的校验结果 */
  clearValidate() {
    formItemRef.value.clearValidate()
  },
})
</script>
