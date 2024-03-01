<template>
  <div style="display: flex; flex-direction: column">
    <div :style="`width: ${props.width}px; height: ${props.height}px`">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :on-change="onSelectChange"
        :auto-upload="false"
        :class="props.readonly ? 'disabled-component' : ''"
      >
        <el-image v-if="model && model.length > 0" fit="contain" :src="imgSrc" :style="style_avatar" />

        <el-icon v-else class="avatar-uploader-icon" :style="style_uploader_icon">
          <Plus />
        </el-icon>

        <el-button
          v-if="!props.readonly && model && model.length > 0"
          class="delete-button"
          size="small"
          type="danger"
          :icon="Delete"
          @click.stop="removeImg"
        />
      </el-upload>
    </div>

    <div v-if="props.desc && props.desc.length > 0" class="desc">
      {{ tryGetI18nText(props.desc) }}
    </div>
  </div>
</template>

<script setup>
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { defineProps, computed, defineModel } from 'vue'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  /** v-module: base64图片 */

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
  /** 图片下方描述文本 */
  desc: String,
})

const imgSrc = computed(() => {
  if (model.value.startsWith('http')) {
    return model.value
  } else if (model.value.length > 0) {
    return 'data:image/jpeg;base64,' + model.value
  } else {
    return ''
  }
})

/** 选择图片 */
function onSelectChange(uploadFile) {
  // 是否是允许的文件
  const rawFile = uploadFile.raw

  if (props.types.length > 0 && !props.types.includes(rawFile.type)) {
    ElMessage.error(tryGetI18nText('com.imgTypeError'))
    return false
  }

  // 是否允许的图片大小
  if (props.maxSizeMb > 0 && rawFile.size / 1024 / 1024 > props.maxSizeMb) {
    ElMessage.error(tryGetI18nText('com.imgSizeError', { size: props.maxSizeMb }))
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(rawFile)
  reader.onload = () => {
    model.value = reader.result.split(',')[1]
  }
}

const style_avatar = computed(() => {
  return {
    display: 'block',
    width: `${props.width - 2}px`,
    height: `${props.height - 2}px`,
  }
})

const style_uploader_icon = computed(() => {
  return {
    width: `${props.width - 2}px`,
    height: `${props.height - 2}px`,
  }
})

function removeImg() {
  model.value = ''
}
</script>

<style scoped>
.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.delete-button {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 2px 0 0 0 !important;
}

.disabled-component {
  /* 禁止接受鼠标事件 */
  pointer-events: none;
}

.desc {
  font-size: 12px;
  color: #a3a3a3;
}
</style>
