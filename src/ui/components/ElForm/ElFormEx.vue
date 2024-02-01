<template>
  <div ref="textElement" class="offscreen-text">{{ temp_title }}</div>
  <el-form
    ref="formRef"
    :model="props.model"
    :rules="props.rules"
    :label-width="formWidth"
    :show-message="props.showMessage"
    :status-icon="props.statusIcon"
    :disabled="props.disabled"
    :label-position="props.labelPosition"
    :size="props.size"
    :scroll-to-error="props.scrollToError"
  >
    <slot></slot>
  </el-form>
</template>

<script setup>
import { nextTick, defineProps, computed, onMounted, reactive, ref, watch, defineExpose } from 'vue'

const props = defineProps({
  model: Object,
  rules: Object,
  showMessage: {
    type: Boolean,
    default: true,
  },
  statusIcon: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  scrollToError: {
    type: Boolean,
    default: false,
  },
  labelPosition: {
    type: String,
    default: 'top',
  },
})

// 实现EL的参数检查 ---------------------------------------------------------------------
const formRef = ref(null)
const validate = (cb) => {
  formRef.value.validate(cb)
}

const resetFields = () => {
  formRef.value.resetFields()
}

// 暴漏方法
defineExpose({ validate, resetFields })

// 自动计算标题宽度 ---------------------------------------------------------------------
const temp_title = ref('')
const temp_width = ref(0)
const formWidth = computed(() => {
  if (temp_width.value > 0) {
    return temp_width.value
  } else {
    return 'auto'
  }
})
const textElement = ref(null)
onMounted(() => {
  const elements = document.querySelectorAll('.el-form-item__label')

  let maxWidth = 0
  let index = -1
  const calcLabelWidth = () => {
    if (++index === elements.length) {
      return
    }

    temp_title.value = elements[index].textContent
    nextTick(() => {
      if (textElement.value.getBoundingClientRect().width > maxWidth) {
        maxWidth = textElement.value.getBoundingClientRect().width
      }
      calcLabelWidth()
    })
  }
  calcLabelWidth()

  // if (textElement.value) {
  //   const size = textElement.value.getBoundingClientRect()
  //   console.log(`文本宽度: ${size.width}px, 文本高度: ${size.height}px`)
  // }
})
</script>

<style scoped lang="scss">
.offscreen-text {
  position: absolute;
  left: -9999px;
  top: -9999px;
}
</style>
