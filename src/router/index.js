import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';  // Componente del Dashboard


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView  // Aquí tienes tu componente de login
  },
  {
    path: '/login',
    name: 'login',
    component: HomeView  // El formulario de login está en HomeView.vue
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView  // Componente del Dashboard
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
