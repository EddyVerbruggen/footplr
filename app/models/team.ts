import { firestore } from "nativescript-plugin-firebase";

export default interface Team {
  ref: firestore.DocumentReference; // self
  id: string;
  name: string;
}