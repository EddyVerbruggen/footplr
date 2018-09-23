import Vue from 'nativescript-vue'
import routes from './router';
import BackendService from './services/BackendService'
import AuthService from './services/AuthService'

import * as firebase from 'nativescript-plugin-firebase'

// To include the stylesheets, use this:
// import './styles.scss';

export const backendService = new BackendService();
export const authService = new AuthService();

const v = <any>Vue;
declare const TNS_ENV: any;

v.registerElement('Shimmer', () => require('nativescript-shimmer').Shimmer);

v.prototype.$authService = authService;

firebase.init()
  .then(instance => console.log("firebase.init done"))
  .catch(error => console.log(`firebase.init error: ${error}`));

// Prints Vue logs when --env.production is *NOT* set while building
// v.config.silent = (TNS_ENV === 'production');

new v({
  render: h => h('frame', [h(backendService.isLoggedIn() ? routes.home : routes.login)])
}).$start();
