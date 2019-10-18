import Vue from "nativescript-vue"
import { isIOS } from "tns-core-modules/platform";
import ApplicationSettingsService from "./services/ApplicationSettingsService";
import routes from "./router";
import AuthService from "./services/AuthService"
import EditingUserService from "./services/EditingUserService"

require ("nativescript-plugin-firebase");

export const authService = new AuthService();
export const editingUserService = new EditingUserService();
export const applicationSettingsService = new ApplicationSettingsService();

declare const IQKeyboardManager: any;
if (isIOS) {
  const iqKeyboard = IQKeyboardManager.sharedManager();
  iqKeyboard.enableAutoToolbar = false;
  iqKeyboard.keyboardDistanceFromTextField = 60;
  iqKeyboard.shouldResignOnTouchOutside = true;
}

// (<any>Vue).registerElement('WebImage', () => require('nativescript-web-image-cache').WebImage);
(<any>Vue).registerElement('NumericKeyboard', () => require('nativescript-numeric-keyboard').NumericKeyboardView);
(<any>Vue).registerElement('YoutubePlayer', () => require('nativescript-youtubeplayer').YoutubePlayer);

const v = <any>Vue;
declare const TNS_ENV: any;

v.prototype.$authService = authService;
v.prototype.$editingUserService = editingUserService;

// Prints Vue logs when --env.production is *NOT* set while building
v.config.silent = true; // (TNS_ENV === 'production');

if (authService.isLoggedIn()) {
  authService.userWrapper.user = authService.user;
  editingUserService.userWrapper.user = authService.userWrapper.user;
}

new v({
  render: h => h("frame", [h(routes.loading)])
}).$start();
