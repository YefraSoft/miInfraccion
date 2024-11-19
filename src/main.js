import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false;

// Usar BootstrapVue y los íconos
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// Configurar Axios y vue-axios
Vue.use(VueAxios, Axios);

// Importar estilos de BootstrapVue y Bootstrap
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
