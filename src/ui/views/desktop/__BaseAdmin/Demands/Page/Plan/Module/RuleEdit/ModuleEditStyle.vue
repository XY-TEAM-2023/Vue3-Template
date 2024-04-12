<!--编辑模式下的模块-->
<template>
  <div v-loading="isRequestingFields">
    <module-rule-add ref="addRuleRef" />

    <div class="edit-area" v-if="rules.length > 0">
      <!--    规则列表    -->
      <module-rule
        v-for="(rule, i) in rules"
        :key="i"
        :rule="rule"
        parent-tag=""
        :is-first-line="i === 0"
        :is-last-line="i + 1 === rules.length"
      />
    </div>
    <div v-else>
      <!--    添加规则    -->
      <el-button style="width: 100%" @click="onAddRule">
        <el-icon>
          <Plus />
        </el-icon>
        {{ tryGetI18nText('DemandView.addRule') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { provide, ref, onMounted, watch } from 'vue'
import { tryGetI18nText } from '@/utils'
import { Plus } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { newGroup, newModule, newRule } from '../../../../inner_util'
import ModuleRule from './ModuleRule.vue'
import ModuleRuleAdd from './ModuleRuleAdd.vue'
import { useDemandStore } from '@/stores/demand'
import Dialog from '@/ui/components/DIalog/Dialog'

defineExpose({ getRulesConfig })

const props = defineProps({
  rules: Array,
})

const rules = ref([])
const demandStore = useDemandStore()

watch(
  () => [props.rules],
  ([newValue, oldValue]) => {
    rules.value = cloneDeep(newValue)
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  refreshFields()
  refreshModules()
})

const isRequestingFields = ref(false)

function refreshFields() {
  isRequestingFields.value = true
  demandStore
    .refreshFields()
    .then(() => {
      console.log('fields', demandStore.fields)
    })
    .catch(() => {
      Dialog.tip({
        content: tryGetI18nText('DemandView.initFail'),
        displayCancelBtn: true,
        onSubmit: refreshFields,
      })
    })
    .finally(() => {
      isRequestingFields.value = false
    })
}

function refreshModules() {
  isRequestingFields.value = true
  demandStore
    .refreshModules()
    .then(() => {
      console.log('fields', demandStore.fields)
    })
    .catch(() => {
      Dialog.tip({
        content: tryGetI18nText('DemandView.initFail'),
        displayCancelBtn: true,
        onSubmit: refreshModules,
      })
    })
    .finally(() => {
      isRequestingFields.value = false
    })
}

/**
 * 获取Rules配置
 */
function getRulesConfig() {
  return rules.value
}

/**
 * 修改Rules里的数据
 * @param tag
 * @param callback 回调方法(目标数组，目标tag的下标)
 */
function changeRulesByTag(tag, callback) {
  const findAndAddElement = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].tag === tag) {
        callback(arr, i)
        return true
      }
      if (arr[i].type === 'group' && findAndAddElement(arr[i].children)) {
        return true
      }
    }
    return false
  }

  findAndAddElement(rules.value)
}

const addRuleRef = ref(null)

function onAddRule() {
  addRuleRef.value.addRule('', false)
}

/**
 * 显示添加规则窗口
 */
provide('SHOW_ADD_RULE_DIALOG', (tag = '', isAddChild = false) => {
  addRuleRef.value.addRule(tag, isAddChild)
})

/**
 * 添加规则
 */
provide('ADD_RULE', (tag = '', isAddChild = false) => {
  if (tag === '') {
    rules.value.push(newRule())
  } else {
    changeRulesByTag(tag, (arr, i) => {
      if (isAddChild) {
        arr[i].children.push(newRule())
      } else {
        arr.splice(i + 1, 0, newRule())
      }
    })
  }
})
/**
 * 添加分组
 */
provide('ADD_GROUP', (tag = '', isAddChild = false) => {
  if (tag === '') {
    rules.value.push(newGroup())
  } else {
    changeRulesByTag(tag, (arr, i) => {
      if (isAddChild) {
        arr[i].children.push(newGroup())
      } else {
        arr.splice(i + 1, 0, newGroup())
      }
    })
  }
})
/**
 * 添加分组
 */
provide('USE_MODULE', (tag = '', isAddChild = false) => {
  if (tag === '') {
    rules.value.push(newModule())
  } else {
    changeRulesByTag(tag, (arr, i) => {
      if (isAddChild) {
        arr[i].children.push(newModule())
      } else {
        arr.splice(i + 1, 0, newModule())
      }
    })
  }
})

// --------------------------------------------------------
/** 移除规则 */
provide('REMOVE_RULE', (tag) => {
  if (tag === '') {
    return
  }
  changeRulesByTag(tag, (arr, i) => {
    arr.splice(i, 1)
  })
})
/** 规则上移 */
provide('MOVE_RULE_UP', (tag) => {
  if (tag === '') {
    return
  }
  changeRulesByTag(tag, (arr, i) => {
    if (arr.length > 1 && i !== 0) {
      arr[i] = arr.splice(i - 1, 1, arr[i])[0]
    }
  })
})
/** 规则下移 */
provide('MOVE_RULE_DOWN', (tag) => {
  if (tag === '') {
    return
  }
  changeRulesByTag(tag, (arr, i) => {
    if (arr.length > 1 && i + 1 !== arr.length) {
      arr[i] = arr.splice(i + 1, 1, arr[i])[0]
    }
  })
})
</script>

<style scoped lang="scss">
.edit-area {
  width: 100%;
  overflow: auto;
  white-space: nowrap;
  padding-bottom: 10px;
}
</style>
