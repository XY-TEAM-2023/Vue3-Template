<template>
  <div style="display: flex; flex-direction: row; height: 100%">
    <!--  角色列表  -->
    <role-list-view @select="onSelectRole" />

    <!--  菜单列表  -->
    <role-menus-view
      ref="menus"
      style="margin-left: 15px"
      :role-id="selectRole.id"
      @select-menu="onSelectMenu"
      @start-edit="displayComponentPermission = false"
      @cancel-edit="displayComponentPermission = true"
    />

    <!--  页面权限列表  -->
    <role-permission-view
      v-if="displayComponentPermission"
      style="margin-left: 15px"
      :role-id="selectRole.id"
      :menu="selectMenu"
      @update-permission="onUpdatePermission"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import RoleListView from './RoleListView.vue'
import RoleMenusView from './RoleMenusView.vue'
import RolePermissionView from './RolePermissionView.vue'

const selectRole = ref(reactive({ id: -1 }))
const selectMenu = ref(reactive({ name: '' }))

const displayComponentPermission = ref(true)

function onSelectRole(role) {
  selectRole.value = role
  selectMenu.value = { name: '' }
}

function onSelectMenu(menu) {
  console.log('~~~~~~~~~~~~~~~', menu)
  selectMenu.value = menu
}

const menus = ref(null)
function onUpdatePermission() {
  menus.value.requestMenus()
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
