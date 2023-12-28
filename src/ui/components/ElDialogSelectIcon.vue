<template>
  <el-dialog
    v-model="isShow"
    :title="$t(props.title)"
    :width="props.width"
    :close-on-click-modal="false"
    :autofocus="false"
    @close="onClose"
    @cancel="onClose"
    class="unselect"
  >
    <div class="icon-container">
      <component v-for="icon in elementIcons" :key="icon" :is="icon" />
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
</template>

<script lang="ts" setup>
import { defineEmits, reactive, ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { config } from '@/config'

const elementIcons = config.elementPlusIconNames

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Title',
  },
  width: {
    type: String,
    default: '300',
  },
  // 输入框相关
  defaultIcon: String,
})

const defaultValue = ref(cloneDeep(props.defaultValue))
const emit = defineEmits(['close', 'submit'])

const isShow = ref(props.isShow)
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.isShow, props.defaultValue],
  ([newIsShow, newDefaultValue], [oldIsShow, oldDefaultValue]) => {
    if (newIsShow !== oldIsShow) {
      isShow.value = newIsShow
    }
    if (newDefaultValue !== oldDefaultValue) {
      defaultValue.value = newDefaultValue
    }
  },
  { deep: true }
)

const onClose = () => {
  isShow.value = false
  emit('close')
}

const onsubmit = () => {
  emit('submit', defaultValue.value)
}
</script>
<style scoped>
.icon-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #007aff;
}
</style>
