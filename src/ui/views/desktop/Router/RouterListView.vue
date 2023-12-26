<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 添加 height: 100%; -->
    <div style="margin-bottom: 10px">
      <!--  创建账号  -->
      <el-button type="primary" @click="onCreateAccount">
        {{ $t('com.btnCreate') }}
      </el-button>
    </div>

    <el-table-ex :data="routerConfig" :show-select="true" row-key="name">
      <el-table-column prop="name" align="left" width="140" />

      <!--  组件图标  -->
      <el-table-column prop="meta.icon" align="center" :label="$t('routerListView.icon')" width="80">
        <template #default="scope">
          <div v-if="scope.row.meta && scope.row.meta.icon" style="display: flex; justify-content: center">
            <component
              v-if="isElementIcon(scope.row.meta.icon)"
              :is="scope.row.meta.icon"
              style="width: 23px; height: 23px; color: #606266"
            />
            <ui-svg v-else size="23px" :svg-path="scope.row.meta.icon" svg-color="#606266" />
          </div>
        </template>
      </el-table-column>

      <!--  英文  -->
      <el-table-column align="center" :label="$t('routerListView.english')" width="160" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link @click="onEditI18nLabel(scope.row.meta.title, 'en')">
            {{ $t(scope.row.meta.title, 'en') }}
          </el-button>
        </template>
      </el-table-column>
      <!--  韩文  -->
      <el-table-column align="center" :label="$t('routerListView.korean')" width="160" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ $t(scope.row.meta.title, 'ko') }}
        </template>
      </el-table-column>
      <!--  中文  -->
      <el-table-column align="center" :label="$t('routerListView.chinese')" width="160" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ $t(scope.row.meta.title, 'zh') }}
        </template>
      </el-table-column>

      <!--   角色名   -->
      <el-table-column prop="meta.title" align="center" width="140" :label="$t('routerListView.title')" />
    </el-table-ex>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'
import { asyncRoutes } from '@/router/config'
import UiSvg from '@/ui/components/UiSvg.vue'
import { config } from '@/config'
import { cloneDeep } from 'lodash-es'

const routerConfig = ref(reactive(asyncRoutes))

function isElementIcon(icon) {
  return !icon.includes('.')
}

/**
 * 显示编辑I18n文本窗口
 */
function onEditI18nLabel(path, local) {
  ElMessageBox.prompt(i18n.global.t('app.editI18nLabel'), '', {
    confirmButtonText: i18n.global.t('com.btnOk'),
    cancelButtonText: i18n.global.t('com.btnCancel'),
    inputValue: i18n.global.t(path, local),
  })
    .then(({ value }) => {
      console.log(value)
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss"></style>
