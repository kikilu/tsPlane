import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store'
import axios from './util/axios'
import Element from 'element-ui'
import {Message} from "element-ui";
import plugin from './util/plugin';
import './assets/css/element-variables.scss';

Vue.use(plugin);
Vue.config.productionTip = false;
Vue.use(Element);
Vue.prototype.$http = axios;
router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('userInfo') || JSON.stringify(store.getters.userInfo) === '{}') {
    if (to.name == 'login') {
      next();
    } else {
      Message.error("登录过期");
      router.replace('/');
    }
  } else {
    let module = to.path.split('/')[1] ? to.path.split('/')[1] : 'index';
    // console.log('module:' + module);
    store.commit('ACTIVE_NAV', module);
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
