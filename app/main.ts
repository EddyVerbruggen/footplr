import Vue from "nativescript-vue"
import { isIOS } from "tns-core-modules/platform";
import { onAndroidKeyboardShowingListener } from "~/utils/keyboard-util";
import routes from "./router";
import AuthService from "./services/AuthService"
import EditingUserService from "./services/EditingUserService"
import * as firebase from "nativescript-plugin-firebase"
import {EventBus} from "~/services/event-bus";

// To include the stylesheets, use this:
import "./styles.scss";

export const authService = new AuthService();
export const editingUserService = new EditingUserService();

declare const IQKeyboardManager: any;
if (isIOS) {
  const iqKeyboard = IQKeyboardManager.sharedManager();
  iqKeyboard.enableAutoToolbar = false;
  iqKeyboard.keyboardDistanceFromTextField = 50;
  iqKeyboard.shouldResignOnTouchOutside = true;
}

// (<any>Vue).registerElement('WebImage', () => require('nativescript-web-image-cache').WebImage);
(<any>Vue).registerElement('NumericKeyboard', () => require('nativescript-numeric-keyboard').NumericKeyboardView);

const v = <any>Vue;
declare const TNS_ENV: any;

v.prototype.$authService = authService;
v.prototype.$editingUserService = editingUserService;

setTimeout(() => {
  onAndroidKeyboardShowingListener(showing => {
    // we only need to emit this in case of showing=false because on Android the 'blur' event doesn't fire
    if (!showing) {
      EventBus.$emit("keyboard-showing", showing);
    }
  });
}, 2000);

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
v.config.silent = true; // (TNS_ENV === 'production');

const loggedIn = authService.isLoggedIn();

if (loggedIn) {
  authService.userWrapper.user = authService.user;
  editingUserService.userWrapper.user = authService.userWrapper.user;
  editingUserService.watchUser();
}

new v({
  // TODO also check 'registered' state
  // render: h => h("frame", [h(loggedIn ? routes.home : routes.onboarding)])
  render: h => h("frame", [h(loggedIn ? routes.home : routes.login)])
}).$start();
