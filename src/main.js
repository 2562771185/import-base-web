import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from "./router/index.js";

import Home from "./Home"

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  render: h => h(Home)
});
