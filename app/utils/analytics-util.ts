import * as firebaseAnalytics from "nativescript-plugin-firebase/analytics/analytics"

export function setScreenName(screenName: string): void {
  firebaseAnalytics.setScreenName({
    screenName
  }).then(() => console.log(`Screen name "${screenName}" logged to Firebase`)).catch(err => console.log("nog logged: " + err));
}

export function setUserId(userId: string): void {
  firebaseAnalytics.setUserId({
    userId
  }).then(() => console.log(`User ID "${userId}" set in Firebase`));
}

export function setUserPropertyUsertype(value: "player" | "trainer"): void {
  const key = "usertype";
  firebaseAnalytics.setUserProperty({
    key,
    value
  }).then(() => console.log(`User property "${key}" set to "${value}" in Firebase`));
}

export function setUserProperty(key: string, value: string): void {
  firebaseAnalytics.setUserProperty({
    key,
    value
  }).then(() => console.log(`User property "${key}" set to "${value}" in Firebase`));
}

export function logEvent(key: "measurement_added", parameters?: any): void {
  firebaseAnalytics.logEvent({
    key,
    parameters
  }).then(() => console.log(`Event "${key}" logged in Firebase`));
}