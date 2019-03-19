<template>
  <Page actionBarHidden="true" backgroundSpanUnderStatusBar="false" @loaded="pageLoaded">
    <GridLayout rows="*" columns="*">
      <Img src="~/assets/images/ball.png" class="m-t-24" width="64" height="64" horizontalAlignment="center" verticalAlignment="center"></Img>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import * as firebase from "nativescript-plugin-firebase"
  import * as application from "tns-core-modules/application";
  import { applicationSettingsService } from "~/main";
  import routes from "~/router";

  export default {
    data() {
      return {
        initDone: false
      }
    },

    methods: {
      goToNexPage() {
        // const route = this.$authService.isLoggedIn() ? routes.home : (applicationSettingsService.getUsername() ? routes.login : routes.onboarding);
        const route = applicationSettingsService.getUsername() ? routes.login : routes.onboarding;
        this.$navigateTo(route, {clearHistory: true});
      },

      pageLoaded() {
        if (this.initDone) {
          console.log(">> not initing again!");
          this.goToNexPage();
          return;
        }

        firebase.init()
            .then(instance => {
              console.log(">> firebase initialized");
              this.initDone = true;

              application.on(application.suspendEvent, () => {
                if (this.$authService.isLoggedIn()) {
                  this.$editingUserService.clearListener();
                }
              });

              application.on(application.resumeEvent, () => {
                if (this.$authService.isLoggedIn()) {
                  this.$authService.userWrapper.user = this.$authService.user;
                  if (this.$editingUserService.userWrapper && this.$editingUserService.userWrapper.user) {
                    this.$editingUserService.watchUser();
                  }
                }
              });

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

              application.on(application.uncaughtErrorEvent, args => {
                if (application.android) {
                  // For Android applications, args.android is an NativeScriptError.
                  console.log(" *** NativeScriptError *** : " + args.android);
                  console.log(" *** StackTrace *** : " + args.android.stackTrace);
                  console.log(" *** nativeException *** : " + args.android.nativeException);
                  firebase.crashlytics.sendCrashLog(args.android.nativeException);
                } else if (application.ios) {
                  // For iOS applications, args.ios is NativeScriptError.
                  console.log(" *** NativeScriptError  *** : " + args.ios);
                  firebase.crashlytics.sendCrashLog(args.ios);
                }
              });

              this.goToNexPage();
            })
            .catch(error => console.log(`firebase.init error: ${error}`));
      }
    }
  };
</script>

<style scoped>
</style>
