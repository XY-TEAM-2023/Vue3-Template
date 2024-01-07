<template>
  <div style="display: flex; flex-direction: column; width: 800px; height: 100%; min-width: 400px">
    <!--  页面权限  -->
    <el-card style="width: 100%" class="unselect" shadow="never">
      <!--  标题  -->
      <template #header>
        <div style="display: flex" class="flex-left-center">
          <ui-svg :svg-code="svgPermission" svg-size="19" svg-color="#3259ce" />
          <span style="margin: 2px 0 0 4px">
            {{ $t('rolePermissionView.title') }}
          </span>
        </div>
      </template>

      <!--  内容  -->
      <div style="min-height: 200px">
        <ui-menu-permission
          :menu-name="props.menu.name"
          :role-id="props.roleId"
          :has-permission="props.menu.permission"
          display-editor
          @update-permission="onUpdatePermission"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import UiMenuPermission from '@/ui/components/UiMenuPermission.vue'
import UiSvg from '@/ui/components/UiSvg.vue'

const props = defineProps({
  menu: Object,
  roleId: Number,
  rolePermission: Number,
})
const svgPermission = `<svg t="1704530411834" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4211" width="32" height="32"><path d="M768 448h-128V64h128v128h192v128h-192v128z m192 256a256 256 0 1 1-256-256 256 256 0 0 1 256 256z m-256-128a128 128 0 1 0 128 128 128 128 0 0 0-128-128zM64 128h448v128H64V128z m320 448H64v-128h320v128z m-64 320H64v-128h256v128z" fill="#0590DF" p-id="4212"></path></svg>`

const emit = defineEmits(['updatePermission'])
function onUpdatePermission() {
  emit('updatePermission')
}
</script>

<style scoped lang="scss">
// 修改标题样式
.custom-table-header {
  background-color: #f5f7fa;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}

// 解决标题不能加粗的问题
:deep(*, *::before, *::after) {
  font-weight: inherit; // 继承父类
}

.color-red {
  color: #ef0000;
}

.color-gray {
  color: #545454;
}

.color-yellow {
  color: #c78600;
}

.color-green {
  color: #009800;
}

// 可点击单元格
.cell-can-click {
}

.cell-can-click:hover {
  text-decoration: underline; /* 显示下划线 */
  font-weight: 600;
  cursor: pointer; /* 将鼠标光标变为手指 */
}

:deep(.el-card) {
  height: 100% !important;
}

.role-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>
