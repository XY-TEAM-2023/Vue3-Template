<template>
  <el-card-ex style="margin-top: 10px" v-loading="isRequesting || isDeleting" shadow="never" @change-fold="">
    <template #header>
      <span class="unselect" :class="{ 'module-title': !isEditModel }" @click.stop="onBtnModuleDescEdit">
        【{{ module.name }}】{{ module.desc }}
      </span>
    </template>

    <template #default>
      <div class="module-area">
        <module-edit-style v-if="isEditModel" ref="editModelRef" :rules="module.rules" />
        <module-display-style v-else :rules="module.rules" />
      </div>

      <div style="height: 4px" />

      <div v-if="!isEditModel" style="margin-top: 10px">
<!--          <el-alert type="success" show-icon :closable="false" class="alert-desc" @click="onClickSuccess">-->
        <el-alert type="success" show-icon :closable="false">
          <template #title>
            <el-text style="color: #67c23a">
              {{ module.success && module.success !== '' ? module.success : 'empty' }}
            </el-text>
          </template>
        </el-alert>

<!--        <el-alert type="error" show-icon :closable="false" style="margin-top: 6px" class="alert-desc" @click="onClickFail">-->
        <el-alert type="error" show-icon :closable="false" style="margin-top: 6px">
          <template #title>
            <el-text style="color: #f56c6c">
              {{ module.fail && module.fail !== '' ? module.fail : 'empty' }}
            </el-text>
          </template>
        </el-alert>

        <module-edit-info ref="editInfo" @refresh-cb="refreshModuleData" />
        <module-edit-success ref="editSuccessRef" @refresh-cb="refreshModuleData" />
        <module-edit-fail ref="editFailRef" @refresh-cb="refreshModuleData" />
      </div>
    </template>

    <template #footer>
      <div style="padding: 4px 0; width: 100%; display: flex">
        <el-button v-if="isEditModel" size="small" type="info" @click.stop="onBtnDeleteModule">
          {{ tryGetI18nText('com.btnDelete') }}
        </el-button>

        <div style="display: flex; margin-left: auto;">
          <el-button-group>
            <el-button v-if="isEditModel" size="small" type="danger" @click.stop="isEditModel = false">
              {{ tryGetI18nText('com.btnCancel') }}
            </el-button>
            <el-button v-if="isEditModel" size="small" type="success" v-loading="isRequestingSave" @click.stop="onBtnSave">
              {{ tryGetI18nText('com.btnApply') }}
            </el-button>

            <el-button v-if="!isEditModel" size="small" type="primary" @click.stop="onBtnStartEdit">
              {{ tryGetI18nText('DemandView.editRule') }}
            </el-button>
          </el-button-group>
        </div>
      </div>
    </template>
  </el-card-ex>
</template>

<script setup>
import ElCardEx from '@/ui/components/ElCardEx.vue'
import { defineProps, ref, onMounted, nextTick, watch } from 'vue'
import { http_post } from '@/axios'
import ModuleEditStyle from './RuleEdit/ModuleEditStyle.vue'
import { tryGetI18nText } from '@/utils'
import ModuleDisplayStyle from './RuleDisplay/ModuleDisplayStyle.vue'
import ModuleEditSuccess from './ModuleEditSuccess.vue'
import ModuleEditFail from './ModuleEditFail.vue'
import ModuleEditInfo from './ModuleEditInfo.vue'
import Dialog from '@/ui/components/DIalog/Dialog'
import { CaretBottom, CaretTop, CloseBold, Plus } from '@element-plus/icons-vue'

const rules = ref([])

const props = defineProps({
  module_id: {
    type: Number,
  },
  plan_id: Number,
})

/**
 * 模块数据，通过module_id请求获得
 * */
const module = ref({
  name: '',
  desc: '',
  rules: [], // 规则！！！！！！！！！！！！！！！！
})

watch(
  () => [props.module_id],
  ([newValue, oldValue]) => {
    if (newValue !== oldValue) {
      isEditModel.value = false
    }
  },
  { deep: true }
)

/**
 * 是否在编辑模式中
 */
const isEditModel = ref(false)
const isRequesting = ref(false)

const editInfo = ref(null)
const editSuccessRef = ref(null)
const editFailRef = ref(null)

function refreshModuleData() {
  isRequesting.value = true
  http_post('/api/admin/demand/page/plan/module/info', { module_id: props.module_id }, false)
    .then((response) => {
      module.value = response.result
      module.value.rules = JSON.parse(module.value.rules)
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
    })
}

onMounted(() => {
  refreshModuleData()
})

const editModelRef = ref(null)

function onBtnStartEdit() {
  isEditModel.value = true
}

const isRequestingSave = ref(false)

function onBtnSave() {
  isRequestingSave.value = true
  const config = editModelRef.value.getRulesConfig()
  http_post('/api/admin/demand/page/plan/module/rule/set', {
    module_id: props.module_id,
    rules: config,
  }, true)
    .then(() => {
      isEditModel.value = false
      refreshModuleData()
    })
    .catch((err) => {})
    .finally(() => {
      isRequestingSave.value = false
    })
}

function onClickSuccess() {
  editSuccessRef.value.show(module.value)
}

function onClickFail() {
  editFailRef.value.show(module.value)
}

function onBtnModuleDescEdit() {
  editInfo.value.show(module.value)
}

const emit = defineEmits(['refresh-cb'])
const isDeleting = ref(false)

function onBtnDeleteModule() {
  Dialog.tip({
    content: tryGetI18nText('DemandView.deleteModule'),
    width: 300,
    displayCancelBtn: true,
    onClose: () => {
      isDeleting.value = false
    },
    onSubmit: () => {
      isDeleting.value = true
      http_post(
        '/api/admin/demand/page/plan/module/delete',
        {
          plan_id: module.value.plan_id,
          module_id: module.value.id,
        },
        true
      )
        .then(() => {
          emit('refresh-cb')
        })
        .catch(({ status, msg, data }) => {
          if (status === 71) {
            let tipStr = tryGetI18nText('DemandView.deleteModuleFail') + data.usings
            Dialog.tip({
              content: tipStr,
            })
          }
        })
        .finally(() => {
          isDeleting.value = false
        })
    },
  })
}
</script>

<style scoped lang="scss">
.module-area {
  display: flex;
  flex-direction: column;
  padding: 0 0 0 0;
}

.el-alert {
  padding: 4px 16px !important;
}

.alert-desc:hover {
  cursor: pointer;
  text-decoration: underline;
}

.module-title:hover {
  color: #409eff;
  text-decoration-line: underline;
}
</style>
