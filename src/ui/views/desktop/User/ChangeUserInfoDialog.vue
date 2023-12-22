<template>
  <el-dialog
    v-model="isShow"
    :title="$t('changeUserInfoDialog.title')"
    width="400"
    :close-on-click-modal="false"
    :autofocus="false"
    @close="onClose"
    @cancel="onClose"
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
import ElFormEx from '@/ui/components/ElFormEx.vue'
import { request_user_change_info } from '@/api/user'
import i18n from '@/i18n'

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
const userData = ref(reactive(props.userData))
const isShow = ref(props.isShow)
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.isShow, props.userData],
  ([newIsShow, newUserData], [oldIsShow, oldUserData]) => {
    if (newIsShow !== oldIsShow) {
      isShow.value = newIsShow
    }
    if (newUserData !== oldUserData) {
      userData.value = newUserData
    }
  },
  { deep: true }
)

const isRequesting = ref(false)
function onRegister() {
  formEx.value.validate((isOk) => {
    if (!isOk || isRequesting.value) {
      return
    }

    isRequesting.value = true
    request_user_change_info(userData.value.id, userData.value.password, userData.value.role_id, userData.value.note)
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
