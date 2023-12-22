<template>
  <div style="display: inline-block">
    <el-input
      v-model="modelValue"
      :placeholder="placeholder ? $t(placeholder) : ''"
      :maxlength="maxLength"
      :show-word-limit="showWordLimit"
      :style="inputStyle"
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
  width: String,
  maxLength: {
    type: String,
    default: '',
  },
  showWordLimit: {
    type: Boolean,
    default: false,
  },
})
const { placeholder, showWordLimit } = props
const modelValue = ref(props.modelValue)
const inputStyle = computed(() => {
  return {
    width: props.width === '' ? '100%' : `${props.width}px`,
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
  showCancelSearch.value = true
  emit('search', modelValue)
}

function onBtnCancel() {
  showCancelSearch.value = false
  modelValue.value = emit('update:modelValue', '')
  emit('search', modelValue)
}
</script>
