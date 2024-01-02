<template>
  <div class="custom-dialog">
    <el-dialog
      v-model="isShow"
      title=""
      :width="props.width"
      :close-on-click-modal="false"
      :autofocus="false"
      :show-close="false"
      @close="onClose"
      @cancel="onClose"
    >
      <div style="display: flex; flex-direction: row; padding: 0 20px">
        <ui-svg :svg-code="svgWarning" size="24px" svg-color="#cc9a4d" />
        <div style="display: flex; align-content: center; align-items: center; margin-left: 10px">
          {{ props.content }}
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onClose">
            {{ $t('com.btnCancel') }}
          </el-button>

          <el-button type="primary" @click="onsubmit">
            {{ $t('com.btnSubmit') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref, watch } from 'vue'
import UiSvg from '@/ui/components/UiSvg.vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Title',
  },
  content: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '300',
  },
  onSubmit: Function,
})

const svgWarning = `<svg t="1703755256783" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18835" width="32" height="32"><path d="M1006.4 876.4 585.6 64.128c-40.464-78.128-106.72-78.128-147.184 0L17.6 876.4c-40.464 78.128-1.6 142.064 86.4 142.064l816 0C1008 1018.464 1046.88 954.528 1006.4 876.4zM460.816 313.168c0-28.256 22.912-51.184 51.184-51.184s51.216 22.944 51.216 51.184l0 345.632c0 28.256-22.944 51.184-51.216 51.184s-51.184-22.944-51.184-51.184L460.816 313.168zM512 905.168c-35.344 0-64-28.624-64-64 0-35.344 28.656-64 64-64s64 28.656 64 64C576 876.544 547.344 905.168 512 905.168z" p-id="18836"></path></svg>`

const emit = defineEmits(['close', 'submit'])

const isShow = ref(props.isShow)
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.isShow],
  ([newIsShow], [oldIsShow]) => {
    if (newIsShow !== oldIsShow) {
      isShow.value = newIsShow
    }
  },
  { deep: true }
)

/** 关闭按钮 */
const onClose = () => {
  isShow.value = false
  emit('close')
}

/** 确定按钮 */
const onsubmit = () => {
  if (props.onSubmit) {
    props.onSubmit()
  }
  isShow.value = false
}
</script>
<style scoped>
.custom-dialog :deep(.el-dialog__header) {
  border-bottom: none !important;
  //background-color: #42bb85;
  height: 24px;
}

.custom-dialog :deep(.el-dialog__headerbtn) {
  width: 24px !important;
  height: 24px !important;
  margin-top: 4px;
  margin-right: 4px;
}

.custom-dialog :deep(.el-dialog__body) {
  border-bottom: none !important;
  //background-color: #c7a900;
  padding: 0 0 0 0 !important;
}

.custom-dialog :deep(.el-dialog__footer) {
  border-top: none !important;
  //background-color: #007aff;
}
</style>
