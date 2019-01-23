import { firestore } from "nativescript-plugin-firebase";

export default interface Team {
  ref: firestore.DocumentReference; // self
  id: string;
  agegroup?: number; // fi. J09 = 9, Seniors = undefined
  name: string; // "J09-7"
}