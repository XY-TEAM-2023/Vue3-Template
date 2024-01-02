<template>
  <el-dialog
    v-model="isShow"
    :title="$t('changeRoleInfoDialog.title')"
    width="1000"
    :close-on-click-modal="false"
    :autofocus="false"
    @close="onClose"
    @cancel="onClose"
    @open="onOpen"
    class="unselect"
  >
    <el-form-ex ref="formEx" :model="roleData">
      <!--   账号   -->
      <el-form-item :label="$t('changeRoleInfoDialog.name')">
        <el-input v-model="roleData.name" disabled />
      </el-form-item>

      <!--   备注   -->
      <el-form-item :label="$t('changeRoleInfoDialog.note')">
        <el-input v-model="roleData.note" show-word-limit maxlength="100" type="textarea" />
      </el-form-item>
    </el-form-ex>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">
          {{ $t('com.btnCancel') }}
        </el-button>
        <el-button type="primary" :v-loading="isRequesting" @click="onSubmit">
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, reactive, ref, watch } from 'vue'
import ElFormEx from '@/ui/components/ElFormEx.vue'
import { request_role_edit } from '@/api/role'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  roleData: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

// eslint-disable-next-line vue/no-dupe-keys
const roleData = ref(cloneDeep(props.roleData))
const isShow = ref(props.isShow)
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.isShow, props.roleData],
  ([newIsShow, newUserData], [oldIsShow, oldUserData]) => {
    if (newIsShow !== oldIsShow) {
      isShow.value = newIsShow
    }
    if (newUserData !== oldUserData) {
      roleData.value = cloneDeep(newUserData)
    }
  }
)

function onOpen() {}

const isRequesting = ref(false)
function onSubmit() {
  if (isRequesting.value) {
    return
  }

  isRequesting.value = true
  request_role_edit(roleData.value.id, roleData.value.note)
    .then(() => {
      onClose()
      emit('refresh')
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
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
