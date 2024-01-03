<template>
  <div style="display: flex; flex-direction: row; height: 100%">
    <!--  角色列表  -->
    <role-list-view-roles @select="onSelectRole" />

    <!--  菜单列表  -->
    <role-list-view-menus style="margin-left: 15px" :role-id="selectRole.id" />

    <!--  页面权限列表  -->
    <role-list-view-components style="margin-left: 15px" />
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import RoleListViewRoles from './RoleListViewRoles.vue'
import RoleListViewMenus from '@/ui/views/desktop/Role/RoleListViewMenus.vue'
import RoleListViewComponents from '@/ui/views/desktop/Role/RoleListViewComponents.vue'

const selectRole = ref(reactive({ id: -1 }))

function onSelectRole(role) {
  console.log('?????????', role)
  selectRole.value = role
}
</script>

<style scoped lang="scss">
:deep(*, *::before, *::after) {
  font-weight: inherit; // 继承父类
}

.role-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>
