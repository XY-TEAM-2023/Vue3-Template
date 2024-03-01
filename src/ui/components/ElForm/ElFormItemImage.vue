<template>
  <el-form-item :label="label" :required="required" :prop="props.prop" class="unselect">
    <el-upload-image
      v-model="model"
      :height="props.height"
      :width="props.width"
      :max-size-mb="props.maxSizeMb"
      :types="types"
      :readonly="props.readonly"
      :desc="props.desc"
    />
  </el-form-item>
</template>

<script setup>
import { computed, defineProps, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'
import ElUploadImage from '@/ui/components/ElUpload/ElUploadImage.vue'

const model = defineModel()
console.log(model.value)
const props = defineProps({
  /** 是否必传 */
  required: {
    type: Boolean,
    default: undefined,
  },
  /** 支持直接输入国际化的key */
  label: String,
  /** 规则检查的prop */
  prop: String,
  /** 图片下方描述文本 */
  desc: String,
  /** 图片框宽度 */
  width: {
    type: Number,
    default: 200,
  },
  /** 图片框高度 */
  height: {
    type: Number,
    default: 200,
  },
  /** 图片格式显示:image/jpeg、image/png、image/gif  */
  types: {
    type: Array,
    default: () => [],
  },
  /** 图片大小限制 */
  maxSizeMb: {
    type: Number,
    default: 0,
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
})

const label = computed(() => {
  return tryGetI18nText(props.label)
})
</script>

<style scoped lang="scss"></style>
