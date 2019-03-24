import { firestore } from "nativescript-plugin-firebase";
import Club from "~/models/club";

export default interface Team {
  ref: firestore.DocumentReference; // self
  id: string;
  agegroup?: number; // fi. J09 = 9, Seniors = undefined
  name: string; // "J09-7"

  // fetched in the app, not stored
  club?: Club;
}
