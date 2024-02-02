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
    center
    class="unselect"
  >
    <div style="width: 100%; display: flex; flex-direction: column; align-items: center">
      <qrcode-vue :value="content" :size="200" style="margin-left: auto; margin-right: auto"></qrcode-vue>
      <div v-if="props.desc" style="margin-top: 10px">
        <p style="white-space: pre-wrap">
          {{ desc }}
        </p>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="props.onClose">
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading="isSubmitting" type="primary" @click="onSubmitCb"> {{ submitBtnLabel }} </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import i18n from '@/i18n'

const isShow = ref(false)
const isSubmitting = ref(false)
const props = defineProps({
  width: {
    type: String,
    default: '300',
  },
  title: {
    type: String,
    default: 'Title',
  },
  content: String,
  desc: String,
  submitBtnLabel: {
    type: String,
    default: 'com.btnSubmit',
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

const submitBtnLabel = computed(() => {
  if (props.submitBtnLabel) {
    return props.submitBtnLabel.indexOf('.') ? i18n.global.t(props.submitBtnLabel) : props.submitBtnLabel
  } else {
    return props.submitBtnLabel
  }
})

const desc = computed(() => {
  if (props.desc) {
    return props.desc.indexOf('.') ? i18n.global.t(props.desc) : props.desc
  } else {
    return props.desc
  }
})

function onCancelSubmit() {
  isSubmitting.value = false
}

function onSubmitCb() {
  isSubmitting.value = true
  props.onSubmit && props.onSubmit(onCancelSubmit)
}
</script>
<style scoped></style>
