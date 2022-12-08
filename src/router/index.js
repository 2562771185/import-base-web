import Router from 'vue-router'
import Vue from 'vue'

import AppCommon from "@/view/AppCommon";

Vue.use(Router)

const router = new Router({
    routes:[
        {
            path:'/import',
            name:'import',
            component: AppCommon
        },
    ]
})
export default router;
