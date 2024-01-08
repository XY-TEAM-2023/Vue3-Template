<template>
  <el-dropdown :trigger="trigger" @visible-change="onDropdownVisibleChange">
    <div
      class="il-box"
      v-bind:class="{ 'il-box-hover': isHovered || isShowDropdown || forceOpen }"
      @mouseenter="setHovered(true)"
      @mouseleave="setHovered(false)"
      @click="showDropdown"
    >
      <div>
        <el-avatar :size="props.size" :icon="UserFilled" />
      </div>
      <div class="user-info">
        <div class="user-name">
          {{ userStore.account }}
        </div>
        <div class="user-role">
          {{ userStore.role_name }}
        </div>
      </div>
      <el-icon class="btn-arrow">
        <CaretBottom />
      </el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu class="unselect">
        <el-dropdown-item @click="onUserInfo">{{ $t('userInfoView.router') }}</el-dropdown-item>
        <el-dropdown-item @click="onSingOut"> {{ $t('app.signOut') }} </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { CaretBottom, UserFilled } from '@element-plus/icons-vue'
import router from '@/router'
import { config } from '@/config'

/** 作为组件时，外部传参 */
const props = defineProps({
  size: {
    type: Number,
    default: 50,
  },
  forceOpen: Boolean,
})

const trigger = 'click' // isMobile() ? 'click' : 'hover'

/** 用户全局数据对象 */
const userStore = useUserStore()

/** 跳转到用户页面 */
function onUserInfo() {
  console.log('跳转到用户页面')
}

const isHovered = ref(false)
function setHovered(value) {
  isHovered.value = value
}

const isShowDropdown = ref(false)
function showDropdown() {
  isShowDropdown.value = true
}

function onDropdownVisibleChange(visible) {
  if (visible) {
    return
  }
  isShowDropdown.value = false
}

/** 注销 */
function onSingOut() {
  userStore.logout()
}
</script>

<style scoped lang="scss">
/* 组件样式 */
$color-icon: #f6f1f1;
$color-name: #f6f1f1;
$color-role: #fffd87;
$color-bg: #4d5056;
$icon-size: 35px;

.il-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: $icon-size;
  background-color: $color-bg;
  border-radius: 50px;
  transition: all 0.1s;
  overflow: clip;
}
.il-box-hover {
  width: 100px;
  background-color: $color-bg;
  border-radius: 50px;
  cursor: pointer;

  .el-avatar {
    background-color: $color-icon;
    color: $color-bg;
    border: 3px solid $color-bg;
  }

  .btn-arrow {
    color: $color-icon;
  }
}

.el-avatar {
  background-color: $color-bg;
  color: $color-icon;
  font-size: 22px;
  width: $icon-size;
  height: $icon-size;
}

.user-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 1px;
  margin-left: 2px;
  justify-content: center;
  align-items: flex-start;
  margin-right: auto;
  white-space: nowrap; /* 防止文字换行 */
}

.user-name {
  color: $color-name;
  font-size: 12px;
  //font-weight: bold;
}

.user-role {
  color: $color-role;
  font-size: 11px;
  margin-top: 2px;
}

.btn-arrow {
  margin-right: 3px;
}
</style>
