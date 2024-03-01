<template>
  <el-dialog
    v-model="isShow"
    :title="tryGetI18nText(props.title)"
    :width="props.width"
    :close-on-click-modal="false"
    :autofocus="false"
    :show-close="false"
    @close="onClose"
    @cancel="onClose"
    class="unselect"
  >
    <el-date-picker-date-time
      v-model="inputValue"
      :placeholder="tryGetI18nText(props.placeholder)"
      :clearable="props.clearable"
      style="width: 100%"
    />

    <div v-if="props.desc && props.desc !== ''" class="desc">
      {{ props.desc }}
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.onClose">
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading="isSubmitting" type="primary" @click="onSubmitCb">
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import ElDatePickerDateTime from '@/ui/components/ElDatePicker/ElDatePickerDateTime.vue'
import { tryGetI18nText } from '@/utils'

const isShow = ref(false)
const isSubmitting = ref(false)
const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  width: {
    type: String,
    default: '300',
  },
  // 输入框相关
  defaultValue: Number,
  placeholder: String,
  clearable: {
    type: Boolean,
    default: true,
  },
  desc: String,
  onClose: {
    type: Function,
    default: () => {},
  },
  onSubmit: {
    type: Function,
    default: () => {},
  },
})
const inputValue = ref(cloneDeep(props.defaultValue))

onMounted(() => {
  isShow.value = true
})

function onCancelSubmit() {
  isSubmitting.value = false
}

function onSubmitCb() {
  isSubmitting.value = true
  props.onSubmit && props.onSubmit(inputValue.value, onCancelSubmit)
}
</script>

<style scoped>
.desc {
  font-size: 12px;
  margin-top: 6px;
}
</style>
