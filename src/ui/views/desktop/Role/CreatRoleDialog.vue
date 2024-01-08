<template>
  <el-dialog
    v-model="isShow"
    :title="$t('createRoleDialog.title')"
    width="400"
    :close-on-click-modal="false"
    :autofocus="false"
    @close="onClose"
    @cancel="onClose"
    class="unselect"
  >
    <el-form-ex ref="formEx" :model="form" :rules="rules">
      <!--   角色名   -->
      <el-form-item :label="$t('createRoleDialog.name')" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <!--   角色备注   -->
      <el-form-item :label="$t('createRoleDialog.note')">
        <el-input v-model="form.note" show-word-limit maxlength="100" type="textarea" />
      </el-form-item>
    </el-form-ex>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">
          {{ $t('com.btnCancel') }}
        </el-button>
        <el-button type="primary" :v-loading="isRequesting" @click="onCreate">
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, reactive, ref, watch } from 'vue'
import ElFormEx from '@/ui/components/ElFormEx.vue'
import i18n from '@/i18n'
import { http_post } from '@/utils/axios'
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  parent: Number,
})

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

const defaultFormData = {
  name: '',
  note: '',
}

const form = ref(reactive({ ...defaultFormData }))

// 数据校验
const rules = reactive({
  name: [
    {
      required: true,
      message: i18n.global.t('createRoleDialog.roleInputTip'),
      trigger: 'blur',
    },
    { min: 4, max: 20, message: i18n.global.t('createRoleDialog.roleLengthTip'), trigger: 'blur' },
  ],
})

const isRequesting = ref(false)
function onCreate() {
  formEx.value.validate((isOk) => {
    if (!isOk || isRequesting.value) {
      return
    }
    isRequesting.value = true

    // 创建角色
    http_post('/api/admin/role/create', { parent: props.parent, name: form.value.name, note: form.value.note }, true)
      .then(() => {
        form.value = reactive(defaultFormData)
        onClose()
        // formEx.value.resetFields()
        emit('refresh')
      })
      .catch(() => {})
      .finally(() => {
        isRequesting.value = false
      })
  })
}

/** 作为子组件时，定义有什么事件 */
const emit = defineEmits(['close', 'refresh'])
const formEx = ref(null)
// 定义更新modelValue的方法
const onClose = () => {
  isShow.value = false
  emit('close')
}
</script>
<style scoped></style>
