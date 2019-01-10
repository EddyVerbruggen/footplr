import * as firebaseAnalytics from "nativescript-plugin-firebase/analytics/analytics"

export function setScreenName(screenName: string): void {
  firebaseAnalytics.setScreenName({screenName}).then(() => console.log(`Screen name "${screenName}" logged to Firebase`)).catch(err => console.log("nog logged: " + err));
}

export function setUserId(userId: string): void {
  firebaseAnalytics.setUserId({userId}).then(() => console.log(`User ID "${userId}" set in Firebase`));
}