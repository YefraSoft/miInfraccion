import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'  // Importa la vista de About

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView  // Define la ruta para AboutView.vue
  }
]

const router = new VueRouter({
  mode: 'history',  // Utiliza el modo de historial sin el hash (#)
  routes
})

export default router
