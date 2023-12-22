<template>
  <el-dialog
    v-model="isShow"
    :title="$t('userListView.createAccount')"
    width="400"
    :close-on-click-modal="false"
    :autofocus="false"
    @close="onClose"
    @cancel="onClose"
    class="unselect"
  >
    <el-form-ex ref="formEx" :model="form" :rules="rules">
      <!--   账号   -->
      <el-form-item :label="$t('createUserDialog.account')" prop="account">
        <el-input v-model="form.account" />
      </el-form-item>

      <!--   密码   -->
      <el-form-item :label="$t('createUserDialog.password')" prop="password">
        <el-input v-model="form.password" />
      </el-form-item>

      <!--   备注   -->
      <el-form-item :label="$t('createUserDialog.note')">
        <el-input v-model="form.note" type="textarea" />
      </el-form-item>
    </el-form-ex>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">{{ $t('com.btnCancel') }}</el-button>
        <el-button type="primary" :v-loading="isRequesting" @click="onRegister">{{ $t('com.btnSubmit') }} </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, reactive, ref, watch } from 'vue'
import ElFormEx from '@/ui/components/ElFormEx.vue'
import { request_user_register } from '@/api/user'
import i18n from '@/i18n'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
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
  account: '',
  password: '',
  role_id: 1, //-1,
  note: '',
}

const form = ref(reactive({ ...defaultFormData }))

// 数据校验
const rules = reactive({
  account: [
    {
      required: true,
      message: i18n.global.t('createUserDialog.accountMustInput'),
      trigger: 'blur',
    },
    { min: 4, max: 20, message: i18n.global.t('createUserDialog.accountLengthError'), trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: i18n.global.t('createUserDialog.passwordMustInput'),
      trigger: 'blur',
    },
    { min: 6, max: 20, message: i18n.global.t('createUserDialog.passwordLengthError'), trigger: 'blur' },
  ],
})

const isRequesting = ref(false)
function onRegister() {
  formEx.value.validate((isOk) => {
    if (!isOk || isRequesting.value) {
      return
    }

    isRequesting.value = true
    request_user_register(form.value.account, form.value.password, form.value.role_id, form.value.note)
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
