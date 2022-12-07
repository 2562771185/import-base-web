
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import AppTY from "@/view/AppTY";
import AppXczx from "@/view/AppXczx";
import AppRsj from "@/view/AppRsj";
import Home from "@/view/Home";
import AppCl from "@/view/AppCl";


Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(AppXczx)
});
