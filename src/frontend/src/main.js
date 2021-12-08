/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Main entry point of the frontend loading and linking libraries
*/

// Import ibraries
import Vue from 'vue';
import App from './App';
import router from './router';

// Website style
import BootstrapVue from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Axios for HTTP requests
import axios from 'axios';

// Datetime field
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

// Cookie manager
import VueCookie from 'vue-cookie';

// Datetime translation
import { Settings } from 'luxon';

// Google auth logic + button
import GoogleAuth from 'vue-google-oauth';

// Copy to clipboard lib
import VueClipboard from 'vue-clipboard2';

// Set website <head> for each page
import vueHeadful from 'vue-headful';

// For notifications
import VueNotify from 'vue-notifyjs';
import 'vue-notifyjs/themes/material.css';


// Default settings
Settings.defaultLocale = 'fr';
Vue.config.productionTip = false;

// Import moment.js and set to french
const moment = require('moment');
require('moment/locale/fr');


// Bind libraries to vue
Vue.use(BootstrapVue);
Vue.use(Datetime);
Vue.use(VueClipboard);
Vue.use(VueCookie);
Vue.use(require('vue-moment'), {
    moment
});
Vue.use(GoogleAuth, { 
    client_id: '794639233624-scr67dr9isr9uoa0mj447so56fp6olr9.apps.googleusercontent.com',
    scope:'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/calendar'
    //prompt:'consent'                 
});
Vue.googleAuth().load();
Vue.component('vue-headful', vueHeadful);
Vue.use(VueNotify);


//Global vars
Vue.prototype.$url = process.env.API_URL;

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});