<template>
  <div>Refreshing...</div>
</template>

<script>
export default {
  name: 'Refresh',
  mounted() {
    // 提取需要跳转回去的路由
    const redirectTo = this.$route.query.redirect || '/'
    // 使用$nextTick确保DOM更新完成后执行
    this.$nextTick(() => {
      // 重定向回原页面
      // console.log('>>>>>>>>>>>>>>>')
      this.$router.replace(redirectTo)
    })
  },
}
</script>
