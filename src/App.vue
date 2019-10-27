<template>
  <div id="app">
  <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    font-family: '微软雅黑 Light';
  }

  body {
    line-height: 1;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .flex.h-center {
    align-items: center;
  }
  .flex-1 {
    flex: 1;
  }

</style>
