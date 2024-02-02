<template>
  <el-dialog
    v-model="isShow"
    :title="$t('changeUserInfoDialog.title')"
    width="400"
    :close-on-click-modal="false"
    :autofocus="false"
    @close="onClose"
    @cancel="onClose"
    @open="onOpen"
    class="unselect"
  >
    <el-form-ex ref="formEx" :model="userData">
      <!--   账号   -->
      <el-form-item :label="$t('changeUserInfoDialog.account')">
        <el-input v-model="userData.account" disabled />
      </el-form-item>

      <!--   密码   -->
      <el-form-item :label="$t('changeUserInfoDialog.password')" prop="password">
        <el-input v-model="userData.password" />
      </el-form-item>

      <!--   角色   -->
      <el-form-item :label="$t('createUserDialog.role')" prop="role">
        <el-select v-model="userData.role_id" :v-loading="needInit" clearable style="width: 100%">
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

      <el-form-item :label="$t('changeUserInfoDialog.accountStatus')">
        <el-radio-group v-model="userData.status">
          <el-radio :label="0">{{ $t('changeUserInfoDialog.normal') }}</el-radio>
          <el-radio :label="1">{{ $t('changeUserInfoDialog.lock') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--   备注   -->
      <el-form-item :label="$t('changeUserInfoDialog.note')">
        <el-input v-model="userData.note" type="textarea" />
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
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import { http_post } from '@/axios'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  userData: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

// eslint-disable-next-line vue/no-dupe-keys
const userData = ref(cloneDeep(props.userData))
const isShow = ref(props.isShow)
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.isShow, props.userData],
  ([newIsShow, newUserData], [oldIsShow, oldUserData]) => {
    if (newIsShow !== oldIsShow) {
      isShow.value = newIsShow
    }
    if (newUserData !== oldUserData) {
      userData.value = cloneDeep(newUserData)
    }
  }
)

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

const isRequesting = ref(false)
function onRegister() {
  formEx.value.validate((isOk) => {
    if (!isOk || isRequesting.value) {
      return
    }

    isRequesting.value = true
    http_post(
      '/api/admin/user/updateInfo',
      {
        user_id: userData.value.id,
        password: userData.value.password,
        role_id: userData.value.role_id,
        status: userData.value.status,
        note: userData.value.note,
      },
      true
    )
      .then(() => {
        onClose()
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
