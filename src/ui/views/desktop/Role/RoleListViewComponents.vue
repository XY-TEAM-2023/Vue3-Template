<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!--  角色列表  -->
    <el-card style="width: 260px" class="unselect">
      <!--  标题  -->
      <template #header>
        <div style="display: flex" class="flex-left-center">
          <ui-svg :svg-code="svgPermission" svg-size="24" svg-color="#3259ce" />
          <span style="margin: 2px 0 0 4px">
            {{ $t('roleComponentConfigView.title') }}
          </span>
        </div>
      </template>

      <!--  内容  -->

      <!--  底部  -->
      <template #footer>
        <div style="min-height: 40px; width: 100%">
          <span style="font-weight: bold"> {{ $t('roleListView.note') }}: </span>
          <span style="color: #4b4b4b">
            {{ selectRole ? selectRole.note : '' }}
          </span>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
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
