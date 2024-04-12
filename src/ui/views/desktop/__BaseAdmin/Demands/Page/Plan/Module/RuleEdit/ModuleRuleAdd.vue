<template>
  <el-dialog v-model="model" :title="tryGetI18nText('DemandView.addRule')" width="320" align-center>
    <div style="display: flex; flex-direction: column">
      <el-button class="btn-add-child" @click="onBtnAddChild(1)">
        {{ tryGetI18nText('DemandView.insertRule') }}
      </el-button>
      <el-button class="btn-add-child" @click="onBtnAddChild(2)">
        {{ tryGetI18nText('DemandView.insertGroup') }}
      </el-button>
      <el-button class="btn-add-child" @click="onBtnAddChild(3)">
        {{ tryGetI18nText('DemandView.insertUseModule') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { defineExpose, inject } from 'vue'
import { tryGetI18nText } from '@/utils'

/**
 * 是否显示 Boolean
 */
const model = defineModel()

defineExpose({ addRule })

let tag = ''
let isAddChild = false

function addRule(searchTag, is_add_child) {
  model.value = true
  tag = searchTag
  isAddChild = is_add_child
}

const ADD_RULE = inject('ADD_RULE')
const ADD_GROUP = inject('ADD_GROUP')
const USE_MODULE = inject('USE_MODULE')

function onBtnAddChild(type) {
  if (type === 1) {
    ADD_RULE(tag, isAddChild)
  } else if (type === 2) {
    // 新建分组
    ADD_GROUP(tag, isAddChild)
  } else if (type === 3) {
    // 引用模块
    USE_MODULE(tag, isAddChild)
  }
  model.value = false
}
</script>

<style scoped lang="scss">
.btn-add-child + .btn-add-child {
  margin-top: 4px;
  margin-left: 0;
}
</style>
