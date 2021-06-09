import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Tags from '@/components/Tags.vue';
import Icon from '@/components/Icon.vue';

Vue.config.productionTip = false;

Vue.component('Tags', Tags);
Vue.component('Icon', Icon);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
