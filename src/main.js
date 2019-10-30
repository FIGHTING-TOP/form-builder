// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview';
import 'iview/dist/styles/iview.css'
import cascaderMulti from 'cascader-multi';
import iviewArea from 'iview-area';
import custom_form from './components/custom_form';
import {$get, $http, $post} from "./utils/http";



Vue.config.productionTip = false;
Vue.use(iview);
Vue.use(cascaderMulti);
Vue.use(custom_form);
Vue.use(iviewArea);


Vue.prototype.$http = $http;
Vue.prototype.$get = $get;
Vue.prototype.$post = $post;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
