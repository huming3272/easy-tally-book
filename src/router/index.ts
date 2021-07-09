import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Collection from '../views/Collection.vue';
import Information from '../views/Information.vue';
import Chart from '../views/Chart.vue';
import Statistics from '../views/Statistics.vue';
import Notfound from '../views/Notfound.vue';
import createTag from '../views/CreateTag.vue';
import Details from '../views/Details.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    // redirect: '/collection',
    redirect: '/statistics',
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection,
  },
  {
    path: '/information',
    name: 'Information',
    component: Information,
  },
  {
    path: '/chart',
    name: 'Chart',
    component: Chart,
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
  },
  {
    path: '/createTag',
    name: 'createTag',
    component: createTag,
  },
  {
    path: '/details',
    name: 'details',
    component: Details,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '*',
    component: Notfound,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
