import { firestore } from "nativescript-plugin-firebase";

export default interface Team {
  ref: firestore.DocumentReference; // self
  id: string;
  type: string; // "JO9"
  name: string; // "J09-7"
}