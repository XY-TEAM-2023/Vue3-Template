<!-- 规则分组 -->
<template>
  <div class="rule-box">
    <!--   当前分组逻辑AND、OR   -->
    <div style="width: 44px" :class="{ 'group-header': !props.isFirstLine }">
      <el-text v-if="model.match === 'AND'">{{ tryGetI18nText('DemandView.and') }}</el-text>

      <!--  或者  -->
      <el-text v-if="model.match === 'OR'">{{ tryGetI18nText('DemandView.or') }}</el-text>
    </div>

    <!--  分组内的规则  -->
    <div class="group-rules" :style="rulesStyle">
      <el-cascader
        v-model="model.path_id"
        :options="demandStore.modulesTree"
        size="small"
        :props="{
          label: 'name',
          value: 'id',
        }"
        :disabled="true"
        style="width: 100%; padding-bottom: 4px"
      >
        <template #default="{ node, data }">
          <span>{{ data.name }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>

      <module-display-style v-if="model.path_id.length === 3" :rules="moduleRules" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineModel, ref, inject, computed, onMounted } from 'vue'
import { tryGetI18nText } from '@/utils'
import { useDemandStore } from '@/stores/demand'
import ModuleDisplayStyle from '../RuleDisplay/ModuleDisplayStyle.vue'
import { http_post } from '@/axios'
import { cloneDeep } from 'lodash-es'

const model = defineModel()
const props = defineProps({
  isFirstLine: {
    type: Boolean,
    default: true,
  },
  isLastLine: Boolean,
})

const demandStore = useDemandStore()

const rulesStyle = computed(() => {
  return {
    'padding-left': props.isFirstLine ? '6px' : '6px',
  }
})

const isSelectedModel = computed(() => {
  return model.value.path_id.length > 0
})

onMounted(() => {
  refreshModuleData()
})

const isRequesting = ref(false)
const moduleRules = ref([])

function refreshModuleData() {
  if (!isSelectedModel.value) {
    return
  }

  isRequesting.value = true
  http_post('/api/admin/demand/page/plan/module/info', { module_id: model.value.path_id[2] }, false)
    .then((response) => {
      moduleRules.value = JSON.parse(response.result.rules)
    })
    .catch(() => {})
    .finally(() => {
      isRequesting.value = false
    })
}
</script>

<style scoped lang="scss">
$padding-size: 6px;
$border-color: #cecece;
$border-size: 1px;

.rule-box {
  position: relative; /* 相对定位 */
  display: flex;
  //flex-direction: column;
  border: $border-size solid $border-color;
  //padding: 15px 30px;
}

.rule-box + .rule-box {
  margin-top: 8px;
}

.group-header {
  min-width: 55px;
  padding: ($padding-size + $border-size) $padding-size;
  //background-color: $border-color;
  border-right: $border-size solid $border-color;
}

.group-rules {
  flex: 1;
  padding: ($padding-size + $border-size) $padding-size;

  :deep(.el-input__suffix) {
    display: none;
  }

  :deep(.el-input__wrapper) {
    background-color: #ffffff;
  }

  :deep(.el-input__inner) {
    color: #606266 !important;
  }
}
</style>
