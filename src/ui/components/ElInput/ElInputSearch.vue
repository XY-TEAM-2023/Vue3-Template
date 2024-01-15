<template>
  <div style="display: inline-block">
    <el-input
      v-model="modelValue"
      :placeholder="placeholder ? $t(placeholder) : ''"
      :maxlength="maxLength"
      :show-word-limit="showWordLimit"
      :style="inputStyle"
      :clearable="clearable"
      @input="updateModel"
    >
      <template #append>
        <el-button :icon="Search" @click="onSearch" />
      </template>
    </el-input>

    <el-button v-if="showCancelSearch" :type="'danger'" style="margin-left: 4px" @click="onBtnCancel">
      {{ $t('com.btnCancelSearch') }}
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 声明接受的props
const props = defineProps({
  modelValue: String,
  placeholder: String,
  // 直接输入数字
  width: String,
  maxLength: {
    type: String,
    default: '',
  },
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
})
const { placeholder, showWordLimit } = props
const modelValue = ref(props.modelValue)
const inputStyle = computed(() => {
  return {
    width: props.width === '' ? '100%' : `${props.width}px`,
    // maxWidth: props.width === '' ? '100% !important' : `${props.width}px !important`,
  }
})

// 声明context.emit
const emit = defineEmits(['update:modelValue', 'input', 'search'])

// 定义更新modelValue的方法
const updateModel = (newValue) => {
  emit('input', newValue)
  emit('update:modelValue', newValue)
}

const showCancelSearch = ref(false)

function onSearch() {
  if (modelValue.value === '') {
    return
  }
  showCancelSearch.value = true
  emit('search', modelValue)
}

function onBtnCancel() {
  showCancelSearch.value = false
  modelValue.value = emit('update:modelValue', '')
  emit('search', modelValue)
}
</script>
