import Vue from "nativescript-vue"
import routes from "./router";
import AuthService from "./services/AuthService"
import EditingUserService from "./services/EditingUserService"
import BackendService from './services/BackendService';
import * as firebase from "nativescript-plugin-firebase"

// To include the stylesheets, use this:
import "./styles.scss";

export const backendService = new BackendService();
export const authService = new AuthService();
export const editingUserService = new EditingUserService();

const v = <any>Vue;
declare const TNS_ENV: any;

v.prototype.$authService = authService;
v.prototype.$editingUserService = editingUserService;

firebase.init()
  .then(instance => {

    /*
    firebase.registerForPushNotifications(
        {
          showNotifications: true,
          showNotificationsWhenInForeground: true,
          onPushTokenReceivedCallback: token => console.log(`------------------- token received: ${token}`),
          onMessageReceivedCallback: message => console.log(`------------------- message received`)
        })
        .then(instance => console.log("registerForPushNotifications done"))
        .catch(error => console.log(`-------------- registerForPushNotifications error: ${error}`));
    */
  })
  .catch(error => console.log(`firebase.init error: ${error}`));

// Prints Vue logs when --env.production is *NOT* set while building
// v.config.silent = (TNS_ENV === 'production');

const loggedIn = authService.isLoggedIn();

if (loggedIn) {
  authService.userWrapper.user = authService.user;
  editingUserService.userWrapper.user = authService.userWrapper.user;
  editingUserService.watchUser();
}

new v({
  // TODO also check 'registered' state
  render: h => h("frame", [h(loggedIn ? routes.home : routes.onboarding)])
}).$start();
