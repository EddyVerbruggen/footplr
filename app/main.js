import Vue from 'nativescript-vue'
import routes from './router';
import BackendService from './services/BackendService'
import AuthService from './services/AuthService'

import firebase from 'nativescript-plugin-firebase'

// To include the stylesheets, use this:
// import './styles.scss';

export const backendService = new BackendService()
export const authService = new AuthService()

Vue.registerElement('Shimmer', () => require('nativescript-shimmer').Shimmer)

Vue.prototype.$authService = authService

firebase.init()
  .then(instance => console.log("firebase.init done"))
  .catch(error => console.log(`firebase.init error: ${error}`));

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')
// Vue.config.debug = (TNS_ENV === 'development');

new Vue({
  render: h => h('frame', [h(backendService.isLoggedIn() ? routes.home : routes.login)])
}).$start()
