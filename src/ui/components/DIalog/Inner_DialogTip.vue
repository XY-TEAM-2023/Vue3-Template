<template>
  <div class="dialog">
    <el-dialog
      v-model="isShow"
      :width="props.width"
      :close-on-click-modal="false"
      :autofocus="false"
      :show-close="false"
      @close="onClose"
      @cancel="onClose"
      class="unselect"
    >
      <p style="white-space: pre-wrap">
        {{ tryGetI18nText(props.content) }}
      </p>

      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="props.displayCancelBtn" @click="props.onClose">
            {{ $t('com.btnCancel') }}
          </el-button>

          <el-button v-loading="isSubmitting" type="primary" @click="onSubmitCb">
            {{ $t('com.btnOk') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { tryGetI18nText } from '@/utils'
import i18n from '@/i18n'

const isShow = ref(false)
const isSubmitting = ref(false)
const props = defineProps({
  content: String,
  displayCancelBtn: Boolean,
  width: {
    type: String,
    default: '300',
  },
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

const title = computed(() => {
  if (props.title) {
    return props.title.indexOf('.') ? i18n.global.t(props.title) : props.title
  } else {
    return props.title
  }
})

const placeholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder.indexOf('.') ? i18n.global.t(props.placeholder) : props.placeholder
  } else {
    return props.placeholder
  }
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
.dialog :deep(.el-dialog__header) {
  border-bottom: none !important;
  height: 0 !important;
}

.dialog :deep(.el-dialog__body) {
  padding-top: 20px !important;
  padding-bottom: 8px !important;
  font-size: 14px !important;
}

.dialog :deep(.el-dialog__footer) {
  border-top: none !important;
  padding-top: 0 !important;
  padding-bottom: 10px !important;
}
</style>
