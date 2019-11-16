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
            component: () => import('_V/login')
        },
        {
            path: '/index',
            name: 'index',
            component: resolve => {require(['_V/index'], resolve)},
            redirect: '/index/systemIndex',
            children: [
                {
                    path: '/index/systemIndex',
                    name: 'systemIndex',
                    component: resolve => {require(['_V/index/systemIndex'], resolve)}
                },
                {
                    path: '/index/systemInfo',
                    name: 'systemInfo',
                    component: resolve => {require(['_V/index/systemInfo'], resolve)}
                },
                {
                    path: '/index/accountSetting',
                    name: 'accountSetting',
                    component: resolve => {require(['_V/index/accountSetting'], resolve)}
                },
                {
                    path: '/goods/list',
                    name: 'goodsList',
                    component: resolve => {require(['_V/goods/list'], resolve)}
                },
                {
                    path: '/goods/add',
                    name: 'add',
                    component: resolve => {require(['_V/goods/add'], resolve)}
                },
                {
                    path: '/goods/recycle',
                    name: 'recycle',
                    component: resolve => {require(['_V/goods/recycle'], resolve)}
                },
                {
                    path: '/goods/comment',
                    name: 'comment',
                    component: resolve => {require(['_V/goods/comment'], resolve)}
                },
                {
                  path: '/goods/comment/detail',
                  name: 'commentDetail',
                  component: resolve => {require(['_V/goods/commentDetail'], resolve)}
                },
                {
                    path: '/goods/category',
                    name: 'category',
                    component: resolve => {require(['_V/goods/category'], resolve)}
                },
                {
                    path: '/goods/category/addCategory',
                    name: 'addCategory',
                    component: resolve => {require(['_V/goods/addCategory'], resolve)}
                },
                {
                    path: '/goods/type',
                    name: 'type',
                    component: resolve => {require(['_V/goods/type'], resolve)}
                },
                {
                    path: '/goods/type/prop/:id',   //商品类型属性
                    name: 'prop',
                    component: resolve => {require(['_V/goods/prop'], resolve)}
                },
                {
                    path: '/goods/type/params/:id',   //商品类型属性
                    name: 'params',
                    component: resolve => {require(['_V/goods/params'], resolve)}
                },
                {
                    path: '/goods/type/addParams',   //商品类型属性
                    name: 'params',
                    component: resolve => {require(['_V/goods/addParams'], resolve)}
                },
                {
                    path: '/goods/type/addProp',    //添加商品类型属性
                    name: 'addProp',
                    component: resolve => {require(['_V/goods/addProp'], resolve)}
                },
                {
                    path: '/goods/brand',
                    name: 'brand',
                    component: resolve => {require(['_V/goods/brand'], resolve)}
                },
                {
                    path: '/goods/image',
                    name: 'image',
                    component: resolve => {require(['_V/goods/image'], resolve)}
                }
            ]
        }
    ]
});
