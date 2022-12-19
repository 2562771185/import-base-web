<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>


<script>

import Cookies from 'js-cookie'

export default {
  name: 'importPersonInfo',
  data() {
    return {

    }
  },
  mounted() {
  },
  created() {
    var token = Cookies.get("access_token");
    this.mytoken = {Authorization: token}
  },
  watch: {},
  methods:{
    goImportCl(){
    },
  }
}
</script>
<style>
.app-container {
  margin-bottom: 10px;
  width: 100%;
  height: auto;
  border-radius: 4px;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .06)
}
</style>
