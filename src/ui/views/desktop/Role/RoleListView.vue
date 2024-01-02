<template>
  <div style="display: flex; flex-direction: row; height: 100%">
    <!--  角色列表  -->
    <role-list-view-roles />

    <!--  菜单列表  -->
    <role-list-view-menus style="margin-left: 15px" />

    <!--  页面权限列表  -->
    <role-list-view-components style="margin-left: 15px" />
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import RoleListViewRoles from './RoleListViewRoles.vue'
import RoleListViewMenus from '@/ui/views/desktop/Role/RoleListViewMenus.vue'
import RoleListViewComponents from '@/ui/views/desktop/Role/RoleListViewComponents.vue'
</script>

<style scoped lang="scss"></style>
