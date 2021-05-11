// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueMdl from 'vue-mdl'
import App from './App'
import router from './router'
import store from './store'

// Vue.config.productionTip = false

Vue.use(VueMdl)
axios.defaults.baseURL = process.env.BASE_URL
// axios.defaults.headers.get['Authorization'] = 'Bearer '+store.state.Token
// axios.defaults.headers.put['Authorization'] = 'Bearer '+store.state.Token

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
