import Vue from 'vue';
import Router from "vue-router"

Vue.use(Router);
export default new Router({
    base: process.env.BASE_URL,
    // mode: 'history',
    routes: [
        {
            path: "/login",
            name: 'login',
            component: () => import('@/views/login')
        },
        {
            path: '/index',
            name: 'index',
            component: resolve => {require(['@/views/index'], resolve)},
            // redirect: '/index/systemIndex',
            children: [
                {
                    path: '/index/systemIndex',
                    name: 'systemIndex',
                    component: resolve => {require(['@/views/index/systemIndex'], resolve)}
                },
                {
                    path: '/index/systemInfo',
                    name: 'systemInfo',
                    component: resolve => {require(['@/views/index/systemInfo'], resolve)}
                },
                {
                    path: '/index/accountSetting',
                    name: 'accountSetting',
                    component: resolve => {require(['@/views/index/accountSetting'], resolve)}
                },
                {
                    path: '/goods/list',
                    name: 'goodsList',
                    component: resolve => {require(['@/views/goods/list'], resolve)}
                },
                {
                    path: '/goods/add',
                    name: 'add',
                    component: resolve => {require(['@/views/goods/add'], resolve)}
                },
                {
                    path: '/goods/recycle',
                    name: 'recycle',
                    component: resolve => {require(['@/views/goods/recycle'], resolve)}
                },
                {
                    path: '/goods/comment',
                    name: 'comment',
                    component: resolve => {require(['@/views/goods/comment'], resolve)}
                },
                {
                    path: '/goods/category',
                    name: 'category',
                    component: resolve => {require(['@/views/goods/category'], resolve)}
                },
                {
                    path: '/goods/type',
                    name: 'type',
                    component: resolve => {require(['@/views/goods/type'], resolve)}
                },
                {
                    path: '/goods/brand',
                    name: 'brand',
                    component: resolve => {require(['@/views/goods/brand'], resolve)}
                },
                {
                    path: '/goods/image',
                    name: 'image',
                    component: resolve => {require(['@/views/goods/image'], resolve)}
                }
            ]
        }
    ]
});
