<template>
  <el-dialog
    v-model="isShow"
    :title="title"
    :width="props.width"
    :close-on-click-modal="false"
    :autofocus="false"
    :show-close="false"
    @close="onClose"
    @cancel="onClose"
    class="unselect"
  >
    <el-input-float v-model="inputValue" :placeholder="placeholder" :clearable="props.clearable"> </el-input-float>

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

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import i18n from '@/i18n'
import ElInputFloat from '@/ui/components/ElInput/ElInputFloat.vue'

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
<style scoped></style>
