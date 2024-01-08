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
    @open="onOpen"
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

      <!--   角色   -->
      <el-form-item :label="$t('createUserDialog.role')" prop="role_id">
        <el-select v-model="form.role_id" :v-loading="needInit" clearable style="width: 100%">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span v-if="item.note.length > 10" style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
              {{ item.note.substring(0, 10) + '...' }}
            </span>
            <span v-else-if="item.note.length > 0" style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
              {{ item.note.substring(0, 10) }}
            </span>
          </el-option>
        </el-select>
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
import i18n from '@/i18n'
import { http_post } from '@/utils/axios'

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
  role_id: '',
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
  role_id: [
    {
      required: true,
      message: i18n.global.t('createUserDialog.chooseRoleTip'),
      trigger: 'blur',
    },
  ],
})

const isRequesting = ref(false)
function onRegister() {
  formEx.value.validate((isOk) => {
    if (!isOk || isRequesting.value) {
      return
    }

    isRequesting.value = true
    http_post(
      '/api/admin/user/register',
      { account: form.value.account, password: form.value.password, role_id: form.value.role_id, note: form.value.note },
      true
    )
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

const needInit = ref(true)
const roles = ref(reactive([]))
function onOpen() {
  if (!needInit.value) {
    return
  }

  //拉取子角色列表
  http_post('/api/admin/role/list', { type: 2 }, false)
    .then((data) => {
      roles.value = data.result
      needInit.value = false
    })
    .catch(() => {})
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
