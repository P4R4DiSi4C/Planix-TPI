/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Vue-router configuration
*/
// Import vue and router
import Vue from 'vue'
import Router from 'vue-router'

// Not found page
import NotFound from '@/pages/not_found'

//Planix

// Layout header footer
import planix_layout from '@/layouts/planix_layout'

// Home content
import planix_home from '@/planix/home'

// CP Content
import planix_cp from '@/planix/cp'

// Event content
import planix_event from '@/planix/event'

// Event
import planix_howto from '@/planix/howto'

// Define router
Vue.use(Router)

// Defines routes
let routes = [
    {
        path: '*', 
        component: NotFound
    },
    {
        path:'/',
        component: planix_layout,
        redirect: '/home',
        children:
        [
            {
                path:'home',
                name:'Home',
                component: planix_home
            },
            {
                path:'cp',
                name:'CP',
                component: planix_cp,
                meta: { requiresAuth: true}
            },
            {
                path:'event/:id',
                name:'Event',
                component: planix_event
            },
            {
                path:'howto',
                name:'Howto',
                component: planix_howto
            }
        ]
    }
]

// Set router option and defined routes
var router = new Router({
    mode: 'history',
    routes
});

// Check if logged for routes marked with meta => requiresAuth
router.beforeEach((to, from, next) => 
{
    if(to.matched.some(record => record.meta.requiresAuth)) 
    {
        // Check if token exists in session
        if(!localStorage.getItem('token')){
            next({path: '/'})
        }
    } 
    next();
})


export default router